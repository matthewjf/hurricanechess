import React from 'react';
import {browserHistory} from 'react-router';
import GameActions from '../../actions/game_actions';
import PieceActions from '../../actions/piece_actions';
import ChatActions from '../../actions/chat_actions';
import GameSubscription from '../../sockets/game_subscription';
import GameIndexSubscription from '../../sockets/game_index_subscription';
import ErrorUtil from '../../utils/error_util';

class NewGameForm extends React.Component {
  constructor() {
    super();
    this.blankAttrs = {
      name: '',
      password: '',
      black: false,
      errors: {}
    };

    this.resetState = this.resetState.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.submitData = this.submitData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitError = this.submitError.bind(this);
    this.submitSuccess = this.submitSuccess.bind(this);
    this.errorText = this.errorText.bind(this);
    this.solo = this.solo.bind(this);

    this.state = this.blankAttrs;
  }

  componentDidMount() {
    $(this.refs.color).on('change', this.handleColorChange);
    $(document).ready(function() {
      $('select', '#new-game-modal').material_select();
      $('#game-name').attr('length', 50).characterCounter();
    });
  }

  resetState() {
    this.setState(this.blankAttrs);
  }

  handleColorChange(e) {
    this.setState({ black: e.currentTarget.value === 'black' });
  }

  handleNameChange(e) {
    this.setState({ name: e.currentTarget.value, errors: {} });
  }

  submitData() {
    return {
      game: {
        name: this.state.name
      },
      black: this.state.black
    };
  }

  solo(e) {
    if(e) e.preventDefault();
    this.submitSuccess();
    browserHistory.push(`/solo${this.state.black ? '?c=b' : ''}`);
  }

  handleSubmit(e) {
    if(e) e.preventDefault();
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

  errorText(field) {
    var err = this.state.errors[field];
    return err ? err.message : '';
  }

  render() {
    return (
      <div id="new-game-modal" className="modal">
        <div className='row'>
          <form onSubmit={this.handleSubmit}>

            <div className="modal-content">

              <div className='row'>
                <div className='input-field'>
                  <input id="game-name"
                         type="text"
                         className={this.state.errors.name ? 'invalid' : ''}
                         value={this.state.name}
                         onChange={this.handleNameChange} />
                  <label htmlFor="game-name">Name</label>
                  <div className='error'>{this.errorText('name')}</div>
                </div>
              </div>

              <div className='input-field'>
                <select onChange={this.colorChange} id='color' ref='color'>
                  <option value="white">white</option>
                  <option value="black">black</option>
                </select>
                <label>Play as</label>
              </div>

            </div>
            <input type="submit" className='hidden-submit' />
            <div className='modal-footer'>
              <a onClick={this.handleSubmit} className="waves-effect waves-light btn">
                create
              </a>
              <a onClick={this.solo} className='waves-effect btn btn-flat'>
                single player
              </a>
            </div>

          </form>
        </div>
      </div>
    );
  }
};

export default NewGameForm;
