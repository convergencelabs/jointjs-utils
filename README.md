<div align="center">
  <img alt="Convergence Logo" height="80" src="https://convergence.io/assets/img/convergence-logo.png" >
</div>

# Convergence JointJS Utils
[![Build Status](https://travis-ci.org/convergencelabs/jointjs-utils.svg?branch=master)](https://travis-ci.org/convergencelabs/jointjs-utils)

This project contains utilities to that make integrating [JointJS](https://www.jointjs.com/) with [Convergence](https://convergencelabs.com) simple. JointJS is used to render the graph and Convergence is used to keep the data in sync between clients. With these utilities you can easily make a collaborative graph where changes made by one user are instantly seen by other users. This project also provides collaboration awareness features like shared pointers and share selections to help users coordinate their actions. The project contains four main components:

- [`DataConverter`](docs/DataConverter.md): Converts between the JointJS and Convergence representations of data.
- [`GraphAdapter`](docs/GraphAdapter.md): Keeps the data in the graph synchronized between users. Captures changes to the graph data model and updates the Convergence data model accordingly, which in turn notifies all other connected client.
- [`PointerManager`](docs/PointerManager.md): Adapts the JointJS `Paper` class to capture the pointer location and distributes the pointer to other clients using a Convergence `Activity`. Remote users points are rendered on the Paper to show what other users are doing.
- [`SelectionManager`](docs/SelectionManager.md): Provides basic shared selection, where each user can select on or more elements on the graph. Remote selections from other users are rendered to help coordinate users actions.
- [`ActivityColorManager`](docs/ActivityColorManager.md): Assigns colors to each participant of a Convergence Activity to keep their cursor and selection colors consistent.

# Documentation
Documentation can be found [Here](docs).


# Dependencies
This library depends on the following libraries:

* **Convergence Server**: The Convergence Server (see: https://convergence.io/quickstart/)
* **@convergence/convergence**: The main Convergence client API.
* **@convergence/color-assigner**: A utility for assigning colors to unique resources.
* **jointjs**: The open source JointJS library

# Building the Distribution

```
npm install
npm run dist
```

# Example
To run the example you must first:

1. Build the distribution
2. Follow the steps in the example/config.example.js file
3. Open the example/index.html file in your browser


Note: to run the example you must have a Convergence Server.
