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
  <style>
    body #container {
      display:flex;
      width:500px;
      height:300px;
      background-color: rgb(255,255,255)
    }
    body div .myid {
      width:200px;
      height: 100px;
      background-color: rgb(255,0,0)
    }
    body div #c1 {
      flex:1;
      background-color: rgb(0,255,0)
    }
  </style>
</head>
<body>
  <div class="container">
    <div id="myid">hello world</div>
    <div class="c1"></div>
  </div>
</body>
</html>`);
  })
}).listen(8081);

console.log('sever is started');