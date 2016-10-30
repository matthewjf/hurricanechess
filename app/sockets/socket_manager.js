var SocketManager = {
  join(room, payload, successCB){
    socket.on('joined-' + room, (data) => {
      if (successCB)
        successCB(data);
    });

    this.connect = () => {
      socket.emit('join-' + room, payload);
    };

    socket.emit('join-' + room, payload);

    setTimeout(function() {
      socket.on('connect', this.connect);
    }.bind(this), 100);
  },

  leave(room){
    socket.off("connect", this.connect);
    socket.off("joined-" + room);
  }
};

export default SocketManager;
