var Strokerouter = require('strokerouter');

function wireInput({onInput}) {
  var docStrokerouter = Strokerouter(document);
  // Single key routes.
  docStrokerouter.routeKeyUp('leftArrow', null, CallOnInput('left'));
  docStrokerouter.routeKeyUp('rightArrow', null, CallOnInput('right'));
  docStrokerouter.routeKeyUp('upArrow', null,  CallOnInput('up'));
  docStrokerouter.routeKeyUp('downArrow', null, CallOnInput('down'));

  docStrokerouter.routeKeyUp('h', null,  CallOnInput('left'));
  docStrokerouter.routeKeyUp('l', null, CallOnInput('right'));
  docStrokerouter.routeKeyUp('k', null,  CallOnInput('up'));
  docStrokerouter.routeKeyUp('j', null, CallOnInput('down'));

  function CallOnInput(inputName) {
    return function callOnInput() {
      onInput(inputName);
    };
  }
}

module.exports = wireInput;
