var RouteState = require('route-state');
var wireInput = require('./representers/wire-input');
var PlayerActionRouter = require('./player-action-router');
var queue = require('d3-queue').queue;
var handleError = require('handle-error-web');
var listEmAll = require('list-em-all');
var sb = require('standard-bail')();
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
var makeFieldOfViewAroundFigure = require('./make-field-of-view-around-figure');

var routeState;
var renderFigures;

(function go() {
  routeState = RouteState({
    followRoute: followRoute,
    windowObject: window
  });

  routeState.routeFromHash();
})();

// function addTrackURIToRoute(uri) {
//   routeState.addToRoute({trackURI: uri});
// }

function followRoute(routeDict) {
  var seed = new Date().toISOString();
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

  loadQueue.defer(listEmAll.loadList, { url: figureDefURL });
  loadQueue.defer(listEmAll.loadList, { url: soulDefURL });

  var mapURL = 'data/simple-map-def.yaml';

  if (routeDict.mapURL) {
    mapURL = routeDict.mapURL;
  }

  loadQueue.defer(listEmAll.loadList, { url: mapURL });
  loadQueue.await(sb(init, handleError));
}

function init(figureDefs, soulDefs, mapDefs) {
  console.log(figureDefs);
  //console.log(mapDefs);
  var makeSoul = MakeSoul({ figureDefs: figureDefs, soulDefs: soulDefs });
  var souls = flatten(mapDefs.map(parseMapShim));
  console.log(souls);

  var playerSoul = findWhere(souls, { defname: 'player' });
  console.log('playerSoul', playerSoul);
  var soulPool = SoulPool(souls);
  var playerFigure = playerSoul.figures[0];

  var figureTree = rbush(9);
  var fieldOfView = makeFieldOfViewAroundFigure(playerFigure);
  console.log('fieldOfView', fieldOfView);

  figureTree.load(flatten(pluck(souls, 'figures')));

  var soulOps = SoulOps({ figureTree: figureTree, fieldOfView: fieldOfView });

  var runTurn = RunTurn({ soulPool: soulPool, soulOps: soulOps });

  var playerActionRouter = PlayerActionRouter({
    playerSoul: playerSoul,
    figureTree: figureTree,
    runTurn: runTurn,
    soulOps: soulOps,
    onTurnComplete: render
  });

  renderFigures = RenderFigures({
    tileSize: 100,
    onFigureClicked: playerActionRouter.onFigureClicked
  });

  render();

  wireInput(playerActionRouter);

  function parseMapShim(mapDef) {
    return parseMap({ mapDef: mapDef, makeSoul: makeSoul });
  }

  function render() {
    renderVisible(figureTree, fieldOfView, playerFigure);
  }
}

function renderVisible(figureTree, fieldOfView, playerFigure) {
  var visibleFigures = figureTree.search(fieldOfView);
  // console.log('visibleFigures count:', visibleFigures.length, 'in', fieldOfView);
  // console.log(visibleFigures);
  // if (!visibleFigures.some(isPlayerFigure)) {
  //   let pf;
  //   figureTree.all().forEach(f => {if (f.soul.defname === 'player') { pf = f; }})
  //   debugger;
  // }

  renderFigures({
    figuresByLayer: groupBy(visibleFigures, 'layer'),
    viewCenterX: playerFigure.minX,
    viewCenterY: playerFigure.minY
  });
}

// function isPlayerFigure(figure) {
//   if (figure.soul.defname === 'player') {
//     return figure;
//   }
// }
