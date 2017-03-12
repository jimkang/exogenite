var callNextTick = require('call-next-tick');
var flatten = require('lodash.flatten');
var findWhere = require('lodash.findwhere');
var sb = require('standard-bail')();

var move = {
  canDo: canDoMove,
  execute: executeMove
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

function executeMove({actor, actionOpts, figureTree, fieldOfView}, done) {
  canDoMove({actor, actionOpts, figureTree}, sb(execute, done));

  function execute(isDoable) {
    if (!isDoable) {
      done(null, false);
    }
    else {
      actor.figures.forEach(updatePosition);
      actor.figures.forEach(updateRotation);
      // TODO: Why does the player disappear when they go near the left edge of the map?
      updatePosition(fieldOfView);
      done(null, true);
    }
  }

  function updatePosition(figure) {
    figure.minX += actionOpts.vector[0];
    figure.maxX += actionOpts.vector[0];
    figure.minY += actionOpts.vector[1];
    figure.maxY += actionOpts.vector[1];
  }

  function updateRotation(figure) {
    var v = actionOpts.vector;
    if (v[0] > 0 && v[1] === 0) {
      figure.rotation = -90;
    }
    else if (v[0] < 0 && v[1] === 0) {
      figure.rotation = 90;
    }
    else if (v[0] === 0 && v[1] < 0) {
      figure.rotation = 180;
    }
    else {
      figure.rotation = 0;
    }
  }
}

module.exports = move;