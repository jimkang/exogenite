var RouteState = require('route-state');
var wireInput = require('./representers/wire-input');
var PlayerResponder = require('./player-responder');
var queue = require('d3-queue').queue;
var handleError = require('handle-error-web');
var listEmAll = require('list-em-all');
var sb = require('standard-bail')();
var request = require('basic-browser-request');
var parseMap = require('./parse-map');
var MakeSoul = require('./make-soul');
var callNextTick = require('call-next-tick');

var routeState;

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
    loadQueue.defer(request, {url: routeDict.mapURL, method: 'GET'});
  }
  else {
    loadQueue.defer(callNextTick);
  }

  loadQueue.await(sb(init, handleError));
}

function init(figureDefs, mapRes) {
  console.log(figureDefs);
  console.log(mapRes.rawResponse);
  var makeSoul = MakeSoul({figureDefs: figureDefs});
  var souls = parseMap({mapDef: mapRes.rawResponse, makeSoul: makeSoul});
  console.log(souls);


  wireInput(PlayerResponder());
}
