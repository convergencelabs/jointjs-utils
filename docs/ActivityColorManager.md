# ActivityColorManager

The ActivityColorManager maintains a consistent mapping between activity participants and colors. Colors are assigned as user join the activity and are released when participants leave.

# Namespace

`ConvergenceJointUtils.ActivityColorManager`

#Example

```JavaScript
const activity = <some Convergence Activity>;

const colorManager = new ConvergenceJointUtils.ActivityColorManager(activity);
const color = colorManager.color("someSessionId");
```

#API

| Method  | Description |
| ------------- | ------------- |
| [constructor(activity, colors?)](#constructor)  | Creates a new ActivityColorManager.  |
| [dispose()](#dispose) | Disconnects the ActivityColorManager from the paper and model. |
| [isDisposed()](#isDisposed) | Determines if the ActivityColorManager is disposed. |


## Constructor
<a name="constructor"></a>
`ActivityColorManager(activity, colors?)`
Constructs a new ActivityColorManager bound to the supplied activity. Colors are assigned and released as participants join and leave the activity. An optional array of colors can be passed in, which will determine the pallet of colors assigned to users. If the colors parameter is omitted, a default pallet will be used.

```JavaScript
const activity = <some Convergence Activity>;

const colorManager = new ConvergenceJointUtils.ActivityColorManager(activity);
```

## Prototype Methods
<a name="dispose"></a>
## `dispose()`

Disconnects the ActivityColorManager from the activity.

```JavaScript
const = activityColorManager = // new ActivityColorManager manager;
console.log(activityColorManager.isDisposed()); // prints: false

activityColorManager.dispose();
console.log(activityColorManager.isDisposed()); // prints: true
```

<a name="idDisposed"></a>
## `isDisposed()`

Determines if the ActivityColorManager is disposed.

```JavaScript
const = activityColorManager = // new pointer manager;
console.log(activityColorManager.isDisposed()); // prints: false
```