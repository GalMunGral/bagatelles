import { noop, Parser, pure } from "../Parser";
import { padded, sepBy, TokenParser as T, whiteSpace } from "../helpers";
import { Attribute, Element, makeAttribute, makeElement } from "./types";

const identifier = T.identifier.map((token) => token.value);
const value = T.string.map((token) => token.value.slice(1, -1));

const attribute: Parser<Attribute> = noop<Attribute>().or(() =>
  pure(makeAttribute)
    .ap(identifier)
    .ap(T.assign.apr(value).or(pure("")))
);

const element: Parser<Element> = noop<Element>()
  .or(() =>
    pure(makeElement)
      .apl(T.lt)
      .ap(identifier)
      .apl(whiteSpace)
      .ap(sepBy(whiteSpace, attribute))
      .apl(T.gt)
      .ap(sepBy(whiteSpace, element))
      .apl(T.lt)
      .apl(T.divide)
      .apl(T.identifier) // TODO: parse should fail if tags don't match
      .apl(T.gt)
  )
  .or(() =>
    pure(makeElement)
      .apl(T.lt)
      .ap(identifier)
      .apl(whiteSpace)
      .ap(sepBy(whiteSpace, attribute))
      .apl(T.divide)
      .apl(T.gt)
      .ap(pure([]))
  );

export default padded(element);
