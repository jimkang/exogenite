var RouteState = require('route-state');
var wireInput = require('./representers/wire-input');
var PlayerActionRouter = require('./player-action-router');
var queue = require('d3-queue').queue;
var handleError = require('handle-error-web');
var listEmAll = require('list-em-all');
var sb = require('standard-bail')();
var request = require('basic-browser-request');
var parseMap = require('./parse-map');
var MakeSoul = require('./make-soul');
var callNextTick = require('call-next-tick');
var RenderFigures = require('./representers/render-figures');
var flatten = require('lodash.flatten');
var pluck = require('lodash.pluck');
var groupBy = require('lodash.groupby');
var rbush = require('rbush');
var findWhere = require('lodash.findwhere');

var routeState;
var renderFigures = RenderFigures({tileSize: 100});

((function go() {
  routeState = RouteState({
    followRoute: followRoute,
    windowObject: window  
  });

  routeState.routeFromHash();
})());

// function addTrackURIToRoute(uri) {
//   routeState.addToRoute({trackURI: uri});
// }

function followRoute(routeDict) {
  var seed = (new Date()).toISOString();
  if (routeDict.s && routeDict.s) {
    seed = routeDict.s;
  }

  var figureDefURL = 'data/figure-defs.yaml';

  var loadQueue = queue();

  if (routeDict.figureDefURL) {
    figureDefURL = routeDict.figureDefURL;
  }
  
  loadQueue.defer(listEmAll.loadList, {url: figureDefURL});
  
  if (routeDict.mapURL) {
    // loadQueue.defer(request, {url: routeDict.mapURL, method: 'GET'});
    loadQueue.defer(listEmAll.loadList, {url: routeDict.mapURL});
  }
  else {
    loadQueue.defer(callNextTick);
  }

  loadQueue.await(sb(init, handleError));
}

function init(figureDefs, mapDefs) {
  console.log(figureDefs);
  console.log(mapDefs);
  var makeSoul = MakeSoul({figureDefs: figureDefs});
  var souls = flatten(mapDefs.map(parseMapShim));
  console.log(souls);
  // TODO: Better way of find the player soul.
  var playerSoul = findWhere(souls, {key: 'p'});
  console.log('playerSoul', playerSoul);
  var playerFigure = playerSoul.figures[0];

  var figureTree = rbush(9);
  var fieldOfView = {
    minX: playerFigure.minX - 1,
    maxX: playerFigure.maxX + 1,
    minY: playerFigure.minY - 1,
    maxY: playerFigure.maxY + 1
  };
  console.log('fieldOfView', fieldOfView);

  figureTree.load(flatten(pluck(souls, 'figures')));
  renderVisible(figureTree, fieldOfView, playerFigure);

  wireInput(PlayerActionRouter(playerSoul));

  function parseMapShim(mapDef) {
    return parseMap({mapDef: mapDef, makeSoul: makeSoul});
  }
}


function renderVisible(figureTree, fieldOfView, playerFigure) {
  var visibleFigures = figureTree.search(fieldOfView);
  console.log('visibleFigures count:', visibleFigures.length);

  renderFigures({
    figuresByLayer: groupBy(visibleFigures, 'layer'),
    viewCenterX: playerFigure.minX,
    viewCenterY: playerFigure.minY
  });
}
