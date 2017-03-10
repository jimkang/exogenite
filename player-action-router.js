var handleError = require('handle-error-web');
var sb = require('standard-bail')();

var actionNamesForInputNames = {
  left: 'moveLeft',
  right: 'moveRight',
  up: 'moveUp',
  down: 'moveDown'
};

function PlayerActionRouter(playerSoul, figureTree) {
  // TODO: Consider whether the figureTree should be here, or if there's a way 
  // to get something else to hold onto it and ask the player soul what to do, e.g. DM object.
  return {
    onInput: onInput
  };

  function onInput(inputName) {
    var actionName = actionNamesForInputNames[inputName];
    console.log(actionName);
    if (actionName) {      
      playerSoul.canDoAction(
        {
          actionName: actionName,
          figureTree: figureTree
        },
        sb(decideOnAction, handleError)
      );
    }
  }

  function decideOnAction(canDoAction) {
    if (canDoAction) {
      console.log('Player can do this!');
      // then, kick off the turn!      
    }
  }
}

module.exports = PlayerActionRouter;
