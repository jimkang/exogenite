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
      key: key
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
    // TODO: Available actions.

    return soul;
  }
}

module.exports = MakeSoul;
