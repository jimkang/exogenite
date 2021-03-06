var callNextTick = require('call-next-tick');
var flatten = require('lodash.flatten');
var findWhere = require('lodash.findwhere');
var sb = require('standard-bail')();
var makeFieldOfViewAroundFigure = require('../make-field-of-view-around-figure');
var assign = require('lodash.assign');

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
      // TODO: Use a composite figure built from all of the figures to make the field of
      // view instead of just the first figure.
      assign(fieldOfView, getUpdatedFieldOfView(fieldOfView, actor.figures[0]));

      // Update the search tree's indexes with the new position.
      actor.figures.forEach(figureTree.remove.bind(figureTree));
      actor.figures.forEach(figureTree.insert.bind(figureTree));

      console.log('moved: self', actor.figures[0], 'fieldOfView', fieldOfView);
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

// If a figure is at a boundary of the field of view, it is still within the field of
// view. That's the point at which we'll move the field of view.
// e.g. If the field of view has minX 7.5 and maxX 11.5, a figure with 
// minX 11 and maxY 12 will need the field of view to be moved.
function getUpdatedFieldOfView(fieldOfView, figure) {
  if (Math.abs(figure.minX - fieldOfView.maxX) < 1 ||
    Math.abs(figure.maxX - fieldOfView.minX) < 1 ||
    Math.abs(figure.minY - fieldOfView.maxY) < 1 ||
    Math.abs(figure.maxY - fieldOfView.minY) < 1) {

    // TODO: Shift field of view in the direction moved rather than
    // recentering around the figure.
    return makeFieldOfViewAroundFigure(figure);
  }
  else {
    return fieldOfView;
  }
}

module.exports = move;