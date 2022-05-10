import { TokenParser as T, sepBy as sepBy, padded } from "../helpers";
import { noop, Parser, pure } from "../Parser";
import {
  jsonBoolean,
  jsonNull,
  jsonNumber,
  jsonString,
  JSONValue,
  makeKeyValuePair,
  makeObject,
} from "./helpers";

const jsonArray = noop<JSONValue>().or(() =>
  T.leftBracket.apr(sepBy(T.comma, jsonValue)).apl(T.rightBracket)
);

const jsonObject = noop<JSONValue>().or(() =>
  T.leftBrace
    .apr(
      sepBy(
        T.comma,
        pure(makeKeyValuePair).ap(jsonString).apl(T.colon).ap(jsonValue)
      )
    )
    .apl(T.rightBrace)
    .map(makeObject)
);

const jsonValue: Parser<JSONValue> = noop<JSONValue>()
  .or(() => jsonNull)
  .or(() => jsonBoolean)
  .or(() => jsonNumber)
  .or(() => jsonString)
  .or(() => jsonArray)
  .or(() => jsonObject);

export default padded(jsonValue);
