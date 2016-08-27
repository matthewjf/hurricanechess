var Subscribe = function(room){
  socket.removeAllListeners("reconnect");

  socket.emit('subscribe', {room: room});

  socket.on('subscribed', (data) => {
    console.log("subscribed to room: " + data.room);
  });

  socket.on('reconnect', () => {
    console.log('subscribing to room: ' + room);
    socket.emit('subscribe', {room: room});
  });
};

export default Subscribe;
