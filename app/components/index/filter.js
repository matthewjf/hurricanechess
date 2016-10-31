import React from 'react';
import {VelocityComponent} from 'velocity-react';
import GameIndexActions from '../../actions/game_index_actions';
import GameIndexSubscription from '../../sockets/game_index_subscription';

const DEFAULT_STATUSES = ['waiting', 'active'];

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.onMount = this.onMount.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.updateStatuses = this.updateStatuses.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.save = this.save.bind(this);
    this.show = false;
  }

  componentDidMount() {
    var statuses = DEFAULT_STATUSES;
    if (localStorage && localStorage.statuses)
      statuses = localStorage.statuses.split(',');

    if (statuses.indexOf('active') >= 0 && statuses.indexOf('starting') < 0)
      statuses.push('starting');

    var sort = localStorage.sort || 'newest';

    this.setState({sort: sort, statuses: statuses});
    GameIndexActions.setSort(sort);
    GameIndexActions.setStatuses(statuses);
    GameIndexSubscription.getIndex({statuses: statuses});

    this.onMount();
  }

  componentWillReceiveProps(props) {
    if (this.show === props.show) return;
    var $el = $(this.refs.filter).velocity('finish');
    if (props.show) $el.velocity('slideDown');
    else $el.velocity('slideUp');
    this.show = props.show;
  }

  componentWillUnmount() {
    $(this.refs.sort).off('change');
    $(this.refs.statuses).off('change');
  }

  onMount() {
    $(document).ready(function() {
      $(this.refs.sort).on('change', this.handleSortChange);
      $('select', '#filter').material_select();
      $(this.refs.sort).siblings('input.select-dropdown').attr('value', this.state.sort);
      var lis = $(this.refs.statuses).siblings('ul.dropdown-content').children();
      this.state.statuses.forEach(function(status) {
        lis.has(`span:contains('${status}')`).click();
      });
      $(this.refs.statuses).on('change', this.handleStatusChange);
    }.bind(this));
  }

  updateSort(sort) {
    this.setState({sort: sort});
    GameIndexActions.setSort(sort);
  }

  updateStatuses(statuses) {
    if (statuses.length === 0) statuses = DEFAULT_STATUSES;
    if (statuses.indexOf('active') >= 0) statuses.push('starting');
    this.setState({statuses: statuses});
    GameIndexActions.setStatuses(statuses);
    GameIndexSubscription.getIndex({statuses: this.state.statuses});
  }

  handleSortChange(e) {
    this.updateSort(e.currentTarget.value);
  }

  handleStatusChange(e) {
    let els = [... e.currentTarget.selectedOptions];
    var statuses = els.map(function(el) { return el.value; });
    this.updateStatuses(statuses);
  }

  save() {
    if (localStorage) {
      localStorage.sort = this.state.sort;
      localStorage.statuses = this.state.statuses.join(',');
      this.props.toggleFilter();
      Materialize.toast('Filters saved!', 2000, 'success-text');
    };
  }

  render() {
    return <div id='filter' ref='filter' className='card-panel row' style={{display: 'none'}}>
      <div className='input-field col m5 s6'>
        <select id='statuses' ref='statuses' multiple>
          <option value="waiting">waiting</option>
          <option value="active">active</option>
          <option value="archived">archived</option>
        </select>
        <label>filter by status</label>
      </div>

      <div className='input-field right-align offset-m1 col m4 s6'>
        <select id='sort' ref='sort'>
          <option value="newest">newest</option>
          <option value="oldest">oldest</option>
        </select>
        <label>sort by</label>
      </div>
      <div id='save' className='right-align col m2 s12'>
        <a onClick={this.save} className='btn-flat btn waves-effect'>save</a>
      </div>
    </div>;
  }
}

export default Filter;
