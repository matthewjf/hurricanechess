/* global Materialize */

var _showing = false;

var ErrorUtil = {
  loginRequired() {
    if (!_showing) {
      Materialize.toast('Login required!', 2000, 'error-text');
      _showing = true;
      setTimeout(function() { _showing = false; }, 2000);
    } 
  },

  gameRejected(data) {
    if (data)
      Materialize.toast(data, 2000, 'error-text');
    else
      Materialize.toast('Unable to join game', 2000, 'error-text');
  }
};

export default ErrorUtil;
