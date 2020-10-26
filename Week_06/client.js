const net = require('net')
class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = "application/x-www-form-urlencoded";
    }
    if (this.headers['Content-Type'] === 'applicaiton/json')
      this.bodyText = JSON.stringify(this.body);
    else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded')
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).toString();
    this.headers['Content-Length'] = this.bodyText.length;
  }
  send(connection) {
    return new Promise((reslove, reject) => {
      const parser = new ResponseParser;
      if (connection) {
        connection.write(this.toString);
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString());
        })
      }
      connection.on('data', (data) => {
        console.log(data.toString());
        parser.recive(data.toString());
        if (parser.isFinished) {
          reslove(parser.response);
          connection.end()
        }
      });
      connection.on('error', err => {
        reject(err);
        connection.end();
      });
    });
  }
  toString() {
    // 注意请求头格式，拼错会造成请求失败
    return `${this.method} ${this.path} HTTP/1.1\r\n${
      Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
      \r\n\r\n${this.bodyText}`;
  }
}

class ResponseParser {
  constructor() {
    // HTTP/1.1 200 OK\r\n
    this.WAITTING_STATUS_LINE = 0;// 状态行
    this.WAITTING_STATUS_LINE_END = 1;// 状态行结束

    // response头
    /* 
      Content-type: text/html\r\n
      Date: Mon, 12 Oct 2020 15:19:56 GMT\r\n
      Connection: keep-alive\r\n
      Transfer-Encoding: chunked\r\n
    */
    this.WAITTING_HEADER_NAME = 2;// key Content-type
    this.WAITTING_HEADER_SPACE = 3;// 空格
    this.WAITTING_HEADER_VALUE = 4;// value
    this.WAITTING_HEADER_LINE_END = 5;// 一行结束
    this.WAITTING_HEADER_BLOCK_END = 6;// 整个response头结束

    // body
    /* 
      d 数据长度(十六进制)
      hello world 返回的内容
    
      0 结束
    */
    this.WAITTING_BODY = 7;// body

    this.current = this.WAITTING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;

  }
  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
  recive(string) {
    for (let i = 0; i < string.length; i++) {
      this.reciveChar(string.charAt(i))
    }
  }
  reciveChar(char) {
    if(this.current === this.WAITTING_STATUS_LINE) {
      if(char === '\r') {
        this.current = this.WAITTING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITTING_STATUS_LINE_END) {
      if(char === '\n') {
        this.current = this.WAITTING_HEADER_NAME;
      }
    } else if (this.current === this.WAITTING_HEADER_NAME) {
      if(char === ':') {
        this.current = this.WAITTING_HEADER_SPACE;
      } else if (char === '\r') {
        this.current = this.WAITTING_HEADER_BLOCK_END;
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITTING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITTING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITTING_HEADER_VALUE){
      if (char === '\r') {
        this.current = this.WAITTING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITTING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITTING_HEADER_NAME;
      }
    } else if (this.current === this.WAITTING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITTING_BODY;
      }
    } else if (this.current === this.WAITTING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
}

class TrunkedBodyParser{
  constructor() {
    this.WAITTING_LENGTH = 0;// body长度
    this.WAITTING_LENGTH_LINE_END = 1;// body长度行结束
    this.READING_TRUNK = 2;// body内容
    this.WAITTING_NEW_LINE = 3;// 新行
    this.WAITTING_NEW_LINE_END = 4;// 新行结束
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITTING_LENGTH;
  }

  receiveChar(char) {
    if (this.current === this.WAITTING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITTING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WAITTING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      this.content.push(char);
      this.length --;
      if (this.length === 0) {
        this.current = this.WAITTING_NEW_LINE;
      }
    } else if (this.current === this.WAITTING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITTING_NEW_LINE_END;
      }
    } else if (this.current === this.WAITTING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITTING_LENGTH;
      }
    }
  }
}

void async function() {
  let request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8081,
    path: '/',
    headers: {
      ['X-Foo2']: 'customed'
    },
    body: {
      name: 'zhangsan'
    }
  });
  let response = await request.send();
  console.log(111, response);
  // parser.parseHtml(response.body)
}();

