/* global Materialize */

var ErrorUtil = {
  loginRequired() {
    Materialize.toast('Login required!', 2000, 'error-text');
  },
  
  gameRejected(currentUser) {
    Materialize.toast('Unable to join game', 2000, 'error-text');
  }
};

export default ErrorUtil;
