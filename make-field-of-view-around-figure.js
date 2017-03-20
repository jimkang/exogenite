const fieldExtensionSize = 2;
const fieldMargin = 0.5;

// Field of view searches are inclusive. Figures at the border of the field
// of view are included.
// e.g. If the field of view has minX 8.5 and maxX 10.5, a figure with 
// minX 10 and maxY 11 will be included.
// The fieldMargin is subracted from the various dimensions when calculating field
// of view so that it does not include figures an extra tile out, e.g. a figure
// at minX 11 and maxY 12 would be included if we did not use the margin and had
// a field of view with minX 9 and maxX 11 because the view and figure intersect
// exactly at 11.
function makeFieldOfViewAroundFigure(figure) {
  return {
    minX: figure.minX - fieldExtensionSize + fieldMargin,
    maxX: figure.maxX + fieldExtensionSize - fieldMargin,
    minY: figure.minY - fieldExtensionSize + fieldMargin,
    maxY: figure.maxY + fieldExtensionSize - fieldMargin
  };
}

module.exports = makeFieldOfViewAroundFigure;
