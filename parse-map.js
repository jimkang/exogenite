function parseMap({mapDef, datumFromKeyFn}) {
  var lines = mapDef.split('\n');
  var items = [];

  for (let y = 0; y < lines.length; ++y) {
    let line = lines[y];

    for (let x = 0; x < line.length; ++x) {
      items.push({
        minX: x,
        minY: y,
        maxX: x + 1,
        maxY: y + 1,
        datum: datumFromKeyFn(line[x])
      });
    }
  }

  return items;
}

module.exports = parseMap;
