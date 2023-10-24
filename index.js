// server
const express = require('express');
const app = express();
app.use(express.json())
const http = require('http');
const server = http.createServer(app);
// websocket
const { Server } = require("socket.io");
const io = new Server(server);

let usuarios = []

// endpoint principal
app.get('/', (req, res) => {
  res.send('<h1>WebSocket para projecto de IoE</h1>');
});

// endpoint para ver usuarios conectados
app.get('/usuarios',(req, res)=>{
  res.send({'result':usuarios})
})

//  WebSocket
io.on('connection', socket => {
  console.log('connection')
  console.log(socket.id)

  socket.on('privado', (msg, to)=>{
    io.to(to).emit('privado', msg)
    console.log(`${msg} - ${to}`)
  })

  socket.on('success', (msg) => {
    console.log(msg)
  })

  socket.on('user_client', (nameClient) => {
    usuarios.push({
      name: nameClient,
      socketId: socket.id
    })
    console.log(usuarios)
  })

  socket.on('disconnect', () => {
    usuarios = [...usuarios.filter(item => item.socket_id !== socket.id)];
    io.emit('usuarios', usuarios)
  });
});

console.log(usuarios)

// Iniciar server
server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});