var SocketManager = {
  join(room, payload, successCB) {
    socket.on('joined-' + room, (data) => {
      if (successCB)
        successCB(data);
    });

    this.connect = () => {
      socket.emit('join-' + room, payload);
    };

    socket.on('connect', this.connect);
    if (socket.connected) socket.emit('join-' + room, payload);
  },

  leave(room){
    socket.off("connect", this.connect);
    socket.off("joined-" + room);
  }
};

export default SocketManager;
