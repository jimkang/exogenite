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
    onInput: onInput,
    onFigureClicked: onFigureClicked
  };

  function onInput(inputName) {
    var actionName = actionNamesForInputNames[inputName];
    console.log(actionName);
    if (actionName) {
      attemptAction(actionName);
    }
  }

  function onFigureClicked(figure) {
    // TODO: Take into account possible multiple figures for player.
    var mainPlayerFigure = playerSoul.figures[0];
    if (mainPlayerFigure.id === figure.id) {
      console.log('Clicked on player figure.');
    }
    else {
      var playerCenterX = (mainPlayerFigure.minX + mainPlayerFigure.maxX)/2;
      var playerCenterY = (mainPlayerFigure.minY + mainPlayerFigure.maxY)/2;
      var figureCenterX = (figure.minX + figure.maxX)/2;
      var figureCenterY = (figure.minY + figure.maxY)/2;
      var vector = [figureCenterX - playerCenterX, figureCenterY - playerCenterY];
      attemptAction(mapVectorToMoveAction(vector));      
      // console.log('direction', direction);
    }
  }

  function attemptAction(actionName) {
    soulOps.canDoAction(
      {
        soul: playerSoul,
        actionName: actionName
      },
      sb(decideOnAction, handleError)
    );

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

// function normalizeVector(v, magnitude) {
//   var normalized = [];
//   if (v[0] > v[1]) {
//     normalized[1] = v[1]/v[0] * magnitude;
//     normalized[0] = magnitude;
//   }
//   else {
//     normalized[0] = v[0]/v[1] * magnitude;
//     normalized[1] = magnitude;
//   }
//   return normalized;
// }

function mapVectorToMoveAction(v) {
  var actionName;

  if (Math.abs(v[0]) > Math.abs(v[1])) {
    if (v[0] > 0) {
      actionName = 'moveRight';
    }
    else {
      actionName = 'moveLeft';
    }
  }
  else {
    if (v[1] > 0) {
      actionName = 'moveDown';
    }
    else {
      actionName = 'moveUp';
    }
  }
  return actionName;
}

module.exports = PlayerActionRouter;
