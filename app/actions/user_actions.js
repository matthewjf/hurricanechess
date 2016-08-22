import UserConstants from '../constants/user_constants';
import AppDispatcher from '../dispatcher/dispatcher';

var UserActions = {
	receiveCurrentUser: (data) => {
		AppDispatcher.dispatch({
			actionType: UserConstants.LOGIN,
			user: data.user
		});
	},

	handleError: (error) => {
		AppDispatcher.dispatch({
			actionType: UserConstants.ERROR,
			errors: error
		});
	},

	removeCurrentUser: () => {
		AppDispatcher.dispatch({
			actionType: UserConstants.LOGOUT,
		});
	},

	resetErrors: (errors) => {
		AppDispatcher.dispatch({
			actionType: UserConstants.ERROR,
			errors: errors
		});
	}
};

export default UserActions;
