const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (error) => {
    console.log(error);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log(body);
    response.writeHead(200, {'Content-type': 'text/html'})
    response.end(`<html lang="en">
<head>
  <meta charset="UTF-8"></meta>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
  <title>Document</title>
  <style>
    body div #my {
      width: 100%;
      height: 100%;
    }
    body div img {
      width: 40px;
      height: 40px;
    }
  </style>
</head>
<body>
  <div>
    <p id="my">hello world</p>
    <img />
  </div>
</body>
</html>`);
  })
}).listen(8081);

console.log('sever is started');