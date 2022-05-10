import { noop, Parser, pure } from "../Parser";
import { padded, sepBy, TokenParser as T, whiteSpace } from "../helpers";
import { Attribute, Element, makeAttribute, makeElement } from "./types";

const identifier = T.identifier.map((token) => token.value);
const value = T.string.map((token) => token.value.slice(1, -1));

const attribute: Parser<Attribute> = noop<Attribute>().or(() =>
  identifier.chain((key) =>
    T.assign
      .and(value)
      .or(pure(""))
      .chain((value) => pure(makeAttribute(key)(value)))
  )
);

const element: Parser<Element> = noop<Element>()
  .or(() =>
    T.lt.and(identifier).chain((tag) =>
      whiteSpace.and(sepBy(whiteSpace, attribute)).chain((attributes) =>
        T.gt.and(sepBy(whiteSpace, element)).chain((children) =>
          T.lt
            .and(T.divide)
            .and(T.identifier)
            .and(T.gt)
            .and(pure(makeElement(tag)(attributes)(children)))
        )
      )
    )
  )
  .or(() =>
    T.lt
      .and(identifier)
      .chain((tag) =>
        whiteSpace.and(
          sepBy(whiteSpace, attribute).chain((attributes) =>
            T.divide.and(T.gt).and(pure(makeElement(tag)(attributes)([])))
          )
        )
      )
  );

export default padded(element);
