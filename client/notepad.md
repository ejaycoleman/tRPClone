```
type One = { type: 'one'; value: () => string | string[] };
type Two = { type: 'two'; value: () => string | string[] };

type OneRes = () => string | string[];
type TwoRes = () => string | string[];

type Conditional<T> = {
[PropertyKey in keyof T]: T[PropertyKey] extends One
? OneRes
: T[PropertyKey] extends Two
? TwoRes
: unknown;
};

const one: One = { type: 'one', value: () => "one" };
const two: Two = { type: 'two', value: () => "two" };

const Test = {
one,
two,
};

type TestConditional = Conditional<typeof Test>;

const result: TestConditional = {
one: () => "one result",
two: () => "two result",
};
```
