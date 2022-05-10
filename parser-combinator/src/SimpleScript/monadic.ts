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
  .or(() =>
    T.leftParenthesis
      .and(expression)
      .chain((expr) => T.rightParenthesis.and(pure(expr)))
  )
  .or(() => terminal);

// NOTE: can't have `f()()()` since it's left-recursion:
// FunctionCall ::= FunctionCall ( Arguments )
const expression20 = noop<Expression>()
  .or(() =>
    expression21.chain((callee) =>
      T.leftParenthesis.and(
        sepBy(T.comma, expression).chain((args) =>
          T.rightParenthesis.and(pure(makeCallExpression(callee)(args)))
        )
      )
    )
  )
  .or(() => expression21);

const expression18 = expression20;
const expression17 = noop<Expression>()
  .or(() =>
    T.not
      .map(makeOperator)
      .chain((op) =>
        expression18.chain((expr) => pure(makeUnaryExpression(op)(expr)))
      )
  )
  .or(() => expression18);

const expression16: Parser<Expression> = noop<Expression>()
  .or(() =>
    expression17.chain((left) =>
      T.exponential
        .map(makeOperator)
        .chain((op) =>
          expression16.chain((right) =>
            pure(makeBinaryExpression(left)(op)(right))
          )
        )
    )
  )
  .or(() => expression17);

const expression15: Parser<Expression> = noop<Expression>()
  .or(() =>
    expression16.chain((left) =>
      T.multiply
        .or(T.divide)
        .or(T.modulo)
        .map(makeOperator)
        .chain((op) =>
          expression15.chain((right) =>
            pure(makeBinaryExpression(left)(op)(right))
          )
        )
    )
  )
  .or(() => expression16);

const expression14: Parser<Expression> = noop<Expression>()
  .or(() =>
    expression15.chain((left) =>
      T.plus
        .or(T.minus)
        .chain((op) =>
          expression14.chain((right) =>
            pure(makeBinaryExpression(left)(op)(right))
          )
        )
    )
  )
  .or(() => expression15);

const expression13 = expression14;
const expression12: Parser<Expression> = noop<Expression>()
  .or(() =>
    expression13.chain((left) =>
      T.gt
        .or(T.ge)
        .or(T.lt)
        .or(T.le)
        .map(makeOperator)
        .chain((op) =>
          expression12.chain((right) =>
            pure(makeBinaryExpression(left)(op)(right))
          )
        )
    )
  )
  .or(() => expression13);

const expression11: Parser<Expression> = noop<Expression>()
  .or(() =>
    expression12.chain((left) =>
      T.eq
        .or(T.ne)
        .map(makeOperator)
        .chain((op) =>
          expression11.chain((right) =>
            pure(makeBinaryExpression(left)(op)(right))
          )
        )
    )
  )
  .or(() => expression12);

const expression8 = expression11;
const expression7: Parser<Expression> = noop<Expression>()
  .or(() =>
    expression8.chain((left) =>
      T.and
        .map(makeOperator)
        .chain((op) =>
          expression7.chain((right) =>
            pure(makeBinaryExpression(left)(op)(right))
          )
        )
    )
  )
  .or(() => expression8);

const expression6: Parser<Expression> = noop<Expression>()
  .or(() =>
    expression7.chain((left) =>
      T.or
        .map(makeOperator)
        .chain((op) =>
          expression6.chain((right) =>
            pure(makeBinaryExpression(left)(op)(right))
          )
        )
    )
  )
  .or(() => expression7);

const expression5 = expression6;
const expression4: Parser<Expression> = noop<Expression>()
  .or(() =>
    expression5.chain((condition) =>
      T.questionMark
        .and(expression5)
        .chain((consequent) =>
          T.colon.and(
            expression4.chain((alternative) =>
              pure(makeTernaryExpression(condition)(consequent)(alternative))
            )
          )
        )
    )
  )
  .or(() => expression5);

const expression3: Parser<Expression> = noop<Expression>()
  .or(() =>
    expression4.chain((left) =>
      T.assign
        .map(makeOperator)
        .chain((op) =>
          expression3.chain((right) =>
            pure(makeBinaryExpression(left)(op)(right))
          )
        )
    )
  )
  .or(() => expression4);

const expression = expression3;

const blockStatement: Parser<BlockStatement> = noop<BlockStatement>().or(() =>
  T.leftBrace
    .and(sepBy(whiteSpace, statement))
    .chain((statements) =>
      T.rightBrace.and(pure(makeBlockStatement(statements)))
    )
);

// If there were do-notation (<-) for our chain/bind (>>=), it would probably look like:
// const ifStatement = do {
//   token(/if/);
//   T.leftParenthesis;
//   condition <- expression;
//   T.rightParenthesis;
//   consequent <- blockStatement;
//   token(/else/);
//   alternative <- blockStatement;
//   return pure(makeIfStatement(condition)(consequent)(alternative));
// }

const ifStatement: Parser<IfStatement> = noop<IfStatement>().or(() =>
  token(/if/)
    .and(T.leftParenthesis)
    .and(expression)
    .chain((condition) =>
      T.rightParenthesis.and(blockStatement).chain((consequent) =>
        token(/else/)
          .and(blockStatement)
          .chain((alternative) =>
            pure(makeIfStatement(condition)(consequent)(alternative))
          )
          .or(
            pure(makeIfStatement(condition)(consequent)(makeBlockStatement([])))
          )
      )
    )
);

const statement = noop<BlockStatement | IfStatement | ExpressionStatement>()
  .or(() => blockStatement)
  .or(() => ifStatement)
  .or(() =>
    expression.chain((expr) =>
      T.semicolon.and(pure(makeExpressionStatement(expr)))
    )
  );

const program = noop<Program>().or(() =>
  sepBy(whiteSpace, statement).chain((body) => pure(makeProgram(body)))
);

export default padded(program);
