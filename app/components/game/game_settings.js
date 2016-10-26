import React from 'react';
const COLORS = ['cool', 'natural', 'storm'];

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
    this.addColorPreviews(this.refs.boardColor);
    $('select', "#game-settings-modal").material_select();
    $(this.refs.boardColor).on('change', this.handleColorChange);
    let color = this.getStoredBoardColor();
    this.setBoardColor(color);
    $('input.select-dropdown', "#game-settings-modal")[0].value = color;
  }

  addColorPreviews(select) {
    $(document).ready(function() {
      var $ddl = $(this.parentElement.querySelector('.dropdown-content'));
      $ddl.find('span').each(function() {
        var $preview = $('<div class="'+this.innerHTML+' preview">')
          .append('<div class="dark">')
          .append('<div class="light">');
        $(this.parentElement).prepend($preview);
      });
    }.bind(select));
  }

  handleColorChange(e) {
    e.preventDefault();
    this.setBoardColor(e.currentTarget.value);
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
          <form ref='settingsForm' id='settings-form' onSubmit={this.handleSubmit}>

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
            <input type="submit" className='hidden-submit' />
            <div className='modal-footer'>
              <a onClick={this.handleSubmit} className="waves-effect waves-light btn">
                save
              </a>
            </div>

          </form>
        </div>
      </div>
    );
  }
}

export default BoardSettings;
