const {
  convertTimestampToDate,
  createRefObject,
  checkExists,
  checkDataType,
  checkForDuplicates
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
    const result = createRefObject(array, 'favColour', 'name');
    expect(result).toEqual(expectedOutput);
  })
  test("returns a reference object when passed-in array contains multiple objects", () => {
    const array = [{name: 'liv', favColour: 'green'}, {name: 'alex', favColour: 'red'}];
    const expectedOutput = {'liv': 'green', 'alex': 'red'}
    const result = createRefObject(array, 'name', 'favColour');
    expect(result).toEqual(expectedOutput);
  })
});

// describe("checkExists", () => {
//   test("returns an error message when article doesn't exist", () => {
//     return checkExists('articles', 'article_id', 143, 'Article')
//     .catch((err) => {
//       expect(err).toEqual({ status: 404, msg: `Article not found.`});
//     })
//   })
//   test("returns an error message when user doesn't exist", () => {
//     return checkExists('users', 'username', 'livmotley', 'User')
//     .catch((err) => {
//       expect(err).toEqual({ status: 404, msg: `User not found.`});
//     })
//   })
//   test("returns an error message when topic doesn't exist", () => {
//     return checkExists('topics', 'slug', 'books', 'Topic')
//     .catch((err) => {
//       expect(err).toEqual({ status: 404, msg: `Topic not found.`});
//     })
//   })
//   test("returns an error message when comment doesn't exist", () => {
//     return checkExists('comments', 'comment_id', 143, 'Comment')
//     .catch((err) => {
//       expect(err).toEqual({ status: 404, msg: `Comment not found.`});
//     })
//   })
// })

// describe("checkDataTypes", () => {
//   test("returns an error message when data is not numeric", () => {
//     return checkDataType('four')
//     .catch((err) => {
//       expect(err).toEqual({status: 400, msg: 'Invalid input.'})
//     })
//   })
//   test("returns undefined when data is numeric", () => {
//     return expect(checkDataType('4')).toBeUndefined();
//   })
// })

// describe("checkForDuplicates", () => {
//   test("returns an error message when article already exists", () => {
//     return checkForDuplicates('articles', 'article_id', 4, 'Article')
//     .catch((err) => {
//       expect(err).toEqual({status: 400, msg: 'Article already exists.'})
//     })
//   })
//   test("returns an error message when topic already exists", () => {
//     return checkForDuplicates('topics', 'slug', "paper", 'Topic')
//     .catch((err) => {
//       expect(err).toEqual({status: 400, msg: 'Topic already exists.'})
//     })
//   })
//   test("returns an error message when user already exists", () => {
//     return checkForDuplicates('users', 'username', 'rogersop', 'User')
//     .catch((err) => {
//       expect(err).toEqual({status: 400, msg: 'User already exists.'})
//     })
//   })
//   test("returns an error message when comment already exists", () => {
//     return checkForDuplicates('comments', 'comment_id', 1, 'Comment')
//     .catch((err) => {
//       expect(err).toEqual({status: 400, msg: 'Comment already exists.'})
//     })
//   })
//   test("returns undefined when item doesn't exist yet", () => {
//     return expect(checkForDuplicates('topics', 'slug', 'books', 'Topic')).resolves.toBeUndefined();
//   })
// })