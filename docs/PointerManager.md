# PointerManager

The PointerManager provides a shared pointer that is connected to the `joint.dia.Paper` objects.  The location of the local pointer is captured from a Paper object and transmitted to participants of a Convergence `Activity`. Remote pointers from other users are rendered on the Paper with a color corresponding to the specific user.

# Namespace

`ConvergenceJointUtils.PointerManager`

#Example

```JavaScript
const activity =  <some Convergence Activity>;
const paper = <some JointJS Paper>;

const colorManager = new ConvergenceJointUtils.ActivityColorManager(activity);
const pointerManager = new ConvergenceJointUtils.PointerManager(
  paper, activity, colorManager, "../dist/img/cursor.svg");

```

#API

| Method  | Description |
| ------------- | ------------- |
| [constructor(paper, activity, colorManager, cursorSvgUrl)](#constructor)  | Creates a new PointerManager.  |
| [dispose()](#dispose) | Disconnects the PointerManager from the paper and activity. |
| [isDisposed()](#isDisposed) | Determines if the PointerManager is disposed. |


## Constructor
<a name="constructor"></a>
`PointerManager(paper, activity, colorManager, cursorSvgUrl)`
Constructs a new PointerManager. The pointer manager will capture local pointer locations and render remote pointers on the supplied paper. The supplied activity will be used to determine who to share the pointer locations with. The color manager will be used to determine the color of each remote pointer.  The cursorSvg will be used to determine what the pointer looks like.
 

```JavaScript
const pointerManager = new ConvergenceJointUtils.PointerManager(
  paper, activity, colorManager, cursorSvgUrl);
```

## Prototype Methods
<a name="dispose"></a>
## `dispose()`

Disconnects the paper from the activity. After calling dispose, the local pointer will no longer be broadcast and remote pointers will be removed and no longer rendered. Once dispose is called this instance can no longer be used.

```JavaScript
const = pointerManager = // new pointer manager;
console.log(pointerManager.isDisposed()); // prints: false

pointerManager.dispose();
console.log(pointerManager.isDisposed()); // prints: true
```

<a name="idDisposed"></a>
## `isDisposed()`

Determines if the PointerManager is disposed.

```JavaScript
const = pointerManager = // new pointer manager;
console.log(pointerManager.isDisposed()); // prints: false
```
