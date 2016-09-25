import React from 'react';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.name = this.name.bind(this);
    this.color = this.color.bind(this);
  }

  name() {
    if (this.props.isCurrentUser) {
      return 'YOU';
    } else {
      return this.props.player ? this.props.player.username : 'waiting for an opponent';
    }
  }

  color() {
    if (this.props.player) return this.props.color;
  }

  render() {
    return(
      <div className={"card-panel player-card" + (this.props.player ? '' : ' waiting')}>
        <div className={'col' + (this.props.player ? '' : ' grey-text')}>
          {this.name()}
        </div>
        <div className='col grey-text'>
          {this.color()}
        </div>
      </div>
    );
  }
};

export default Player;
