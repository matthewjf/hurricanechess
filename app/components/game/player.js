import React from 'react';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.name = this.name.bind(this);
    this.color = this.color.bind(this);
  }

  name() {
    if (this.props.data.player) {
      return this.props.data.player.username;
    } else {
      return 'waiting for an opponent';
    }
  }

  color() {
    if (this.props.data.player) return this.props.data.color;
  }

  render() {
    return(
      <div className={"card-panel player-card" + (this.props.data.player ? '' : ' waiting')}>
        <div className={'col' + (this.props.data.player ? '' : ' grey-text text-lighten-1')}>
          {this.name()}
        </div>
        <div className='col grey-text text-lighten-1'>
          {this.color()}
        </div>
      </div>
    );
  }
};

export default Player;
