import UserActions from '../actions/user_actions';

function forceReconnect() {
	function connectOnce() {
		socket.connect();
		socket.removeListener('disconnect', connectOnce);
	};

	socket.on('disconnect', connectOnce);
	socket.disconnect();
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
			error: ((err) => {
				UserActions.handleError(err);
				if (errorCB) { errorCB(err); }
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
			url: '/api/verify_email',
			method: 'post',
			data: {authToken: authToken},
			success:((res) => {
				successCB(res);
			}),
			error: ((err) => {
				errorCB(err);
			})
		});
	},

	sendResetEmail: (email, successCB, errorCB) => {
		$.ajax({
			url: 'api/send_reset_email',
			method: 'post',
			data: {email: email},
			success: ((res) => {
				successCB(res);
			}),
			error: ((err) => {
				errorCB(err);
			})
		});
	},

	verifyReset: (data, successCB, errorCB) => {
		$.ajax({
			url: '/api/verify_reset',
			method: 'post',
			data: data,
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
