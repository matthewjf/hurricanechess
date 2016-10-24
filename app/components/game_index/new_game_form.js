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
      errors: {}
    };

    this.resetState = this.resetState.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.submitData = this.submitData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitError = this.submitError.bind(this);
    this.submitSuccess = this.submitSuccess.bind(this);
    this.errorText = this.errorText.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.handlePublicChange = this.handlePublicChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);

    this.state = this.blankAttrs;
  }

  componentDidMount() {
    $(this.refs.color).on('change', this.handleColorChange);
    $(document).ready(function() {
      $('select').material_select();
    });
  }

  resetState() {
    this.setState(this.blankAttrs);
  }

  handleNameChange(e) {
    this.setState({ name: e.currentTarget.value, errors: {} });
  }

  handleColorChange(e) {
    e.preventDefault();
    this.setState({black: e.currentTarget.value === 'black' });
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

  errorText(field) {
    var err = this.state.errors[field];
    return err ? err.message : '';
  }

  render() {
    return (
      <div className='row'>
        <form onSubmit={this.handleSubmit}>

          <div className="modal-content">
            <div className='row'>
              <div className='input-field'>
                <input id="game[name]"
                       type="text"
                       className={this.state.errors.name ? 'invalid' : ''}
                       value={this.state.name}
                       onChange={this.handleNameChange} />
                <label htmlFor="game[name]">Name</label>
                <div className='error'>{this.errorText('name')}</div>
              </div>
            </div>

            <div className='input-field'>
              <select onChange={this.colorChange} id='color' ref='color'>
                <option value="white">White</option>
                <option value="black">Black</option>
              </select>
              <label>Play as</label>
            </div>


            <p>
              <input type="radio"
                     id="public[game]"
                     onChange={this.handlePublicChange}
                     checked={!this.state.private}
                     value='false' />
              <label htmlFor="public[game]">Public</label>
            </p>

            <p>
              <input type="radio"
                     id="private[game]"
                     onChange={this.handlePrivateChange}
                     checked={this.state.private}
                     value='true'
                     disabled />
              <label htmlFor="private[game]">Private</label>
            </p>


            {this.setPassword()}

          </div>
          <input type="submit" className='hidden-submit' />
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
