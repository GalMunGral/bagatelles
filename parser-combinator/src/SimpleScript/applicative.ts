import { Parser, noop, pure } from "../Parser";
import { padded, whiteSpace, token, sepBy, TokenParser as T } from "../helpers";
import {
  Expression,
  makeLiteral,
  makeIdentifier,
  makeOperator,
  makeUnaryExpression,
  makeBinaryExpression,
  makeTernaryExpression,
  makeCallExpression,
  ExpressionStatement,
  makeExpressionStatement,
  BlockStatement,
  makeBlockStatement,
  IfStatement,
  makeIfStatement,
  Program,
  makeProgram,
} from "./types";

const terminal: Parser<Expression> = noop<Expression>()
  .or(T.undefined.map(makeLiteral("undefined")))
  .or(T.null.map(makeLiteral("null")))
  .or(T.boolean.map(makeLiteral("boolean")))
  .or(T.number.map(makeLiteral("number")))
  .or(T.string.map(makeLiteral("string")))
  .or(T.identifier.map(makeIdentifier));

const expression21 = noop<Expression>()
  .or(() => T.leftParenthesis.apr(expression).apl(T.rightParenthesis))
  .or(() => terminal);

// NOTE: can't have `f()()()` since it's left-recursion:
// FunctionCall ::= FunctionCall ( Arguments )
const expression20 = noop<Expression>()
  .or(() =>
    pure(makeCallExpression)
      .ap(expression21)
      .apl(T.leftParenthesis)
      .ap(sepBy(T.comma, expression))
      .apl(T.rightParenthesis)
  )
  .or(() => expression21);

const expression18 = expression20;
const expression17 = noop<Expression>()
  .or(() =>
    pure(makeUnaryExpression).ap(T.not.map(makeOperator)).ap(expression18)
  )
  .or(() => expression18);

const expression16: Parser<Expression> = noop<Expression>()
  .or(() =>
    pure(makeBinaryExpression)
      .ap(expression17)
      .ap(T.exponential.map(makeOperator))
      .ap(expression16)
  )
  .or(() => expression17);

const expression15: Parser<Expression> = noop<Expression>()
  .or(() =>
    pure(makeBinaryExpression)
      .ap(expression16)
      .ap(T.multiply.or(T.divide).or(T.modulo).map(makeOperator))
      .ap(expression15)
  )
  .or(() => expression16);

const expression14: Parser<Expression> = noop<Expression>()
  .or(() =>
    pure(makeBinaryExpression)
      .ap(expression15)
      .ap(T.plus.or(T.minus))
      .ap(expression14)
  )
  .or(() => expression15);

const expression13 = expression14;
const expression12: Parser<Expression> = noop<Expression>()
  .or(() =>
    pure(makeBinaryExpression)
      .ap(expression13)
      .ap(T.gt.or(T.ge).or(T.lt).or(T.le).map(makeOperator))
      .ap(expression12)
  )
  .or(() => expression13);

const expression11: Parser<Expression> = noop<Expression>()
  .or(() =>
    pure(makeBinaryExpression)
      .ap(expression12)
      .ap(T.eq.or(T.ne).map(makeOperator))
      .ap(expression11)
  )
  .or(() => expression12);

const expression8 = expression11;
const expression7: Parser<Expression> = noop<Expression>()
  .or(() =>
    pure(makeBinaryExpression)
      .ap(expression8)
      .ap(T.and.map(makeOperator))
      .ap(expression7)
  )
  .or(() => expression8);

const expression6: Parser<Expression> = noop<Expression>()
  .or(() =>
    pure(makeBinaryExpression)
      .ap(expression7)
      .ap(T.or.map(makeOperator))
      .ap(expression6)
  )
  .or(() => expression7);

const expression5 = expression6;
const expression4: Parser<Expression> = noop<Expression>()
  .or(() =>
    pure(makeTernaryExpression)
      .ap(expression5)
      .apl(T.questionMark)
      .ap(expression5)
      .apl(T.colon)
      .ap(expression4)
  )
  .or(() => expression5);

const expression3: Parser<Expression> = noop<Expression>()
  .or(() =>
    pure(makeBinaryExpression)
      .ap(expression4)
      .ap(T.assign.map(makeOperator))
      .ap(expression3)
  )
  .or(() => expression4);

const expression = expression3;

const blockStatement: Parser<BlockStatement> = noop<BlockStatement>().or(() =>
  pure(makeBlockStatement)
    .apl(T.leftBrace)
    .ap(sepBy(whiteSpace, statement))
    .apl(T.rightBrace)
);

const ifStatement: Parser<IfStatement> = noop<IfStatement>().or(() =>
  pure(makeIfStatement)
    .apl(token(/if/))
    .apl(T.leftParenthesis)
    .ap(expression)
    .apl(T.rightParenthesis)
    .ap(blockStatement)
    .ap(
      token(/else/)
        .apr(blockStatement)
        .or(pure(makeBlockStatement([])))
    )
);

const statement = noop<BlockStatement | IfStatement | ExpressionStatement>()
  .or(() => blockStatement)
  .or(() => ifStatement)
  .or(() => pure(makeExpressionStatement).ap(expression).apl(T.semicolon));

const program = noop<Program>().or(() =>
  pure(makeProgram).ap(sepBy(whiteSpace, statement))
);

export default padded(program);
