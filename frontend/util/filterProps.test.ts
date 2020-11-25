import filterProps from "./filterProps";

test('filters out ["one", "three"] from ["one", "two", "three"]', () => {
  const props = { one: 1, two: 2, three: 3 };
  const toRemove = ["one", "three"];
  expect(filterProps({ props, toRemove })).toEqual({ two: 2 });
});

test('empty "toFilter" causes no errors', () => {
  const props = { one: 1, two: 2, three: 3 };
  const toRemove = [];
  expect(filterProps({ props, toRemove })).toEqual(props);
});

test("removing all props return empty object", () => {
  const props = { one: 1, two: 2, three: 3 };
  const toRemove = ["one", "two", "three"];
  expect(filterProps({ props, toRemove })).toEqual({});
});

// This is here because NextJS forces "--isolatedModules" to be in the tsconfig.json
export {};
