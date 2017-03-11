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
var SoulPool = require('./soul-pool');
var RunTurn = require('./run-turn');
var SoulOps = require('./soul-ops');

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
  var soulDefURL = 'data/soul-defs.yaml';

  var loadQueue = queue();

  if (routeDict.figureDefURL) {
    figureDefURL = routeDict.figureDefURL;
  }
  if (routeDict.soulDefURL) {
    soulDefURL = routeDict.soulDefURL;
  }

  loadQueue.defer(listEmAll.loadList, {url: figureDefURL});
  loadQueue.defer(listEmAll.loadList, {url: soulDefURL});

  if (routeDict.mapURL) {
    // loadQueue.defer(request, {url: routeDict.mapURL, method: 'GET'});
    loadQueue.defer(listEmAll.loadList, {url: routeDict.mapURL});
  }
  else {
    loadQueue.defer(callNextTick);
  }

  loadQueue.await(sb(init, handleError));
}

function init(figureDefs, soulDefs, mapDefs) {
  console.log(figureDefs);
  console.log(mapDefs);
  var makeSoul = MakeSoul({figureDefs: figureDefs, soulDefs: soulDefs});
  var souls = flatten(mapDefs.map(parseMapShim));
  console.log(souls);

  var playerSoul = findWhere(souls, {defname: 'player'});
  console.log('playerSoul', playerSoul);
  var soulPool = SoulPool(souls);
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
  render();

  var soulOps = SoulOps({figureTree: figureTree, fieldOfView: fieldOfView});

  var runTurn = RunTurn({soulPool: soulPool, soulOps: soulOps});

  var playerActionRouter = PlayerActionRouter({
    playerSoul: playerSoul,
    figureTree: figureTree,
    runTurn: runTurn,
    soulOps: soulOps,
    onTurnComplete: render
  });

  wireInput(playerActionRouter);

  function parseMapShim(mapDef) {
    return parseMap({mapDef: mapDef, makeSoul: makeSoul});
  }

  function render() {
    renderVisible(figureTree, fieldOfView, playerFigure);
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
