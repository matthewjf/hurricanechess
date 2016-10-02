var SocketManager = {
  join(room, payload, successCB){
    socket.on('joined-' + room, (data) => {
      if (successCB)
        successCB(data);
    });

    socket.on('connect', () => {
      socket.emit('join-' + room, payload);
    });

    socket.emit('join-' + room, payload);
  },

  leave(room){
    socket.off("connect");
    socket.off("joined-" + room);
  }
};

export default SocketManager;
