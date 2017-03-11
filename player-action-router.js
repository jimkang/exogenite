var handleError = require('handle-error-web');
var sb = require('standard-bail')();

var actionNamesForInputNames = {
  left: 'moveLeft',
  right: 'moveRight',
  up: 'moveUp',
  down: 'moveDown'
};

function PlayerActionRouter({playerSoul, runTurn, soulOps, onTurnComplete}) {
  return {
    onInput: onInput
  };

  function onInput(inputName) {
    var actionName = actionNamesForInputNames[inputName];
    console.log(actionName);
    if (actionName) {
      soulOps.canDoAction(
        {
          soul: playerSoul,
          actionName: actionName
        },
        sb(decideOnAction, handleError)
      );
    }

    function decideOnAction(canDoAction) {
      if (canDoAction) {
        console.log('Player can do this!');
        soulOps.queueAction({
          actionName: actionName,
          soul: playerSoul
        });

        runTurn(sb(onTurnComplete, handleError));
      }
    }
  }
}

module.exports = PlayerActionRouter;
