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
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('privado', (msg, to)=>{
    io.to(to).emit('privado', msg)
    console.log(`${msg} - ${to}`)
  })

  socket.on('usuarios', (user)=> {
    usuarios.push({
      'socket_id':socket.id,
    })
    io.emit('usuarios', usuarios)
   })

  socket.on('update', () => {
    io.emit();
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