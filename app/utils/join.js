var Join = function(room){
  socket.removeAllListeners("reconnect");

  socket.emit('join', {room: room});

  socket.on('joined', (data) => {
    console.log("joined room: " + data.room);
  });

  socket.on('reconnect', () => {
    console.log('joining room: ' + room);
    socket.emit('join', {room: room});
  });
};

export default Join;
