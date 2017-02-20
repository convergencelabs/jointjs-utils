declare namespace joint {
  const version: string;

  namespace config {
    const classNamePrefix: string;
    const defaultTheme: string;
  }

  // `joint.dia` namespace.
  namespace dia {
  }

  // `joint.ui` namespace.
  namespace ui {
  }

  // `joint.layout` namespace.
  namespace layout {
  }

  // `joint.shapes` namespace.
  namespace shapes {
  }

  // `joint.format` namespace.
  namespace format {
  }

  // `joint.connectors` namespace.
  namespace connectors {
  }

  // `joint.highlighters` namespace.
  namespace highlighters {
  }

  // `joint.routers` namespace.
  namespace routers {
  }

  // `joint.mvc` namespace.
  namespace mvc {
    namespace views {
    }
  }

  function setTheme(theme: string, opt: any);

  namespace util {
    function hashCode(str: string): number;

    function getByPath(obj: any, path: string, delim: string);

    function setByPath(obj: any, path: string, value: any, delim: string);

    function unsetByPath(obj: any, path: string, delim: string);

    function flattenObject(obj: any, delim: string, stop: (v: any) => boolean);

    function uuid(): string;

    function guid(obj: any): string;

    function nextFrame(callback: Function, context?: any): number;

    function cancelFrame(requestId: number);

    function shapePerimeterConnectionPoint(linkView, view, magnet, ref): void;

    function breakText(text: string, size: number, attrs?: any, opt?: any): string;

    function imageToDataUri(url: string, callback: (err: Error, dataUri: string) => void): void;

    function getElementBBox(el: HTMLElement): {x: Number, y: Number, width: Number, height: Number};

    function sortElements(elements: HTMLElement[], comparator: (a: HTMLElement, b: HTMLElement) => number): HTMLElement[];

    function setAttributesBySelector(el: HTMLElement, attrs: any);

    function normalizeSides(box: number | {top?: Number, bottom?: Number, left?: Number, right?: Number}): {top: Number, bottom: Number, left: Number, right: Number}


  }
}
