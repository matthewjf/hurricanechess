import React from 'react';
import ChatStore from '../../stores/chat_store';
import ChatActions from '../../actions/chat_actions';
import GameSubscription from '../../sockets/game_subscription';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.getChats = this.getChats.bind(this);
    this.sendChat = this.sendChat.bind(this);
    this.usernameClass = this.usernameClass.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderChats = this.renderChats.bind(this);

    this.state = {
      gameId: this.props.gameId,
      white: this.props.white,
      black: this.props.black,
      input: '',
      chats: []
    };
  }

  componentDidMount() {
    ChatStore.addChangeListener(this.getChats);
  }

  componentWillUnmount() {
    ChatStore.removeChangeListener(this.getChats);
    ChatActions.removeChats();
  }

  componentWillReceiveProps(props) {
    this.setState({ gameId: props.gameId, white: props.white, black: props.black });
  }

  handleInputChange(e) {
    this.setState({ input: e.currentTarget.value });
  }

  getChats() {
    this.setState({chats: ChatStore.all()});
  }

  sendChat() {
    GameSubscription.sendChat({gameId: this.state.gameId, message: this.state.input});
    this.setState({input: ''});
  }

  usernameClass(user) {
    if (user) {
      if (this.state.white && user._id === this.state.white._id) return 'white-player';
      if (this.state.black && user._id === this.state.black._id) return 'black-player';
    }
    return '';
  }

  renderChats() {
    return this.state.chats.map(chat => {
      return <div key={chat.time}>
        <span className={'username ' + this.usernameClass(chat.user)}>
          {chat.user.username}
        </span>
        <span className='message-text'>: {chat.message}</span>
      </div>;
    });
  }

  render() {
    return <div id='chat-wrapper'>
        <section id='chat' className='card-panel'>
          <div id='chat-messages'>
            {this.renderChats()}
          </div>
          <div id='chat-form'>
            <input id='chat-input' placeholder="chat here" type="text"
              value={this.state.input}
              onChange={this.handleInputChange}/>
            <a className='btn btn-flat waves-effect waves-light light-blue-text'
              onClick={this.sendChat}>
              send
            </a>
          </div>
        </section>
      </div>;
  }
}

export default Chat;
