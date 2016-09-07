// Each pos is assigned an ID in [0, 63] and is stored in Redis that way
// convert to coords to make game logic friendlier
const SIZE = 8;

function toCoord(pos) {
  if (pos >= SIZE * SIZE || pos < 0)
    throw new Error(pos + ' is not a valid position');
  return [Math.floor(pos/SIZE), pos % SIZE];
}

function toPos(coord) {
  if (coord[0] >= SIZE || coord[1] >= SIZE || coord[0] < 0 || coord[1] < 0)
    throw new Error(coord, ' could not be converted to position');
  return (coord[0] * SIZE) + coord[1];
}

export {toCoord, toPos};
