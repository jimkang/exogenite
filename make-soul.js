var assign = require('lodash.assign');
var createFigure = require('./create-figure');

var figureKeysForMapKeys = {
  '.': 'stone-tile',
  'p': 'armored-beef',
  'g': 'armored-beef'
};

function MakeSoul({figureDefs}) {
  return makeSoul;

  function makeSoul({key, figureBase}) {
    var soul = {
      key: key
    };
    // TODO: Souls with multiple figures.
    soul.figures = [
      assign(
        createFigure({
          figureDef: figureDefs[figureKeysForMapKeys[key]],
          addVariance: true
        }),
        figureBase
      )
    ];
    // TODO: Available actions.

    return soul;
  }
}

module.exports = MakeSoul;
