const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (error) => {
    console.log(error);
  }).on('data', (chunk) => {
    console.log(chunk)
    body.push(chunk.toString());
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log(body);
    response.writeHead(200, {'Content-type': 'text/html'})
    response.end('hello world \n');
  })
}).listen(8081);

console.log('sever is started');