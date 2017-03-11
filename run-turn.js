var queue = require('d3-queue').queue;

function RunTurn({soulPool, soulOps}) {
  return runTurn;

  function runTurn(done) {
    var souls = soulPool.getSouls();
    // TODO: Filter by turn-havers.
    var q = queue(1);
    souls.forEach(queueTakeTurn);
    q.awaitAll(done);

    function queueTakeTurn(soul) {
      q.defer(soulOps.takeTurn, {soul: soul});
    }
  }
}

module.exports = RunTurn;
