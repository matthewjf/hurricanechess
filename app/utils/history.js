import State from '../../state/state';

// it's better if you don't read this code
function _buildState(moveJson) {
  if (!moveJson || moveJson.length === 0) return {};

  let parsedData = _parseHistory(moveJson);
  var moveData = parsedData.moves;
  var init = parsedData.init;
  var end = parsedData.end;
  var endTime = new Date(end.createdAt) - new Date(init.createdAt);
  var frames = [];
  var state = $.extend(true, {}, init.data);
  var startTime = new Date(init.createdAt);

  for (var i in moveData) {
    frames.push(_cloneAndUpdate(moveData[i], state, startTime));
  }

  return {init: init.data, end: end.data, frames: frames, endTime: endTime};
};

function _parseHistory(moveJson) {
  var parsed = [];
  var init, end;
  for (var i in moveJson) {
    var move = JSON.parse(moveJson[i]);
    if (move.action === 'game-init') init = move;
    else if (move.action === 'game-end') end = move;
    else parsed.push(move);
  }

  var moves = parsed.sort((a,b) =>{
    if (a.createdAt > b.createdAt) return 1;
    else return -1;
  });

  return {init: init, end: end, moves: moves};
};

function _cloneAndUpdate(move, state, startTime) {
  let pieceId = move.data.pieceId, newData = move.data.newData;
  State.updatePiece(pieceId, newData, state);
  let clonedState = $.extend(true, {}, state);
  return {state: clonedState, elapsed: new Date(move.createdAt) - startTime};
};

var HistoryHelper = {buildState: _buildState};

export default HistoryHelper;
