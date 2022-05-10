import { Token } from "../helpers";

export type LiteralType =
  | "undefined"
  | "null"
  | "boolean"
  | "number"
  | "string";

export interface Expression {}

export class Literal implements Expression {
  constructor(public type: LiteralType, public value: string) {}
}

export const makeLiteral = (type: LiteralType) => (token: Token) =>
  new Literal(type, token.value);

export class Identifier implements Expression {
  constructor(public name: string) {}
}

export const makeIdentifier = (token: Token) => new Identifier(token.value);

export class Operator implements Expression {
  constructor(public value: string) {}
}

export const makeOperator = (token: Token) => new Operator(token.value);

export class UnaryExpression implements Expression {
  constructor(public op: Operator, public right: Expression) {}
}

export const makeUnaryExpression =
  (op: Token) =>
  (right: Expression): Expression =>
    new UnaryExpression(op, right);

export class BinaryExpression implements Expression {
  constructor(
    public left: Expression,
    public op: Operator,
    public right: Expression
  ) {}
}

export const makeBinaryExpression =
  (left: Expression) =>
  (op: Operator) =>
  (right: Expression): Expression =>
    new BinaryExpression(left, op, right);

export class TernaryExpression implements Expression {
  constructor(
    public condition: Expression,
    public consequent: Expression,
    public alternative: Expression
  ) {}
}

export const makeTernaryExpression =
  (condition: Expression) =>
  (consequent: Expression) =>
  (alternative: Expression): Expression =>
    new TernaryExpression(condition, consequent, alternative);

export class CallExpression implements Expression {
  constructor(public callee: Expression, public args: Expression[]) {}
}

export const makeCallExpression =
  (callee: Expression) => (args: Expression[]) =>
    new CallExpression(callee, args);

interface Statement {}
export class ExpressionStatement implements Statement {
  constructor(public expression: Expression) {}
}

export const makeExpressionStatement = (expression: Expression) =>
  new ExpressionStatement(expression);

export class BlockStatement implements Statement {
  constructor(public statements: Statement[]) {}
}

export const makeBlockStatement = (statements: Statement[]) =>
  new BlockStatement(statements);

export class IfStatement implements Statement {
  constructor(
    public condition: Expression,
    public consequent: BlockStatement,
    public alternative: BlockStatement
  ) {}
}

export const makeIfStatement =
  (condition: Expression) =>
  (consequent: BlockStatement) =>
  (alternative: BlockStatement) =>
    new IfStatement(condition, consequent, alternative);

export class Program {
  constructor(public body: Statement[]) {}
}

export const makeProgram = (body: Statement[]) => new Program(body);
