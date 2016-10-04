/* global Materialize */

var ErrorUtil = {
  loginRequired() {
    Materialize.toast('Login required!', 2000, 'error-text');
  },

  gameRejected(data) {
    if (data)
      Materialize.toast(data, 2000, 'error-text');
    else
      Materialize.toast('Unable to join game', 2000, 'error-text');
  }
};

export default ErrorUtil;
