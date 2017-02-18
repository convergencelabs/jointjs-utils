# GraphAdapter

The GraphAdapter creates a two-way data binding between a JointJS Graph (joint.dia.Graph) and a Convergence RealTimeModel. Once the GraphAdapter has been configured, any changes to the Graph (either by the user or via the API) will be synchronized into the Convergence RealTimeModel and distributed to any other connected clients. Any incoming changes to the Convergence RealTimeModel will be automatically reflected in the JointJS Graph.

# Namespace

The GraphAdapter class is exposed under the `ConvergenceJointUtils.GraphAdapter` namespace.

#API

* [static create(realTimeModel)](#create)
* [constructor(graph, realTimeModel)](#constructor)
* [getGraph()](#getGraph)
* [getModel()](#getModel)
* [isBound()](#isBound)
* [bind()](#bind)
* [unbind()](#unbind)


## Static Methods

<a name="create"></a>
`create(realTimeModel)`

This static method will create a new Graph

## Constructor
<a name="constructor"></a>
`GraphAdapter(graph, realTimeModel)`

## Prototype Methods
<a name="getGraph"></a>
`getGraph()`

This static method will create a new Graph