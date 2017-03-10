var test = require('tape');
var move = require('../actions/move');
var assertNoError = require('assert-no-error');
var rbush = require('rbush');

var playerSoul = {
  figures: [
    {
      id: 'figure-AqYpgsIk',
      minX: 9,
      minY: 4,
      maxX: 10,
      maxY: 5,
      passable: false
      // TODO: ghostStyle flag.
    }
  ]
};

var threeSidesFigureTreeItems = [
  {
    id: 'above',
    minX: 9,
    maxX: 10,
    minY: 3,
    maxY: 4,
    passable: false
  },
  {
    id: 'below',
    minX: 9,
    maxX: 10,
    minY: 5,
    maxY: 6,
    passable: true
  },
  {
    id: 'right',
    minX: 10,
    maxX: 11,
    minY: 4,
    maxY: 5,
    passable: false
  }
];

var figureTree = rbush(9);
figureTree.load(threeSidesFigureTreeItems);

var testCases = [
  {
    name: 'Move left',
    opts: {
      actor: playerSoul,
      actionOpts: {
        vector: [-1, 0]
      },
      figureTree: figureTree
    },
    expected: true
  },
  {
    name: 'Move right',
    opts: {
      actor: playerSoul,
      actionOpts: {
        vector: [1, 0]
      },
      figureTree: figureTree
    },
    expected: false
  },
  {
    name: 'Move up',
    opts: {
      actor: playerSoul,
      actionOpts: {
        vector: [0, -1]
      },
      figureTree: figureTree
    },
    expected: false
  },
  {
    name: 'Move down',
    opts: {
      actor: playerSoul,
      actionOpts: {
        vector: [0, 1]
      },
      figureTree: figureTree
    },
    expected: true
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test(testCase.name, moveTest);

  function moveTest(t) {
    move.canDo(testCase.opts, checkCanDo);

    function checkCanDo(error, result) {
      assertNoError(t.ok, error, 'No error from canDo.');
      t.equal(result, testCase.expected, 'canDo result is correct.');
      t.end();
    }
  }
}
