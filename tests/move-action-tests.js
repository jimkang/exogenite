var test = require('tape');
var move = require('../actions/move');
var assertNoError = require('assert-no-error');
var rbush = require('rbush');
var pick = require('lodash.pick');

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

var fieldOfView = {
  minX: 8,
  maxX: 11,
  minY: 3,
  maxY: 6
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
figureTree.load(threeSidesFigureTreeItems.concat(playerSoul.figures));

var canDoTestCases = [
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

var executeTestCases = [
  {
    name: 'Move left',
    opts: {
      actor: playerSoul,
      actionOpts: {
        vector: [-1, 0]
      },
      figureTree: figureTree,
      fieldOfView: fieldOfView
    },
    expectedResult: true,
    expectedActorPositions: [
      {
        minX: 8,
        maxX: 9,
        minY: 4,
        maxY: 5
      }
    ],
    expectedFieldOfView: {
      minX: 7,
      maxX: 10,
      minY: 3,
      maxY: 6
    }
  },
  {
    name: 'Move right',
    opts: {
      actor: playerSoul,
      actionOpts: {
        vector: [1, 0]
      },
      figureTree: figureTree,
      fieldOfView: fieldOfView
    },
    expectedResult: true,
    expectedActorPositions: [
      {
        minX: 9,
        maxX: 10,
        minY: 4,
        maxY: 5
      }
    ],
    expectedFieldOfView: {
      minX: 8,
      maxX: 11,
      minY: 3,
      maxY: 6
    }
  },
  {
    name: 'Move up',
    opts: {
      actor: playerSoul,
      actionOpts: {
        vector: [0, -1]
      },
      figureTree: figureTree,
      fieldOfView: fieldOfView
    },
    expectedResult: false,
    expectedActorPositions: [
      {
        minX: 9,
        maxX: 10,
        minY: 4,
        maxY: 5
      }
    ],
    expectedFieldOfView: {
      minX: 8,
      maxX: 11,
      minY: 3,
      maxY: 6
    }
  },
  {
    name: 'Move down',
    opts: {
      actor: playerSoul,
      actionOpts: {
        vector: [0, 1]
      },
      figureTree: figureTree,
      fieldOfView: fieldOfView
    },
    expectedResult: true,
    expectedActorPositions: [
      {
        minX: 9,
        maxX: 10,
        minY: 5,
        maxY: 6
      }
    ],
    expectedFieldOfView: {
      minX: 8,
      maxX: 11,
      minY: 4,
      maxY: 7
    }
  }
];

canDoTestCases.forEach(runCanDoTest);
executeTestCases.forEach(runExecuteTest);

function runCanDoTest(testCase) {
  test('canDo ' + testCase.name, moveCanDoTest);

  function moveCanDoTest(t) {
    move.canDo(testCase.opts, checkCanDo);

    function checkCanDo(error, result) {
      assertNoError(t.ok, error, 'No error from canDo.');
      t.equal(result, testCase.expected, 'canDo result is correct.');
      t.end();
    }
  }
}

function runExecuteTest(testCase) {
  test('execute ' + testCase.name, moveExecuteTest);

  function moveExecuteTest(t) {
    move.execute(testCase.opts, checkExecute);

    function checkExecute(error, result) {
      assertNoError(t.ok, error, 'No error from canDo.');
      t.equal(result, testCase.expectedResult, 'canDo result is correct.');
      t.deepEqual(
        testCase.opts.actor.figures.map(f => pick(f, 'minX', 'maxX', 'minY', 'maxY')),
        testCase.expectedActorPositions,
        'Actor figures\' positions are correct after executing.'
      );
      t.deepEqual(
        fieldOfView,
        testCase.expectedFieldOfView,
        'Field of view is correct after executing.'
      );
      // console.log(figureTree.toJSON());
      t.end();
    }
  }
}
