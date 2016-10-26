import {EventEmitter} from 'events';
import HistoryHelper from './history';
import PieceActions from '../actions/piece_actions';

// history state
var _initState, _endState, _endTime, _frames;

// playback state
var _status, _elapsed = 0, _frameIdx = -1;

var CHANGE_EVENT = 'change';
var STEP = 10;
var JUMP = 10;

// initialize
function _setState(history) {
  _clearState();
  if (history) {
    let historyData = HistoryHelper.buildState(history.moves);
    _status = 'ended';
    _initState = historyData.init;
    _endState = historyData.end;
    _endTime = historyData.endTime;
    _frames = historyData.frames;
    _sendFrame('end');
  }
};

function _clearState() {
  _status = undefined;
  _initState = undefined;
  _endState = undefined;
  _endTime = undefined;
  _frames = undefined;
  _elapsed = 0;
  _frameIdx = -1;
}

function _getLastFrame(startIdx = -1) {
  var newIdx;
  for (var i = startIdx + 1; i <= _frames.length; i++) {
    if (!_frames[i] || _elapsed <= _frames[i].elapsed) { break; }
    newIdx = i;
  }
  return newIdx;
}

function _sendFrame(id) {
  if (id === 'init') { // init frame
    PieceActions.receiveState(_initState);
  } else if (id === 'end') { // end frame
    PieceActions.receiveState(_endState);
  } else if (Number.isInteger(id)) { // specified frame by ID
    PieceActions.receiveState(_frames[id].state);
  } else { // fallback to current frame
    PieceActions.receiveState(_frames[_frameIdx].state);
  }
}

class Playback extends EventEmitter {
  constructor() {
    super();
  }

  // read state
  status() {
    return _status;
  }

  hasHistory() {
    return !!_endState;
  }

  // playback actions
  play() {
    if (_status === 'playing') return;
    if (_status === 'ended') {
      _sendFrame('init');
      $('.piece-wrapper', '#pieces').addClass('no-transition');
    };
    _status = 'playing';
    clearInterval(this.interval);
    this.interval = setInterval(this._playStep.bind(this), STEP);
    $('.timer', '#pieces').removeClass('paused');

    // TODO: use event from component did update and pause playback until update complete
    setTimeout(() => {
      $('.piece-wrapper', '#pieces').removeClass('no-transition');
    }, 50);

    this.emitChange();
  }

  _playStep() {
    if (_elapsed > _endTime) return this.end(); // end playback if elapsed > total game time
    _elapsed += STEP; // increment elapsed time

    var lastFrame = _frames[_frameIdx]; // increment elapsed and return if elapsed is before last frame sent
    if (lastFrame && _elapsed <= lastFrame.elapsed) return;
    var newIdx = _getLastFrame(_frameIdx); // find next frame
    if (newIdx) { // update current frame and send state if next frame
      _frameIdx = newIdx;
      _sendFrame(newIdx);
    }
  }

  pause() {
    _status = 'paused';
    clearInterval(this.interval);
    $('.timer', '#pieces').addClass('paused');
    this.emitChange();
  }

  end() {
    clearInterval(this.interval);
    _status = 'ended', _elapsed = 0, _frameIdx = -1;
    _sendFrame('end');
    $('.piece-wrapper', '#pieces').addClass('no-transition');
    $('.timer', '#pieces').removeClass('paused');
    $('.timer', '#pieces').finish();
    this.emitChange();
  }

  jumpForward() {
    _elapsed += (JUMP * 1000);
    this.jumpComplete();
  }

  jumpBackward() {
    _elapsed = _elapsed - (JUMP * 1000) < 0 ? 0 : _elapsed - (JUMP * 1000);
    this.jumpComplete();
  }

  jumpComplete() {
    $('.piece-wrapper', '#pieces').addClass('no-transition');

    if (!_elapsed) return _sendFrame('init');
    if (_elapsed > _endTime) return this.end();

    _frameIdx = _getLastFrame();
    _sendFrame();


    setTimeout(() => {
      $('.piece-wrapper', '#pieces').removeClass('no-transition');
      if (_status === 'paused') $('.timer', '#pieces').addClass('paused');
      if (_status === 'ended') this.play();
    }, 50);
  }

  // write state
  receiveHistory(history) {
    _setState(history);
    this.emitChange();
  }

  removeHistory() {
    clearInterval(this.interval);
    _setState();
    this.emitChange();
  }

  // emit
  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

export default new Playback();
