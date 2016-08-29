var SocketManager = {
  join(room, success){
    socket.on('joined', (data) => {
      console.log("joined room: " + data.room);
    });

    socket.on('reconnect', () => {
      console.log('joining room: ' + room);
      socket.emit('join', {room: room});
    });

    socket.emit('join', {room: room});
  },

  leave(){
    socket.off("reconnect");
    socket.off("joined");
  }
};

export default SocketManager;
