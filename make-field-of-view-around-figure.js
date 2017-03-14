const fieldExtensionSize = 1;

function makeFieldOfViewAroundFigure(figure) {
  return {
    minX: figure.minX - fieldExtensionSize,
    maxX: figure.maxX + fieldExtensionSize,
    minY: figure.minY - fieldExtensionSize,
    maxY: figure.maxY + fieldExtensionSize
  };
}

module.exports = makeFieldOfViewAroundFigure;
