var _tileSize = function() {
  return Math.min(document.documentElement.clientWidth / 8, 64);
};

var display = {
  tileSize: _tileSize
};

export default display;
