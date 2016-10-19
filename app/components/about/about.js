import React from 'react';

class About extends React.Component {
  componentDidMount() {
    $(document).ready(function(){
      $('.scrollspy').scrollSpy();
    });
  }

  render() {
    return (
      <div id='about' className="row">
        <div className="col s12 m9 l10">
          <div id="getting-started" className="section scrollspy">
            <h2>Getting Started</h2>
          </div>

          <div id="structure" className="section scrollspy">
            <h2>Content</h2>
          </div>

          <div id="initialization" className="section scrollspy">
            <h2>Content</h2>
          </div>
        </div>

        <div className="col hide-on-small-only m3 l2">
          <ul className="section table-of-contents">
            <li><a href="#getting-started">Getting Started</a></li>
            <li><a href="#structure">Structure</a></li>
            <li><a href="#initialization">Intialization</a></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default About;
