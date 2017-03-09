function PlayerResponder() {
  return {
    onLeft: onLeft,
    onRight: onRight,
    onUp: onUp,
    onDown: onDown
  };

  function onLeft() {
    console.log('left');
  }

  function onRight() {
    console.log('right');
  }

  function onUp() {
    console.log('up');
  }

  function onDown() {
    console.log('down');
  }
  
}

module.exports = PlayerResponder;
