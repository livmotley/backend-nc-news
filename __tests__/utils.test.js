const {
  convertTimestampToDate,
  createRefObject
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createRefObject", () => {
  test("returns an object", () => {
    const result = createRefObject([], "", "");
    expect(typeof result).toBe('object');
  })
  test("returns a reference object when passed-in array contains single object", () => {
    const array = [{name: 'liv', favColour: 'green'}];
    const expectedOutput = {'green': 'liv'}
    // act
    const result = createRefObject(array, 'favColour', 'name');
    // assert
    expect(result).toEqual(expectedOutput);
  })
  test("returns a reference object when passed-in array contains multiple objects", () => {
    const array = [{name: 'liv', favColour: 'green'}, {name: 'alex', favColour: 'red'}];
    const expectedOutput = {'liv': 'green', 'alex': 'red'}
    // act
    const result = createRefObject(array, 'name', 'favColour');
    // assert
    expect(result).toEqual(expectedOutput);
  })
});