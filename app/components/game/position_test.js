import React from 'react';
class PositionTest extends React.Component {
  constructor(props) {
    super(props);
    this.boxStyles = this.boxStyles.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);

    this.state = {
      left: -100,
      top: 20
    };
  }

  defaultStyle() {
    return {
      width: '100px',
      height: '100px',
      backgroundColor: 'red',
      position: 'relative',
      transition: 'all 0.5s linear'
    };
  }

  boxStyles() {
    let style = this.defaultStyle();
    style.left = this.state.left;
    style.top = this.state.top;
    return style;
  }

  moveUp() {
    this.setState({top: this.state.top - 100});
  }
  moveDown() {
    this.setState({top: this.state.top + 100});
  }

  render() {
    return (
      <div>
        <a className='btn' onClick={this.moveUp}>up</a>
        <a className='btn' onClick={this.moveDown}>down</a>
        <div style={this.boxStyles()}/>
      </div>
    );
  }
};

export default PositionTest;
