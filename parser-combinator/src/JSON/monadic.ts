import { TokenParser as T, sepBy, padded } from "../helpers";
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
  T.leftBracket.and(
    sepBy(T.comma, jsonValue).chain((elements) =>
      T.rightBracket.and(pure(elements))
    )
  )
);

const jsonObject = noop<JSONValue>().or(() =>
  T.leftBrace
    .and(
      sepBy(
        T.comma,
        jsonString.chain((key) =>
          T.colon.and(
            jsonValue.chain((value) => pure(makeKeyValuePair(key)(value)))
          )
        )
      )
    )
    .chain((entries) => T.rightBrace.and(pure(makeObject(entries))))
);

const jsonValue: Parser<JSONValue> = noop<JSONValue>()
  .or(() => jsonNull)
  .or(() => jsonBoolean)
  .or(() => jsonNumber)
  .or(() => jsonString)
  .or(() => jsonArray)
  .or(() => jsonObject);

export default padded(jsonValue);
