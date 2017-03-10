var actionsForInputNames = {
  left: {actionName: 'move', params: {direction: 'left'}},
  right: {actionName: 'move', params: {direction: 'right'}},
  up: {actionName: 'move', params: {direction: 'up'}},
  down: {actionName: 'move', params: {direction: 'down'}},
};

function PlayerActionRouter(playerSoul) {
  return {
    onInput: onInput
  };

  function onInput(inputName) {
    var actionPack = actionsForInputNames[inputName];
    console.log(actionPack);
    if (actionPack && playerSoul.canDoAction(actionPack)) {
      console.log('Player can do this!');
    }
  }
}

module.exports = PlayerActionRouter;
