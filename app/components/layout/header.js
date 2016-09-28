/* global Materialize */
import React from 'react';
import {browserHistory} from 'react-router';
import UserApi from '../../api/user_api';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.desktopLinks = this.desktopLinks.bind(this);
    this.mobileLinks = this.mobileLinks.bind(this);
    this.links = this.links.bind(this);
    this.username = this.username.bind(this);

    this.state = {currentUser: this.props.currentUser};
  }

  componentDidMount() {
    $(".button-collapse").sideNav();
  }

  componentWillReceiveProps(props) {
    this.setState({currentUser: props.currentUser});
  }

  logout(e) {
    e.preventDefault();
    this.home();
    UserApi.logout(() => {
      Materialize.toast('Logged out', 2000, 'error-text');
    });
  }

	home() {
    browserHistory.push('/');
	}

  openLogin() {
		$('#login-modal').openModal();
	}

	openSignup() {
		$('#signup-modal').openModal();
	}

  desktopLinks() {
    return this.links("right hide-on-med-and-down");
  }

  mobileLinks(className, id) {
    return this.links('side-nav', 'nav-mobile');
  }

  links(className, id) {
    if (this.state.currentUser) {
			return (
        <ul id={id} className={className}>
          <li><a id='logout' onClick={this.logout}>LOG OUT</a></li>
        </ul>
      );
		} else {
      return (
        <ul id={id} className={className}>
  				<li><a onClick={this.openSignup} className="modal-trigger">
  					SIGN UP
  				</a></li>
          <li><a onClick={this.openLogin} className="modal-trigger">
            LOG IN
  				</a></li>
        </ul>
      );
    }
  }

  // TODO: add username to header
  username() {
    if (this.state.currentUser)
      return <ul className='right'><li className='username'>
          {this.state.currentUser.username}
         </li></ul>;
    else
      return null;
  }

  render() {
    return (
      <nav>
        <div className='nav-wrapper' id='header'>
          <a onClick={this.home} className='brand-logo center' id='logo'>
            Chess X
          </a>

          <a href="#" data-activates="nav-mobile" className="button-collapse">
            <i className="material-icons">menu</i>
          </a>
          {this.desktopLinks()}
          {this.mobileLinks()}
          {this.username()}
        </div>
      </nav>
    );
  }

};

export default Header;
