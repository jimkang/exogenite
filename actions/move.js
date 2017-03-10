var callNextTick = require('call-next-tick');
var flatten = require('lodash.flatten');
var findWhere = require('lodash.findwhere');

var move = {
  canDo: canDoMove
};

function canDoMove({actor, actionOpts, figureTree}, done) {
  var proposedCenters = actor.figures.map(getProposedCenter);
  // console.log(proposedCenters);
  var figuresAtProposed = flatten(proposedCenters.map(figureTree.search.bind(figureTree)));
  // console.log(figuresAtProposed);
  var impassableFigure = findWhere(figuresAtProposed, {passable: false});
  callNextTick(done, null, impassableFigure === undefined);

  function getProposedCenter(figure) {
    // Use a little square inside of the tile for the purposes of checking for collisions
    // so we don't hit the actor's own edges.
    return {
      minX: figure.minX + 0.25 + actionOpts.vector[0],
      maxX: figure.maxX - 0.25 + actionOpts.vector[0],
      minY: figure.minY + 0.25 + actionOpts.vector[1],
      maxY: figure.maxY - 0.25 + actionOpts.vector[1]
    };
  }
}

module.exports = move;