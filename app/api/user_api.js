import UserActions from '../actions/user_actions';

// TODO: put this somewhere more appropriate
function forceReconnect() {
	socket.disconnect();
	setTimeout(()=>{socket.connect();}, 100);
};

var UserApi = {
	signup: (user, successCB, errorCB) => {
		$.ajax({
			url: "/api/users/new",
			type: "post",
			data: user,
			success: ((data) => {
				forceReconnect();
				UserActions.receiveCurrentUser(data);
				if (successCB) { successCB(data.user); }
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
				forceReconnect();
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
				forceReconnect();
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
	},

	verifyEmail: (authToken, successCB, errorCB) => {
		$.ajax({
			url: '/api/verify',
			method: 'post',
			data: {authToken: authToken},
			success:((res) => {
				successCB(res);
			}),
			error: ((err) => {
				errorCB(err);
			})
		});
	}
};

export default UserApi;
