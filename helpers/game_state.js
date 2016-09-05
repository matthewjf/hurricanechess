import redis from '../config/redis';

function setInitialState(game, callback){
  const pieces = {};
  redis.hmset(game._id.toString(), pieces, (err, res) => {
    if (callback)
      callback(err,res);
  });
}

export {setInitialState};
