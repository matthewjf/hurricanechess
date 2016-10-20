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
            <h3>Sign up!</h3>
            <p>
              Why sign up?
            </p>
            <p>
              Your account helps ensure games are secure.
              An email is required in case you lose your password.
              Your email is not used for any other purpose and won't be given out.
            </p>
            <p>
              Sign up using the menu in the header.
            </p>
          </div>

          <div id="structure" className="section scrollspy">
            <h2>Content</h2>
            <p>stuff</p>
            <p>stuff</p>
            <p>stuff</p>
            <p>stuff</p>
            <p>stuff</p>
            <p>stuff</p>
            <p>stuff</p>
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
