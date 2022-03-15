export declare function nodebug<A extends any[], B>(gen: (...args: A) => Generator<any, B, any>): (...args: A) => Promise<B>;
