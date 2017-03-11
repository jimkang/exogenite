function SoulPool(theSouls) {
  var souls = theSouls;

  return {
    addSoul: addSoul,
    removeSoul: removeSoul,
    getSouls: getSouls
  };

  function getSouls() {
    // Please don't manipulate the souls array directly. Let's just not have to introduce
    // Immutable.js or something.
    return souls;
  }

  function addSoul(soul) {
    souls.push(soul);
  }

  function removeSoul(soul) {
    var targetIndex;

    for (var i = 0; i < souls.length; ++i) {
      if (souls[i].id === soul.id) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex !== undefined) {
      souls.splice(targetIndex, 1);
    }
  }
}

module.exports = SoulPool;
