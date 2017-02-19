# DataConverter

The DataConverter class provides static methods that help convert between the JointJS an Convergence JSON representations of a Graph.  The two representations are similar but slightly different.

# Namespace

`ConvergenceJointUtils.DataConverter`

#Example

```JavaScript
const graph = new joint.dia.Graph();
// Add data to graph

const modelJson =
  ConvergenceJointUtils.DataConverter.graphJsonToModelData(graph.toJSON());

const realTimeModel = // Some RealTimeModel
const graphJson = 
  ConvergenceJointUtils.DataConverter.modelDataToGraphJson(realTimeModel().value());
```

#API

| Method  | Description |
| ------------- | ------------- |
| [graphJsonToModelData(graphJson)](#graphJsonToModelData) | Converts the JointJS JSON representation to the RealTimeModel representation of a graph.  |
| [modelDataToGraphJson(modelData)](#modelDataToGraphJson)  | Converts the RealTimeModel representation of a graph to the JointJS representation of a graph. |


## Static Methods

<a name="graphJsonToModelData"></a>
##`graphJsonToModelData(graphJson) `

Converts the JointJS representation of a graph to the Conververgence JSON Representation of a graph. The JointJS representation is typically gotten from a `joint.dia.Graph` instance using the `toJSON()` method. The resulting JSON object can be used to initialize a Convergence RealTimeModel.

```JavaScript
const graph = new joint.dia.Graph();

// Add some cells ...

const modelData =
  ConvergenceJointUtils.DataConverter.graphJsonToModelData(graph.toJSON());
  
realTimeModel.root.value(modelData);
```

<a name="graphJsonToModelData"></a>
##`modelDataToGraphJson(modelData) `

Converts the Convergence representation of a graph to the Joint JSON Representation of a graph. The Convergence representation is typically obtained by getting the value of the root element of a RealTimeModel. A `joint.dia.Graph` instance can be initialized using the `fromJSON(json)` method.

```JavaScript
const realTimeModel = // some real time model.
const graphData =
  ConvergenceJointUtils.DataConverter.modelDataToGraphJson(realTimeModel.root.value());

const graph = new joint.dia.Graph();
graph.fromJSON(graphData);
```
