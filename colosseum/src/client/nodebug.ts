export function nodebug<A extends any[], B>(
  gen: (...args: A) => Generator<any, B, any>
): (...args: A) => Promise<B> {
  return (...args: A) =>
    new Promise((resolve) => {
      runAsync(gen(...args), null, resolve);
    });
}

function runAsync(gen: Generator, arg: any, resolve: (v: any) => void) {
  DEVTOOL_TRAP();
  const res = gen.next(arg);
  if (res.done) {
    resolve(res.value);
  } else {
    if (res.value instanceof Promise) {
      res.value.then((val) => runAsync(gen, val, resolve));
    }
  }
}

function DEVTOOL_TRAP() {
  while (IS_SOMEONE_WATCHING()) {}
}

function IS_SOMEONE_WATCHING() {
  const HUMAN_CANT_BE_THAT_FAST = 10;
  let t1 = performance.now();
  debugger;
  let t2 = performance.now();
  return t2 - t1 > HUMAN_CANT_BE_THAT_FAST;
}
