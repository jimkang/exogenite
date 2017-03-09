var Strokerouter = require('strokerouter');

function wireInput({onLeft, onRight, onUp, onDown}) {
  var docStrokerouter = Strokerouter(document);
  // Single key routes.
  docStrokerouter.routeKeyUp('leftArrow', null, onLeft);
  docStrokerouter.routeKeyUp('rightArrow', null, onRight);
  docStrokerouter.routeKeyUp('upArrow', null,  onUp);
  docStrokerouter.routeKeyUp('downArrow', null, onDown);

  docStrokerouter.routeKeyUp('h', null,  onLeft);
  docStrokerouter.routeKeyUp('l', null, onRight);
  docStrokerouter.routeKeyUp('k', null,  onUp);
  docStrokerouter.routeKeyUp('j', null, onDown);
}

module.exports = wireInput;
