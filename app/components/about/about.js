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
          <div id="introduction" className="section scrollspy">
            <h2>INTRODUCTION</h2>
            <h3>What's ChessX?</h3>
            <p>
              It's realtime chess without turns.
              Any available piece can be moved at any time.
              After a piece moves, it becomes unavailable for 10 seconds.
              The game ends when either king is captured or 10 minutes elapses.
            </p>
            <p>
              INSERT GIF
            </p>
          </div>
          <div id="getting-started" className="section scrollspy">
            <h2>GETTING STARTED</h2>
            <h3>Sign up!</h3>
            <p>
              Your account helps keep games secure.
              An email is required in case you forget your password.
              Your email is not used for any other purpose and won't be given out.
            </p>
            <p>
              Sign up using the menu in the header.
            </p>
            <h3>Get in a game</h3>
            <p>
              The fastest way to play is by click on a game with a player already waiting.
              You can also start a game with the <code>new game</code> button on the home page.
            </p>
            <h3>Spectate</h3>
            <p>
              If you're not sure what to do, you can watch a game first.
              You can join any games that are already in progress.
              You'll be able to watch the game but not make any moves.
            </p>
          </div>

          <div id="gameplay" className="section scrollspy">
            <h2>GAMEPLAY</h2>
            <h3>Starting</h3>
            <p>
              Once 2 players have joined a game, a countdown will begin.
              The game starts when the countdown ends.
              If either player leaves during the countdown, the game won't start.
              Once a game starts, it will continue until either king is captured or 10 minutes elapses.
              If you leave during a game, the game won't wait for you.
            </p>
            <h3>Moves</h3>
            <p>
              To make a move, select a one of your own pieces that is not on delay.
              The positions available to that piece will be highlighted in green.
              Clicking on any of the available positions will attempt to perform a move.
            </p>
            <p>
              INSERT IMAGE
            </p>
            <p>
              Pieces can be intercepted during their move.
              If a piece takes another piece in the middle of its move, its move will end.
            </p>
            <p>
              INSERT GIF
            </p>
            <h3>Advanced</h3>
            <p>
              Knights: They cannot be intercepted.
              They are off the board for a brief period of time during their move.
            </p>
            <p>
              Pawn promotion: Parns are automatically promoted to queens when they reach the opposite end of the board.
            </p>
            <p>
              En passant: It doesn't exist in ChessX, since you can capture a pawn during its move.
            </p>
            <p>
              Castling: It occurs immediately and cannot be intercepted.
              You can castle if the king and target rook have not moved, and there aren't pieces between.
              Since the concept of check does not exist, it's not part of the castling requirement.
            </p>
          </div>

          <div id="competitive" className="section scrollspy">
            <h2>COMPETITIVE</h2>
            <p>
              Ranks and matchmaking coming soon. Stay tuned!
            </p>
          </div>

          <div id="miscellaneous" className="section scrollspy">
            <h2>MISCELLANEOUS</h2>
            <h3>Replays</h3>
            <p>
              INSERT IMAGE
            </p>
            <h3>Settings</h3>
            <p>
              INSERT IMAGE
            </p>
          </div>
        </div>

        <div className="col hide-on-small-only m3 l2">
          <ul className="section table-of-contents">
            <li><a href="#introduction">Introduction</a></li>
            <li><a href="#getting-started">Getting Started</a></li>
            <li><a href="#gameplay">Gameplay</a></li>
            <li><a href="#competitive">Competitive</a></li>
            <li><a href="#miscellaneous">Miscellaneous</a></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default About;
