
export interface RateLimitedFunction {
  func: Function,
  clear?();
}

export function rateLimit(callback: Function, minIntervalMs: number, clearable: boolean): RateLimitedFunction {
  let lastEventTime: number = 0;
  let finalEventTimerId: any = null;
  const context: any = this;

  const func = function() {
    const args = arguments;
    const time = Date.now();
    const delta = time - lastEventTime;

    if (delta > minIntervalMs) {
      lastEventTime = time;
      callback.apply(context, args);
    } else {
      if (finalEventTimerId) {
        clearTimeout(finalEventTimerId);
        finalEventTimerId = null;
      }
      finalEventTimerId = setTimeout(function () {
        callback.apply(context, args);
      }, minIntervalMs - delta);
    }
  };

  if (!clearable) {
    return {
      func: func
    };
  } else {
    return {
      func: func,
      clear: function() {
        clearTimeout(finalEventTimerId);
      }
    }
  }
}


