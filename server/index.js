const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "draw-me-frontend.vercel.app"
    }
});

//Add this before the app.get() block
let users = [];

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  

  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
  });

  //Listens when a new user joins the server
  socket.on('newUser', (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', users);
    console.log(users);
  });
  

 socket.on('drawrectangle',(data)=>{
  socket.broadcast.emit('drawrectangle',data);
 })
 socket.on('drawcircle',(data)=>{
  socket.broadcast.emit('drawcircle',data);
 })
 socket.on('drawpencil',(data)=>{
  socket.broadcast.emit('drawpencil',data);
 })
 socket.on('colorchange',(color)=>{
  socket.broadcast.emit('colorchange',color);
 });
  socket.on('eraserchange',(color)=>{
    socket.broadcast.emit('eraserchange',color);
  });
  socket.on('increasechange',()=>{
    socket.broadcast.emit('increasechange');
  });
  socket.on('decreasechange',()=>{
    socket.broadcast.emit('decreasechange');
  });
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    //Updates the list of users when a user disconnects from the server
    
    // console.log(users);
    //Sends the list of users to the client
    
    socket.disconnect();
  });
});
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

