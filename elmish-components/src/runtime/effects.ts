import axios, { AxiosRequestConfig } from "axios";

const EffectHandlers = new WeakMap([]);

export function handle<Eff extends object>(
  effect: new (...args: any[]) => Eff,
  handler: (eff: Eff) => void
) {
  EffectHandlers.set(effect, handler);
}

export function commit(effect: unknown) {
  try {
    const proto = Object.getPrototypeOf(effect);
    const handler = EffectHandlers.get(proto.constructor);
    if (typeof handler == "function") {
      handler(effect);
    }
  } catch {}
}

export class Timeout {
  constructor(public callback: () => void, public delay: number = 10) {}
}

export class HTTP<V = any, E = any> {
  constructor(
    public config: AxiosRequestConfig,
    public success?: (v: V) => void,
    public error?: (e: E) => void
  ) {}
}

handle(Function, (f) => f());

handle(Timeout, ({ callback, delay }) => {
  setTimeout(callback, delay);
});

handle(HTTP, ({ config, success, error }) => {
  const request = axios;
  request(config).then(
    (res) => success?.(res.data),
    (reason: string) => error?.(reason)
  );
});
