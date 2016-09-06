import redis from '../config/redis';

const pieces = [];

function setInitialState(game, callback){
  redis.hmset(game._id.toString(), pieces, (err, res) => {
    if (callback)
      callback(err,res);
  });
}

export {setInitialState};
