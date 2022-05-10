import { TokenParser as T } from "../helpers";

export type JSONValue =
  | null
  | boolean
  | number
  | string
  | JSONValue[]
  | { [key: string]: JSONValue };

export const jsonNull = T.null.map(() => null);
export const jsonBoolean = T.boolean.map((token) => Boolean(eval(token.value)));
export const jsonNumber = T.number.map(Number);
export const jsonString = T.string.map((token) => token.value.slice(1, -1));

export const makeKeyValuePair = (key: string) => (value: JSONValue) =>
  [key, value] as [string, JSONValue];

export const makeObject = (entries: [string, JSONValue][]) => {
  const obj: { [key: string]: JSONValue } = {};
  entries.forEach(([key, value]) => {
    obj[key] = value;
  });
  return obj;
};
