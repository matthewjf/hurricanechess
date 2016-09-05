import redis from '../config/redis';
module.exports = function() {
  function rlog(msg) {
    console.log("REDIS: " + msg);
  }

  function reset() {
    redis.del('pieces', 'positions', 'positions_array');

    var pieces = {};
    for (var i = 0; i < 16; i++) {
      pieces[i.toString()] = i;
    }

    var positions = {};
    for (var i = 0; i < 64; i++) {
      positions[i.toString()] = (i < 16 ? i : '');
    }

    redis.hmset('pieces', pieces);
    redis.hmset('positions', positions);

    var positions_array = ['positions_array'];
    positions_array.push('');
    for (var i = 1; i < 63; i++) {
      if (i < 16)
        positions_array.push(i);
      else
        positions_array.push('');
    }
    positions_array.push(1);
    redis.rpush.apply(redis, positions_array);
  }

  function benchByPieceAndPos(start) {
    reset();
    var piece = 1;
    var targetPos = 15;
    let multi = redis.multi();
    multi.hmget('pieces', piece).hmget('positions', targetPos);
    multi.exec((err, results) => {
      let currPos = results[0][0];
      let pieceAtTar = results[1][0];
      let multi = redis.multi();
      multi
        .hdel('pieces', pieceAtTar)
        .hmset('pieces', [1, targetPos])
        .hmset('positions', [targetPos, piece]);
      multi.exec(() => {
        let multi = redis.multi();
        multi.hgetall('pieces').hgetall('positions');
        multi.exec((err, results) => {
          if (currentPieceAndPosTest === totalTests) {
            let elapsed = +new Date() - start;
            rlog('____RESULT____');
            rlog('piece AND pos time - ' + elapsed);
          } else {
            ++currentPieceAndPosTest;
            benchByPieceAndPos(start);
          }
        });
      });
    });
  }


  function benchByPiece(start) {
    reset();
    var piece = 1;
    var targetPos = 15;
    redis.hgetall('pieces', (err, pieces) => {
      let t = +new Date();
      var currPos = pieces[piece];
      for (var idx = 0; idx < 16; idx++) {
        if (pieces[idx] == targetPos) {
          var pieceAtTar = idx;
          break;
        }
      }
      callstackTime += +new Date() - t;
      let multi = redis.multi();
      multi.hdel('pieces', pieceAtTar).hmset('pieces', [piece, targetPos]);
      multi.exec(() => {
        redis.hgetall('pieces', (err, pies) => {
          if (currentPieceTest === totalTests) {
            let elapsed = +new Date() - start;
            rlog('____RESULT____');
            rlog('piece time - ' + elapsed);
            rlog ('callstack time - ' + callstackTime);
          } else {
            ++currentPieceTest;
            benchByPiece(start);
          }
        });
      });
    });
  }

  function benchByPosArr(start) {
    reset();
    var piece = 1;
    var targetPos = 15;
    redis.lrange('positions_array', 0, -1, (err, positions) => {
      let t = +new Date();
      for (var idx = 0; idx < 64; idx++) {
        if (positions[idx] == piece) {
          var currPos = idx;
          break;
        }
      }
      callstackTime += +new Date() - t;
      let multi = redis.multi();
      multi.lset('positions_array', currPos, '')
           .lset('positions_array', targetPos, piece);
      multi.exec(() => {
        redis.lrange('positions_array', 0, -1, (err, pies) => {
          if (currentPosTest === totalTests) {
            let elapsed = +new Date() - start;
            rlog('____RESULT____');
            rlog('position array time - ' + elapsed);
            rlog ('callstack time - ' + callstackTime);
          } else {
            ++currentPosTest;
            benchByPosArr(start);
          }
        });
      });
    });
  }

  var totalTests = 5000;
  var currentPieceAndPosTest = 0;
  var currentPieceTest = 0;
  var currentPosTest = 0;
  var storeStart = +new Date();
  var callstackDupeTime = 0;
  var callstackTime = 0;

  setTimeout(() => {
    benchByPieceAndPos(+new Date());
  }, 500);
  setTimeout(() => {
    benchByPosArr(+new Date());
  }, 12500);
  setTimeout(() => {
    benchByPiece(+new Date());
  }, 6500);
};
