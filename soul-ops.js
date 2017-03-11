var actionMap = require('./actions/action-map');
var callNextTick = require('call-next-tick');

function SoulOps({figureTree, fieldOfView}) {
  return {
    canDoAction: canDoAction,
    queueAction: queueAction,
    takeTurn: takeTurn
  };

  function canDoAction({soul, actionName}, done) {
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

  function queueAction({soul, actionName}) {
    soul.plannedActionSpec = soul.repertoire[actionName];
  }

  function takeTurn({soul}, done) {
    console.log('Taking turn for', soul.id);

    if (soul.plannedActionSpec) {
      runPlannedActionSpec({soul, figureTree}, done);
    }
    else {
      // TODO
      callNextTick(done);
    }
  }

  function runPlannedActionSpec({soul}, done) {
    var action = actionMap[soul.plannedActionSpec.actionId];
    var actionOpts = soul.plannedActionSpec.actionOpts;
    soul.plannedActionSpec = null;

    action.execute(
      {
        actor: soul,
        actionOpts: actionOpts,
        figureTree: figureTree,
        fieldOfView: fieldOfView
      },
      done
    );
  }
}

module.exports = SoulOps;
