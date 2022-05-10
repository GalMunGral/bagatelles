import { ParseError, Parser, ParseResult, pure } from "./Parser";

export class Token {
  constructor(public value: string) {}
}

export function token(regex: RegExp, type?: string): Parser<Token> {
  return new Parser((s) => {
    const match = s.match(regex);
    // we need match.index === 0
    if (!match || match.index)
      return new ParseError(`expected: ${type ?? regex}`, s);
    const tok = new Token(match[0]);
    return new ParseResult(tok, s.slice(match[0].length));
  });
}

export function sepBy<S, T>(
  separator: Parser<S>,
  element: Parser<T>
): Parser<T[]> {
  const cons = (head: T) => (tail: T[]) => [head, ...tail];
  return (
    pure(cons)
      .ap(element)
      .ap(separator.apr(element).many())
      // Just return empty if can't parse any
      .or(pure([]))
  );
}

export const whiteSpace = token(/\s*/, "<space>");
export const padded = <T>(parser: Parser<T>) =>
  whiteSpace.apr(parser).apl(whiteSpace);

export const TokenParser = {
  comma: padded(token(/,/, ",")),
  not: padded(token(/!/, "<not>")),
  and: padded(token(/&&(?!&)/, "<and>")),
  or: padded(token(/\|\|(?!\|)/, "<or>")),
  lt: padded(token(/<(?!=)/, "<lt>")),
  le: padded(token(/<=/, "<le>")),
  gt: padded(token(/>(?!=)/, "<gt>")),
  ge: padded(token(/>/, "<ge>")),
  eq: padded(token(/={2,3}(?!=)/, "<eq>")),
  ne: padded(token(/!={1,2}(?!=)/, "<ne>")),
  plus: padded(token(/\+/, "+")),
  minus: padded(token(/-/, "-")),
  multiply: padded(token(/\*(?!\*)/, "*")),
  divide: padded(token(/\//, "/")),
  modulo: padded(token(/%/, "%")),
  exponential: padded(token(/\*\*(?!\*)/, "**")),
  colon: padded(token(/:/, ":")),
  questionMark: padded(token(/\?/, "?")),
  semicolon: padded(token(/;/, ";")),
  assign: padded(token(/=/, "=")),
  leftParenthesis: padded(token(/\(/, "(")),
  rightParenthesis: padded(token(/\)/, ")")),
  leftBracket: padded(token(/\[/, "[")),
  rightBracket: padded(token(/\]/, "]")),
  leftBrace: padded(token(/{/, "{")),
  rightBrace: padded(token(/}/, "}")),
  identifier: token(/[a-zA-Z]\w*/, "<identifier>"),
  undefined: token(/undefined/, "undefined"),
  null: token(/null/, "null"),
  boolean: token(/true|false/, "<boolean>"),
  number: token(/\d+(\.\d+)?/, "<number>"),
  string: token(/"(\\"|[^"])*"/, "<string>"), // TODO: verify that the regex is correct
};
