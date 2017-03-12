var d3 = require('d3-selection');
var range = require('d3-array').range;
var accessor = require('accessor');
var GetPropertySafely = require('./get-property-safely');

var getId = accessor();
// var getName = accessor('defname');
var getElementsHTML = accessor('elements');
var getGroups = accessor('groups');
var getGroupname = accessor('groupname');
var getColor = GetPropertySafely('color', 'hsl(0, 0%, 50%)');

function RenderFigures({tileSize, onFigureClicked}) {
  var panRoot = d3.select('#pan-root');
  var board = d3.select('#board');
  
  const halfBoardWidth = board.attr('width')/2;
  const halfBoardHeight = board.attr('height')/2;

  renderLayers(range(10));

  return renderFigures;

  function renderFigures({figuresByLayer, viewCenterX, viewCenterY}) {
    for (var layer in figuresByLayer) {
      renderFigureOntoLayer(layer, figuresByLayer[layer]);
    }

    panRoot.attr(
      'transform',
      `translate(${-viewCenterX  * tileSize + halfBoardWidth},
        ${-viewCenterY * tileSize + halfBoardHeight})`
    );   
  }

  function renderFigureOntoLayer(layer, figureData) {
    var figures = panRoot.select('#' + prefixIndex(layer)).selectAll('.figure')
      .data(figureData, getId);

    figures.exit().remove();
    var figuresToUpdate = figures.enter().append('g')
      .classed('figure', true)
      .on('click', onFigureClicked)
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
    var layers = panRoot.selectAll('g').data(layerIndexes);
    layers.exit().remove();
    layers
      .enter().append('g')
      .merge(layers).attr('id', prefixIndex);
  }

  function getFigureTransform(figure) {
    var transform = '';

    if (!isNaN(figure.minX) && !isNaN(figure.minY)) {
      transform += `translate(${figure.minX * tileSize}, ${figure.minY * tileSize})`;
    }
    if (figure.rotation) {
      if (transform.length > 0) {
        transform += ' ';
      }
      transform += `rotate(${figure.rotation}, 50, 50)`;
    }
    return transform;
  }
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

module.exports = RenderFigures;
