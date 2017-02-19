# SelectionManager

The SelectionManager provides shared selection functionality using a Convergence ElementReference associated with the `RealTimeModel` representing the Graph.  The local user can set the selection using the SelectionManager and the local selection will be broadcast to all collaborators of the RealTimeModel. Remote selections will be rendered by highlighting the selected elements rendered in the local paper / graph.

# Namespace

`ConvergenceJointUtils.SelectionManager`

#Example

```JavaScript
const model =  <some Convergence RealTimeModel>;
const activity = <some Convergence Activity>;

const graphAdapter = ConvergenceJointUtils.GraphAdapter.create(model);
const paper = new joint.dia.Paper({
  model: graphAdapter.graph()
});

const colorManager = new ConvergenceJointUtils.ActivityColorManager(activity);
const selectionManager = new ConvergenceJointUtils.SelectionManager(paper, graphAdapter, colorManager);

```

#API

| Method  | Description |
| ------------- | ------------- |
| [constructor(paper, graphAdapter, colorManager)](#constructor)  | Creates a new SelectionManager.  |
| [dispose()](#dispose) | Disconnects the SelectionManager from the paper and model. |
| [isDisposed()](#isDisposed) | Determines if the SelectionManager is disposed. |


## Constructor
<a name="constructor"></a>
`SelectionManager(paper, realTimeModel, colorManager)`
Constructs a new SelectionManager remote selections will be rendered on the supplied paper. The local selection will be broadcast using an ElementReference from the associated graphAdapter.

**Note**: the realTimeModel should be bound to the graph that the paper is rendering. The colorManager determines the highlight color of remote selections.


```JavaScript
const selectionManager = 
  new ConvergenceJointUtils.SelectionManager(paper, realTimeModel, colorManager);
```

## Prototype Methods
<a name="dispose"></a>
## `dispose()`

Disconnects the SelectionManager from the paper and the RealTimeModel. After calling dispose, the local selection will no longer be broadcast and remote selections will be removed and no longer rendered. Once dispose is called this instance can no longer be used.

```JavaScript
const = selectionManager = // new pointer manager;
console.log(selectionManager.isDisposed()); // prints: false

selectionManager.dispose();
console.log(selectionManager.isDisposed()); // prints: true
```

<a name="idDisposed"></a>
## `isDisposed()`

Determines if the SelectionManager is disposed.

```JavaScript
const = selectionManager = // new pointer manager;
console.log(selectionManager.isDisposed()); // prints: false
```
