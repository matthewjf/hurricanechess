import React from 'react';
const COLORS = ['cool', 'natural', 'candy'];

class BoardSettings extends React.Component {
  constructor(props) {
    super(props);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.setBoardColor = this.setBoardColor.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {};
  }

  getStoredBoardColor() {
    if (this.state.boardColor)
      return this.state.boardColor;
    else if (localStorage.boardColor)
      return localStorage.boardColor;
    else
      return COLORS[0];
  }

  componentDidMount() {
    $('select').material_select();
    $(this.refs.boardColor).on('change', this.handleColorChange);
    let color = this.getStoredBoardColor();
    this.setBoardColor(color);
    $('input.select-dropdown')[0].value = color;
  }

  handleColorChange(event) {
    this.setBoardColor(event.currentTarget.value);
  }

  setBoardColor(color) {
    this.setState({boardColor: color});
    this.props.setBoardColor(color);
  }

  colorValues() {
    return COLORS.map((color) => {
      return <option value={color} key={color}>{color}</option>;
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    localStorage.boardColor = this.state.boardColor;
    $('#game-settings-modal').closeModal();
    Materialize.toast('Settings saved!', 2000, 'success-text');
  }

  render() {
    return (
      <div id="game-settings-modal" className="modal">
        <div className='row'>
          <form onSubmit={this.handleSubmit} >
            <div className="modal-content">
              <div className='row'>
                <div className='input-field'>
                  <select id='board-color' ref='boardColor'>
                    {this.colorValues()};
                  </select>
                  <label>Board color</label>
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <input type='submit'
                     value='save'
                     className="waves-effect waves-light btn" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default BoardSettings;
