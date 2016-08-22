import UserActions from '../actions/user_actions';

var UserApi = {
	signup: (user, successCB, errorCB) => {
		$.ajax({
			url: "/api/user",
			type: "post",
			data: user,
			success: ((data) => {
				UserActions.receiveCurrentUser(data);
				if (successCB) { successCB(data); }
			}),
			error: ((error) => {
				UserActions.handleError(error);
				if (errorCB) { errorCB(error); }
			})
		});
	},

	login: (user, successCB, errorCB) => {
		$.ajax({
			url: "/api/session",
			type: "post",
			data: user,
			success: ((data) => {
				UserActions.receiveCurrentUser(data);
				if (successCB) { successCB(data.user); }
			}),
			error: ((error) => {
				UserActions.handleError(error);
				if (errorCB) { errorCB(error); }
			})
		});
	},

	logout: (successCB, errorCB) => {
		$.ajax({
			url: '/api/session',
			method: 'delete',
			success: ((data) => {
				UserActions.removeCurrentUser();
				if (successCB) { successCB(data); }
			}),
			error: ((error) => {
				UserActions.handleError(error);
				if (errorCB) { errorCB(error); }
			})
		});
	},

	fetchCurrentUser: (successCB, errorCB) => {
		$.ajax({
			url: '/api/session',
			method: 'get',
			success: ((data) => {
				UserActions.receiveCurrentUser(data);
				if (successCB) { successCB(data); }
			}),
			error: ((error) => {
				UserActions.handleError(error);
				if (errorCB) { errorCB(error); }
			})
		});
	}
};

export default UserApi;
