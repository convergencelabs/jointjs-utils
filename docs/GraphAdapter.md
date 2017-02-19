# GraphAdapter

The GraphAdapter creates a two-way data binding between a JointJS Graph (joint.dia.Graph) and a Convergence RealTimeModel. Once the GraphAdapter has been configured, any changes to the Graph (either by the user or via the API) will be synchronized into the Convergence RealTimeModel and distributed to any other connected clients. Any incoming changes to the Convergence RealTimeModel will be automatically reflected in the JointJS Graph.

# Namespace

`ConvergenceJointUtils.GraphAdapter`

#Example

```JavaScript
const realTimeModel = '<some real time model>';
const graph = new joint.dia.Graph();

const adapter = new ConvergenceJointUtils.GraphAdapter(graph, model);
adapter.bind();

// Use the graph adapter and the real time model.

adapter.unbind();  // When done.
```

#API

| Method  | Description |
| ------------- | ------------- |
| [static create(realTimeModel)](#create) | Creates a new GraphAdapter with the specified model and a new graph.  |
| [constructor(graph, realTimeModel)](#constructor)  | Creates a new GraphAdapter with the specified graph and model.  |
| [getGraph()](#getGraph) | Gets the JointJS Graph used by the adapter. |
| [getModel()](#getModel) | Gets the RealTimeModel used by the adapter. |
| [isBound()](#isBound) | Determines if the adapter is bound. |
| [bind()](#bind) | Binds the adapter if it is unbound. |
| [unbind()](#unbind) | Unbinds the adapter if it is bound |



## Static Methods

<a name="create"></a>
##`create(realTimeModel)`

This static method will create a new GraphAdapter using the supplied real time model.  The GraphAdapater will be constructed with a new JointJS graph. The graph can then be accessed using the [`getGraph()`](#getGraph) method.

**Note**: The GraphAdapter is not bound at this point. You must still call the [`bind()`](#bind) method to activate the two way binding.

```JavaScript
const adapter = ConvergenceJointUtils.GraphAdapter.create(someModel);
adapater.bind();
```

## Constructor
<a name="constructor"></a>
`GraphAdapter(graph, realTimeModel)`
Constructs a new GraphAdapter using the supplied JointJS Graph and Convergence RealTimeModel.

**Note**: The GraphAdapter is not bound at this point. You must still call the [`bind()`](#bind) method to activate the two way binding.

```JavaScript
const adapter = new ConvergenceJointUtils.GraphAdapter(graph, someModel);
adapater.bind();
```

## Prototype Methods
<a name="getGraph"></a>
## `getGraph()`

Gets the JointJS Graph that this adapter is using.

```JavaScript
const adapter = ConvergenceJointUtils.GraphAdapter.create(someModel);
const graph = adapter.getGraph();
```

<a name="getModel"></a>
## `getModel()`

Gets the Convergence RealTimeModel that this adapter is using.

```JavaScript
const adapter = ConvergenceJointUtils.GraphAdapter.create(someModel);
const realTimeModel = adapter.getModel();
```

<a name="isBound"></a>
## `isBound()`

Determines if the GraphAdapter is currently bound. If the adapter is bound, then two-way data binding is active and changes to the model or graph will be reflected in the other. Returns true if two-way data binding is active, or false if it is not.

```JavaScript
const adapter = ConvergenceJointUtils.GraphAdapter.create(someModel);
console.log(adapter.isBound()) // prints: false

adapter.bind();
console.log(adapter.isBound()) // prints: true
```

<a name="bind"></a>
## `bind()`

Binds the JointJS Graph to the Convergence RealTimeModel. The current value of the RealTimeModel will be imported into the Graph.  

**Note**: Any data currently in the Graph will be replaced by the data in the RealTimeModel. This method should only be called when the GraphAdapter is not already bound. If it is already bound, the method call will be ignored.

```JavaScript
const adapter = ConvergenceJointUtils.GraphAdapter.create(someModel);
adapter.bind();
```

<a name="bind"></a>
## `unbind()`

Unbinds the JointJS Graph from the Convergence RealTimeModel. The current value of the RealTimeModel and Graph will remain unchanged, but they will no longer be connected.

**Note**: This method should only be called when the GraphAdapter is bound. If it is not bound, the method call will be ignored.

```JavaScript
const adapter = ConvergenceJointUtils.GraphAdapter.create(someModel);
adapter.bind();
adapter.unbind();
```