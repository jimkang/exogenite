var assign = require('lodash.assign');
var createFigure = require('./create-figure');

var figureKeysForMapKeys = {
  't': 'stone-tile',
  'p': 'armored-beef',
  'g': 'armored-beef'
};

function MakeSoul({figureDefs}) {
  return makeSoul;

  function makeSoul({key, figureBase}) {
    var figureDef = figureDefs[figureKeysForMapKeys[key]];
    if (!figureDef) {
      return;
    }

    var soul = {
      key: key,
      canDoAction: canDoAction
    };
    // TODO: Souls with multiple figures.
    soul.figures = [
      assign(
        createFigure({
          figureDef: figureDef,
          addVariance: true,
          soul: soul
        }),
        figureBase
      )
    ];

    // TODO: Load this from a soul def.
    soul.potentialActions = [];
    if (key === 'p') {
      soul.potentialActions.push('move');
    }

    return soul;

    function canDoAction(actionPack) {
      if (soul.potentialActions.indexOf(actionPack.actionName) === -1) {
        return false;
      }
      // TODO: See if action is possible with params, current situation.
      return true;
    }
  }
}

module.exports = MakeSoul;
