var d3 = require('d3-selection');
var range = require('d3-array').range;
var accessor = require('accessor');
var GetPropertySafely = require('./get-property-safely');

var getName = accessor('defname');
var getElementsHTML = accessor('elements');
var getGroups = accessor('groups');
var getGroupname = accessor('groupname');
var getColor = GetPropertySafely('color', 'hsl(0, 0%, 50%)');

function renderFigures(figuresByLayer) {
  var board = d3.select('#board');

  // TODO: Layer rendering could be done once and moved out into another function.
  renderLayers(range(10));

  for (var layer in figuresByLayer) {
    renderFigureOntoLayer(board, layer, figuresByLayer[layer]);
  }
}

function renderFigureOntoLayer(board, layer, figureData) {
  var figures = board.select('#' + prefixIndex(layer)).selectAll('.figure')
    // When doing this in the actual app, use the instance's 'id', not defname, as the key.
    .data(figureData, getName);

  figures.exit().remove();
  var figuresToUpdate = figures.enter().append('g')
    .classed('figure', true)
    .merge(figures);

  figuresToUpdate.attr('transform', getFigureTransform);

  var figGroups = figuresToUpdate.selectAll('.figure-group')
    .data(getGroups, getGroupname);

  figGroups.exit().remove();
  figGroups.enter().append('g')
    .merge(figGroups)
    .attr('class', getFigureGroupClasses)
    .attr('fill', getColor)
    .html(getElementsHTML);
}

function renderLayers(layerIndexes) {
  var layers = d3.select('#board').selectAll('g').data(layerIndexes);
  layers.exit().remove();
  layers
    .enter().append('g')
    .merge(layers).attr('id', prefixIndex);
}

function prefixIndex(index) {
  return 'layer-' + index;
}

function getFigureGroupClasses(figure) {
  var classes = ['figure-group'];
  if (Array.isArray(figure.classes)) {
    classes = classes.concat(figure.classes);
  }
  return classes.join(' ');
}

function getFigureTransform(figure) {
  var transform = '';

  if (figure.position) {
    transform += `translate(${figure.position[0]}, ${figure.position[1]})`;
  }
  if (figure.rotation) {
    if (transform.length > 0) {
      transform += ' ';
    }
    transform += `rotate(${figure.rotation}, 50, 50)`;
  }
  return transform;
}

module.exports = renderFigures;
