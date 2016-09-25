var _boardSize = 8;
var _tileSize = 64;

var _setTileSize = function(size) {_tileSize = size;};

var display = {
  boardSize: _boardSize,
  tileSize: _tileSize,
  gridSize: _boardSize * _tileSize,
  boardSizePx: _boardSize + 'px',
  tileSizePx: _tileSize + 'px',
  gridSizePx: (_boardSize * _tileSize) + 'px',
  setTileSize: _setTileSize
};

export default display;
