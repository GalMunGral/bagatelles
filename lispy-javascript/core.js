class Cons {
    constructor(a, d) {
        this.a = a;
        this.d = d;
    }
}

export function _(first, ...rest) {
    if (first === undefined) return null;
    return new Cons(first, _(...rest));
}

const QUOTE = Symbol('QUOTE');
export { QUOTE as q };

export function EVAL(head) {
    if (!head) return;
    if (globalThis[head]) {
        return globalThis[head];
    }
    if (!(head instanceof Cons)) return head;
    if (head.a === QUOTE) return head.d;

    // Function application
    function apply(f, cur) {
        if (!cur) return f();
        const arg = EVAL(cur.a);
        const g = (...args) => f(arg, ...args);
        return apply(g, cur.d);
    }
    // Macro expansion
    function expand(m, cur) {
        if (!cur) return m();
        const arg = cur.a;
        const n = (...args) => m(arg, ...args);
        return expand(n, cur.d);
    }
    
    let a = EVAL(head.a);
    if (globalThis[a]) a = globalThis[a];
    if (!(a instanceof Function)) return a;
    if (a.isMacro) {
        EVAL(expand(a, head.d))
    } else {
        return apply(a, head.d);    
    }
};

export function PRINT(head) {
    function _toString(head) {
        if (!(head instanceof Cons)) {
            if (head instanceof Function) return head.name;
            return JSON.stringify(head);
        }
        const left = (head.a instanceof Cons ? '(' : '') + _toString(head.a);
        const right = head.d ? ', ' + _toString(head.d) : ')';
        return left + right;
    }
    return '(' + _toString(head);
}

export function SET(name, v) {
    globalThis[name] = v;
};

export function DEFUN(fname, lambda) {
    // lambda returns a s-expression
    globalThis[fname] = (...args) => {
        return EVAL(lambda(...args));
    }
}

export function LAMBDA(lambda) {
    return (...args) => {
        return EVAL(lambda(...args))
    }
}

export function CALL(obj, key, ...args) {
    let method = obj[key].bind(obj);
    return method(args);
}

export function ASSIGN(obj, key, val) {
    obj[key] = val;
}

export function COND(...branches) {
    for (let branch of branches) {
        const predicate = branch.a;
        const expr = branch.d.a;
        if (EVAL(predicate)) return expr;
    }
    return _();
}
COND.isMacro = true;

export function PROGN(...exprs) {
    let lastValue;
    for (let expr of exprs) {
        lastValue = EVAL(expr);
    }
    return lastValue;
}

export function LET(vars, lambda) {
    for (let key in vars) {
        vars[key] = EVAL(vars[key]);
    }
    return lambda(vars);
}
LET.isMacro = true;

export async function ASYNC(...lambdas) {
    // PIPE takes a sequence of lambdas, each of which returns an S-expression, which, when EVAL-ed, returns a promise
    let lastValue;
    for (let lambda of lambdas) {
        lastValue = await EVAL(lambda(lastValue));
    }
    return lastValue;
}


export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;
export const mul = (a, b) => a * b;
export const div = (a, b) => a / b;
export const exp = (a, b) => a ** b;
export const eq = (a, b) => a === b
export const gt = (a, b) => a > b;
export const lt = (a, b) => a < b;
export const gte = (a, b) => a >= b;
export const lte = (a, b) => a <= b;
