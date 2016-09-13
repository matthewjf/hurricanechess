// Each pos is assigned an ID in [0, 63] and is stored in Redis that way
// convert to coords to make game logic friendlier
const SIZE = require('../config/game').size;

var toCoord = function(pos) {
  if (pos >= SIZE * SIZE || pos < 0)
    throw new RangeError(pos + ' is not a valid position');
  return [Math.floor(pos/SIZE), pos % SIZE];
};

var toPos = function(coord) {
  if (coord[0] >= SIZE || coord[1] >= SIZE || coord[0] < 0 || coord[1] < 0)
    throw new RangeError(coord, ' could not be converted to position');
  return (coord[0] * SIZE) + coord[1];
};

export {toCoord, toPos};
