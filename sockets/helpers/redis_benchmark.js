import redis from '../../config/redis';
module.exports = function() {
  function rlog(msg) {
    console.log("REDIS: " + msg);
  }

  function reset() {
    redis.del('pieces', 'positions');

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
  }

  function benchDupe(start) {
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
          if (currentDupeTest === totalTests) {
            let elapsed = +new Date() - start;
            rlog('____RESULT____');
            rlog('dupe test time for 1000 tests - ' + elapsed);
          } else {
            ++currentDupeTest;
            benchDupe(start);
          }
        });
      });
    });
  }


  function bench(start) {
    var piece = 1;
    var targetPos = 15;
    redis.hgetall('pieces', (err, pieces) => {
      let t = +new Date();
      var currPos = pieces[piece];
      for (var idx = 0; idx < 16; idx++) {
        if (pieces[idx] == targetPos) {
          redis.hdel('pieces', pieces[idx]);
          break;
        }
      }
      callstackTime += +new Date() - t;
      redis.hmset('pieces', [piece, targetPos], () => {
        redis.hgetall('pieces', (err, pies) => {
          if (currentTest === totalTests) {
            let elapsed = +new Date() - start;
            rlog('____RESULT____');
            rlog('test time for 1000 tests - ' + elapsed);
            rlog ('callstack time - ' + callstackTime);
          } else {
            ++currentTest;
            bench(start);
          }
        });
      });
    });
  }

  reset();
  var totalTests = 1000;
  var currentDupeTest = 0;
  var currentTest = 0;
  var storeStart = +new Date();
  var callstackDupeTime = 0;
  var callstackTime = 0;

  setTimeout(() => {
    benchDupe(+new Date());
  }, 500);
  setTimeout(() => {
    reset();
  }, 1500);
  setTimeout(() => {
    bench(+new Date());
  }, 2500);
};
