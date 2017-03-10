var assign = require('lodash.assign');
var createFigure = require('./create-figure');
var cloneDeep = require('lodash.clonedeep');
var actionMap = require('./actions/action-map');
var callNextTick = require('call-next-tick');

var figureKeysForMapKeys = {
  't': 'stone-tile',
  'p': 'armored-beef',
  'g': 'armored-beef'
};

function MakeSoul({figureDefs, soulDefs}) {
  return makeSoul;

  function makeSoul({key, figureBase}) {
    var figureDef = figureDefs[figureKeysForMapKeys[key]];
    if (!figureDef) {
      return;
    }

    var soul = cloneDeep(soulDefs[key]);
    soul.canDoAction = canDoAction;

    // TODO: Souls with multiple figures from soulDef;
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

    soul.potentialActions = [];
    if (key === 'p') {
      soul.potentialActions.push('move');
    }

    return soul;

    function canDoAction({actionName, figureTree}, done) {
      var actionSpec = soul.repertoire[actionName];

      if (!actionSpec) {
        callNextTick(done, null, false);
        return;
      }

      var action = actionMap[actionSpec.actionId];
      action.canDo(
        {
          actor: soul,
          actionOpts: actionSpec.actionOpts,
          figureTree: figureTree
        },
        done
      );
    }
  }
}

module.exports = MakeSoul;
