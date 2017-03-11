var assign = require('lodash.assign');
var createFigure = require('./create-figure');
var cloneDeep = require('lodash.clonedeep');
var randomId = require('idmaker').randomId;  

var figureKeysForMapKeys = {
  't': 'stone-tile',
  'p': 'armored-beef',
  'g': 'armored-beef'
};

function MakeSoul({figureDefs, soulDefs}) {
  return makeSoul;

  function makeSoul({key, baseLocation}) {
    var figureDef = figureDefs[figureKeysForMapKeys[key]];
    if (!figureDef) {
      return;
    }

    var soul = cloneDeep(soulDefs[key]);
    soul.id = 'soul-' + randomId(8);
    
    // TODO: Souls with multiple figures from soulDef.
    soul.figures = [
      assign(
        createFigure({
          figureDef: figureDef,
          addVariance: true,
          soul: soul
        }),
        baseLocation
      )
    ];

    return soul;
  }
}

module.exports = MakeSoul;
