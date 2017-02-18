const graph = new joint.dia.Graph;

const paper = new joint.dia.Paper({

    el: document.getElementById('paper'),
    width: 800,
    height: 400,
    gridSize: 1,
    model: graph,
    snapLinks: true,
    linkPinning: false,
    embeddingMode: true,
    highlighting: {
        'default': {
            name: 'stroke',
            options: {
                padding: 6
            }
        },
        'embedding': {
            name: 'addClass',
            options: {
                className: 'highlighted-parent'
            }
        }
    },

    validateEmbedding: function(childView, parentView) {
        return parentView.model instanceof joint.shapes.devs.Coupled;
    },

    validateConnection: function(sourceView, sourceMagnet, targetView, targetMagnet) {
        return sourceMagnet != targetMagnet;
    }
});

let selectedCellView = null;

paper.on('cell:pointerclick', function(cellView) {
  if (selectedCellView !== null) {
    selectedCellView.unhighlight();
  }

  selectedCellView = cellView;
  selectedCellView.highlight();

  selectionManager.setSelectedCells(selectedCellView.model);
});

let model = null;
let activity = null;
let selectionManager = null;

// Connect to the domain.  See ../config.js for the connection settings.
Convergence.connectAnonymously(DOMAIN_URL)
  .then(function (domain) {
    // Now open the model, creating it using the initial data if it does not exist.
    const modelPromise = domain.models().open("jointjs", "example", function () {
      return ConvergenceJointUtils.DataConverter.graphJsonToModelData(DefaultGraphData);
    });

    const activityPromise = domain.activities().join("jointjs-example");

    return Promise.all([modelPromise, activityPromise])
  })
  .then(handleOpen)
  .catch(function (error) {
    console.error("Could not open model: " + error);
    throw error;
  });

function handleOpen(results) {
  const model = results[0];
  const activity = results[1];

  const graphAdapter = new ConvergenceJointUtils.GraphAdapter(graph, model);
  graphAdapter.bind();

  const colorManager = new ConvergenceJointUtils.ActivityColorManager(activity);
  const pointerManager = new ConvergenceJointUtils.PointerManager(paper, activity, colorManager, "../dist/img/cursor.svg");
  selectionManager = new ConvergenceJointUtils.SelectionManager(paper, model, colorManager);
}
