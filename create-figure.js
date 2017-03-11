// TODO: Use seeded probable.
var probable = require('probable');
var cloneDeep = require('lodash.clonedeep');
var d3Color = require('d3-color');
var randomId = require('idmaker').randomId;

function createFigure({figureDef, soul, addVariance}) {
  var figure = cloneDeep(figureDef);
  figure.id = 'figure-' + randomId(8);
  figure.soul = soul;

  if (addVariance) {
    // figure.rotation = probable.roll(360);
    setColors({
      figure: figure,
      aMaxVariance: 100,
      bMaxVariance: 50,
      lMaxVariance: 50
    });
  }
  return figure;
}

function setColors({figure, aMaxVariance, bMaxVariance, lMaxVariance}) {
  var baseColor = {
    l: probable.roll(50) + probable.roll(50), // 150 is the max. Keep it away from that.
    a: probable.roll(200) - 100,
    b: probable.roll(200) - 100
  };
  var lVariance = probable.roll(lMaxVariance);
  var aVariance = probable.roll(aMaxVariance);
  var bVariance = probable.roll(bMaxVariance);

  if (figure.groups) {
    figure.groups.forEach(setGroupColor);
  }

  function setGroupColor(group) {
    group.color = formatLAB(varyColor(baseColor, lVariance, aVariance, bVariance));
  }
}

function varyColor(baseColor, lVariance, aVariance, bVariance) {
  return {
    l: varyColorComponent(baseColor.l, lVariance, 0, 150),
    a: varyColorComponent(baseColor.a, aVariance, -100, 100),
    b: varyColorComponent(baseColor.b, bVariance, -100, 100)
  };
}

function varyColorComponent(component, variance, lowerBound, upperBound, valueCycles) {
  var c = component + getDirection() * probable.roll(variance);

  if (valueCycles) {
    c = c % (upperBound - lowerBound);

    if (c < lowerBound) {
      c = upperBound - (lowerBound - c);
    }
  }
  else {
    if (c > upperBound) {
      c = upperBound;
    }
    else if (c < lowerBound) {
      c = lowerBound;
    }
  }
  return c;
}

function getDirection() {
  return probable.roll(2) === 0 ? 1 : -1;
}

function formatLAB(color) {
  return d3Color.hsl(d3Color.lab(color.l, color.a, color.b)).toString();
}

module.exports = createFigure;
