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
    _initState = historyData.init;
    _endState = historyData.end;
    _endTime = historyData.endTime;
    _frames = historyData.frames;
    _status = 'ended';
    PieceActions.receiveState(_endState);
  }
};

function _clearState() {
  _status = undefined;
  _initState = undefined;
  _endState = undefined;
  _endTime = undefined;
  _frames = undefined;
}

function _getLastFrame(startIdx = -1) {
  var newIdx;
  for (var i = startIdx + 1; i <= _frames.length; i++) {
    if (!_frames[i] || _elapsed <= _frames[i].elapsed) { break; }
    newIdx = i;
  }
  return newIdx;
}

class PlaybackStore extends EventEmitter {
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
      PieceActions.receiveState(_initState);
      $('.piece-wrapper', '#pieces').addClass('no-transition');
    };
    _status = 'playing';
    clearInterval(this.interval);
    this.interval = setInterval(this._playStep.bind(this), STEP);
    $('.timer', '#pieces').removeClass('paused');
    setTimeout(() => {$('.piece-wrapper', '#pieces').removeClass('no-transition');}, 50);
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
      PieceActions.receiveState(_frames[newIdx].state);
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
    PieceActions.receiveState(_endState);
    $('.piece-wrapper', '#pieces').addClass('no-transition');
    $('.timer', '#pieces').removeClass('paused');
    $('.timer', '#pieces').finish();
    this.emitChange();
  }

  jumpForward() {
    _elapsed += (JUMP * 1000);
    if (_status === 'ended') this.play();
    $('.piece-wrapper', '#pieces').addClass('no-transition');
    setTimeout(() => {
      $('.piece-wrapper', '#pieces').removeClass('no-transition');
    }, 50);
  }

  jumpBackward() {
    _elapsed = _elapsed - (JUMP * 1000) < 0 ? 0 : _elapsed - (JUMP * 1000);
    if (!_elapsed) PieceActions.receiveState(_initState);
    _frameIdx = _getLastFrame();
    if (_status === 'ended') this.play();
    $('.piece-wrapper', '#pieces').addClass('no-transition');
    setTimeout(() => {
      $('.piece-wrapper', '#pieces').removeClass('no-transition');
    }, 50);
  }

  // write state
  receiveHistory(history) {
    _setState(history);
    this.emitChange();
  }

  removeHistory() {
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

export default new PlaybackStore();
