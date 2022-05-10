type Apply<A, B> = A extends (b: B) => infer C ? C : never;

export class ParseResult<T> {
  constructor(public result: T, public rest: string) {
    // console.debug("[result]", result, JSON.stringify(rest));
  }
}

export class ParseError {
  constructor(public error: string, public rest: string) {
    // console.debug("[error]", error, JSON.stringify(rest));
  }
}

type ParserFn<T> = (s: string) => ParseResult<T> | ParseError;

export class Parser<A> {
  public parse: ParserFn<A>;
  private cache = new Map<string, ParseResult<A> | ParseError>();

  constructor(parse: ParserFn<A>) {
    // Suppose there are N production rules
    // and each rule has at most M alternative definitions
    // backtracking would result in O(M**N) time, so caching is necessary
    this.parse = (s: string) => {
      if (!this.cache.has(s)) {
        this.cache.set(s, parse(s));
      }
      return this.cache.get(s)!;
    };
  }

  // Functor: fmap
  map<B>(transform: (a: A) => B) {
    return new Parser((s) => {
      const res = this.parse(s);
      return res instanceof ParseError
        ? res
        : new ParseResult(transform(res.result), res.rest);
    });
  }

  // Applicative: "<*>"
  ap<B>(nextParser: Parser<B>) {
    return new Parser((s) => {
      const aRes = this.parse(s);
      if (aRes instanceof ParseError) return aRes;
      if (typeof aRes.result !== "function") {
        return new ParseError("Cannot compose parsers", aRes.rest);
      }
      const bRes = nextParser.parse(aRes.rest);
      if (bRes instanceof ParseError) return bRes;
      return new ParseResult<Apply<A, B>>(aRes.result(bRes.result), bRes.rest);
    });
  }

  // Applicative: "*>"
  apr<B>(nextParser: Parser<B>): Parser<B> {
    return new Parser((s) => {
      const aRes = this.parse(s);
      if (aRes instanceof ParseError) return aRes;
      const bRes = nextParser.parse(aRes.rest);
      if (bRes instanceof ParseError) return bRes;
      return new ParseResult(bRes.result, bRes.rest);
    });
  }

  // Applicative "<*"
  apl<B>(nextParser: Parser<B>): Parser<A> {
    return new Parser((s) => {
      const aRes = this.parse(s);
      if (aRes instanceof ParseError) return aRes;
      const bRes = nextParser.parse(aRes.rest);
      if (bRes instanceof ParseError) return bRes;
      return new ParseResult(aRes.result, bRes.rest);
    });
  }

  // Alternative "<|>"
  or<B>(otherParser: Parser<B> | (() => Parser<B>)): Parser<A | B> {
    return new Parser<A | B>((s) => {
      const res = this.parse(s);
      if (res instanceof ParseResult) return res;
      if (typeof otherParser == "function") {
        otherParser = otherParser();
      }
      return otherParser.parse(s);
    });
  }

  // Alternative: some
  some(): Parser<A[]> {
    return new Parser((s) => {
      const parsed: A[] = [];
      let res: ParseResult<A> | ParseError;
      while ((res = this.parse(s)) instanceof ParseResult) {
        parsed.push(res.result);
        s = res.rest;
      }
      if (!parsed.length) return res;
      return new ParseResult(parsed, s);
    });
  }

  // Alternative: many
  many(): Parser<A[]> {
    return new Parser((s) => {
      const parsed: A[] = [];
      let res: ParseResult<A> | ParseError;
      while ((res = this.parse(s)) instanceof ParseResult) {
        parsed.push(res.result);
        s = res.rest;
      }
      return new ParseResult(parsed, s);
    });
  }

  // Monad: ">>="
  chain<B>(parserFactory: (a: A) => Parser<B>) {
    return new Parser((s) => {
      const res = this.parse(s);
      if (res instanceof ParseError) return res;
      const nextParser = parserFactory(res.result);
      return nextParser.parse(res.rest);
    });
  }

  // Monad: ">>"
  and<B>(b: Parser<B>) {
    return this.apr(b);
  }
}

export const pure = <T>(a: T) => new Parser<T>((s) => new ParseResult(a, s));
export const noop = <T>() => new Parser<T>((s) => new ParseError("no-op", s));
