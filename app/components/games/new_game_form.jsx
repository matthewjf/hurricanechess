var React = require('react'),
    BrowserHistory = require('react-router').browserHistory,
    GameApi = require('../../util/game_api'),
    ErrorUtil = require('../../util/error_util');

module.exports = React.createClass({
  blankAttrs: {
    name: '',
    private: false,
    password: '',
    errors: null
  },

  getInitialState: function() {
    return this.blankAttrs;
  },

  resetState: function() {
    return this.blankAttrs;
  },

  handleNameChange: function(e) {
    this.setState({ name: e.currentTarget.value, errors: null });
  },

  handlePrivateChange: function(e) {
    this.setState({ private: true });
  },

  handlePublicChange: function(e) {
    this.setState({ private: false, password: '' });
  },

  handlePasswordChange: function(e) {
    this.setState({ password: e.currentTarget.value });
  },

  handleSubmit: function(e) {
    if(e) { e.preventDefault(); }
    GameApi.createGame(this.state, this.submitSuccess, this.submitError);
  },

  submitError: function(error) {
    if (error.status === 401) {
      // not logged in
      $('#new-game-modal').closeModal();
      ErrorUtil.loginRequired();
    } else if (error.status === 422) {
      this.setState({errors: error.responseJSON});
    } else {
      // unexpected error
    }
  },

  submitSuccess: function(game) {
    $('#new-game-modal').closeModal();
    BrowserHistory.push("games/" + game.id);
  },

  setPassword: function() {
    if (this.state.private) {
      return (
        <div className='input-field'>
          <input name="game[password]"
                 id="game_password"
                 type="password"
                 value={this.state.password}
                 onChange={this.handlePasswordChange} />
          <label htmlFor="game_password" >Password</label>
        </div>
      );
    } else {
      return null;
    }
  },

  renderErrors: function(errors) {
    if (errors) {
      return errors.map(function(error) {
        return <span className='error-text' key={error} >{error}</span>;
      });
    } else {
      return null;
    }
  },

  render: function() {
    return (
      <div className='row'>
        <form onSubmit={this.handleSubmit} >

          <div className="modal-content">
            {this.renderErrors(this.state.errors)}
            <div className='row'>
              <div className='input-field'>
                <input id="game_name"
                       type="text"
                       value={this.state.name}
                       onChange={this.handleNameChange} />
                <label htmlFor="game_name">Name</label>
              </div>
            </div>

            <p>
              <input type="radio"
                     id="public_game"
                     onChange={this.handlePublicChange}
                     checked={!this.state.private}
                     value='false' />
              <label htmlFor="public_game">Public</label>
            </p>

            <p>
              <input type="radio"
                     id="private_game"
                     onChange={this.handlePrivateChange}
                     checked={this.state.private}
                     value='true'
                     disabled />
              <label htmlFor="private_game">Private</label>
            </p>
            {this.setPassword()}

          </div>

          <div className='modal-footer'>
            <input type='submit'
                   value='create'
                   className="waves-effect waves-light btn" />
          </div>

        </form>
      </div>
    );
  }
});
