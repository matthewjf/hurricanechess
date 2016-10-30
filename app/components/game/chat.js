import React from 'react';
import ChatStore from '../../stores/chat_store';
import ChatActions from '../../actions/chat_actions';
import GameSubscription from '../../sockets/game_subscription';

var autoScroll = true;
var ticking = false;

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
    this.refs.messages.addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate() {
    if (autoScroll) this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
  }

  componentWillUnmount() {
    ChatStore.removeChangeListener(this.getChats);
    ChatActions.removeChats();
  }

  componentWillReceiveProps(props) {
    this.setState({ gameId: props.gameId, white: props.white, black: props.black });
  }

  handleScroll() {
    var lastDiff = this.scrollTop + this.offsetHeight - this.scrollHeight;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        if (lastDiff === 0) autoScroll = true;
        else autoScroll = false;
        ticking = false;
      });
    }
    ticking = true;
  }

  handleInputChange(e) {
    this.setState({ input: e.currentTarget.value });
  }

  getChats() {
    this.setState({chats: ChatStore.all()});
  }

  sendChat(e) {
    e.preventDefault();
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
      if (chat.type === 'message')
        return <div key={chat.time}>
          <span className={'username ' + this.usernameClass(chat.user)}>
            {chat.user.username}
          </span>
          <span className='message'>: {chat.message}</span>
        </div>;
      else
        return <div key={chat.time}>
          <em className={'message ' + chat.type}>
            {chat.user.username + ' ' + (chat.type === 'join' ? 'joined' : 'left')}
          </em>
        </div>;
    });
  }

  render() {
    return <div id='chat-wrapper'>
        <section id='chat' className='card-panel'>
          <div id='chat-messages' ref='messages'>
            {this.renderChats()}
          </div>
          <form id='chat-form' onSubmit={this.sendChat}>
            <input id='chat-input' placeholder="chat here" type="text"
              value={this.state.input}
              onChange={this.handleInputChange}/>
            <a className='btn btn-flat waves-effect waves-light light-blue-text'
              onClick={this.sendChat}>
              send
            </a>
          </form>
        </section>
      </div>;
  }
}

export default Chat;
