import React from 'react';
import GameSubscription from '../../sockets/game_subscription';
import GameIndexSubscription from '../../sockets/game_index_subscription';
import ErrorUtil from '../../utils/error_util';

class NewGameForm extends React.Component {
  constructor() {
    super();
    this.blankAttrs = {
      name: '',
      private: false,
      password: '',
      black: false,
      errors: null
    };

    this.resetState = this.resetState.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleWhiteChange = this.handleWhiteChange.bind(this);
    this.handleBlackChange = this.handleBlackChange.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.handlePublicChange = this.handlePublicChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.submitData = this.submitData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitError = this.submitError.bind(this);
    this.submitSuccess = this.submitSuccess.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.renderErrors = this.renderErrors.bind(this);

    this.state = this.blankAttrs;
  }

  resetState() {
    this.setState(this.blankAttrs);
  }

  handleNameChange(e) {
    this.setState({ name: e.currentTarget.value, errors: null });
  }

  handleWhiteChange(e) {
    this.setState({ black: false });
  }

  handleBlackChange(e) {
    this.setState({ black: true });
  }

  handlePrivateChange(e) {
    this.setState({ private: true });
  }

  handlePublicChange(e) {
    this.setState({ private: false, password: '' });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.currentTarget.value });
  }

  submitData() {
    return {
      game: {
        name: this.state.name,
        private: this.state.private,
        password: this.state.password
      },
      black: this.state.black
    };
  }

  handleSubmit(e) {
    if(e) { e.preventDefault(); }
    GameSubscription.create(this.submitData(), this.submitSuccess, this.submitError);
  }

  submitError(error) {
    if (error.login) {
      // not logged in
      $('#new-game-modal').closeModal();
      ErrorUtil.loginRequired();
    } else {
      this.setState({errors: error});
    }
  }

  submitSuccess() {
    $('#new-game-modal').closeModal();
  }

  setPassword() {
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
  }

  renderErrors(errors) {
    if (errors) {
      return Object.keys(errors).map(key =>{
        return (
          <span className='error-text' key={key} >
            {errors[key].message.replace('Path ', '')}
          </span>
        );
      });
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className='row'>
        <form onSubmit={this.handleSubmit}>

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
          <input type="submit" hidden />
          <div className='modal-footer'>
            <a onClick={this.handleSubmit} className="waves-effect waves-light btn">
              create
            </a>
          </div>

        </form>
      </div>
    );
  }
};

export default NewGameForm;
