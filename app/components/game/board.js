import React from 'react';
import GameSettings from './game_settings';
import Display from '../../utils/display';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.setBoardColor = this.setBoardColor.bind(this);

    this.state = {};
  }

  renderSquares() {
    let squares = [];
    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        let color = ((row + col) % 2 === 0 ? 'white-square' : 'black-square');
        squares.push(<div className={'square ' + color} key={row * 10 + col}/>);
      }
    };
    return squares;
  }

  setBoardColor(color) {
    this.setState({boardColor: color});
  }

  style() {
    return {height: Display.gridSizePx, width: Display.gridSizePx};
  }

  render() {
    return <div id='board' style={this.style()} className={this.state.boardColor + '-board card-panel'}>
      <GameSettings setBoardColor={this.setBoardColor}/>
      {this.renderSquares()}
    </div>;
  }
}

export default Board;
