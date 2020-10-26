const net = require('net')

function connect() {
  let connection = net.createConnection({host: '127.0.0.1', port: 8081}, () => {
    console.log(333)
    connection.write("")
    console.log('1111')
  })

  connection.on('data', data => {
    console.log(data.toString())
  })
  connection.on('error', err => {
    console.log(err)
    connection.end()
  })
}

connect()