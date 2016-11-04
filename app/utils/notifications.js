function checkNotifications() {
  if (window && "Notification" in window)
    Notification.requestPermission();
}

function sendGameNotification() {
  if (document && !document.hasFocus()) {
    let title = 'Your game is starting!';
    let options = {body: 'CLICK to go there now'};
    var n = new Notification(title, options);

    n.onclick = function() {
      if (window) window.focus();
    };

    window.onfocus = function() {
      n.close();
      window.onfocus = null;
    };
  }
}

export {checkNotifications, sendGameNotification};
