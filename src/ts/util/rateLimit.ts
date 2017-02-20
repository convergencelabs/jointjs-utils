
export interface RateLimitedFunction<T> {
  func: T,
  clear?();
}

export function rateLimit<T extends (...args: any[]) => any>(callback: T, minIntervalMs: number, clearable: boolean): RateLimitedFunction<T> {
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
  } as T;

  if (!clearable) {
    return {
      func: func as T
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


