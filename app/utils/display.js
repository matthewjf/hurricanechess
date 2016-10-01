var _tileSize = function() {
  var width = document.documentElement.clientWidth;
  switch (true) {
    case (width < 480): return 45;
    case (width < 600): return 60;
    default:            return 75;
  }
};

var display = {
  tileSize: _tileSize
};

export default display;
