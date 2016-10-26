import Game from '../models/game';
import OnlineStatus from '../helpers/online_status';
export default function(client, joined) {
  client.on("join-index", function(_){
    client.join("index", function() {
      joined({room: 'index'});
      
      OnlineStatus.getCount((count) => {
        client.emit('user-count', count);
      });
    });
  });

  client.on("get-index", function(data) {
    var statuses = data && data.statuses ? data.statuses : ['waiting', 'starting', 'active'];
    Game.find()
      .where('status').in(statuses)
      .populate('white')
      .populate('black')
      .exec(function(err, games) {
        client.emit('games', games);
      });
  });
};
