function parseMap({mapDef, makeSoul}) {
  var lines = mapDef.split('\n');
  var souls = [];

  for (let y = 0; y < lines.length; ++y) {
    let line = lines[y];

    for (let x = 0; x < line.length; ++x) {
      var figureBase = {
        minX: x,
        minY: y,
        maxX: x + 1,
        maxY: y + 1,
      };
      var soul = makeSoul({key: line[x], figureBase: figureBase});
      if (soul) {
        souls.push(soul);
      }
    }
  }

  return souls;
}

module.exports = parseMap;
