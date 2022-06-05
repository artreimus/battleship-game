import analyzeArray from './analyzeArray';

test('Return the min, max, length, and average of the array : test one', () => {
  const array = [1, 2, 3, 4, 5];
  const expected = {
    min: 1, max: 5, average: 3, length: 5,
  };
  expect(analyzeArray(array)).toEqual(expected);
});

test('Return the min, max, length, and average of the array : test two', () => {
  const array = [11, 12, 13, 14, 15, 20];
  expect(analyzeArray(array)).toEqual({
    min: 11,
    max: 20,
    length: 6,
    average: expect.closeTo(14.167, 3),
  });
});

test('Return the min, max, length, and average of the array : test two', () => {
  const array = [1, 10, 100, 1000, 10000, 100000];
  expect(analyzeArray(array)).toEqual({
    min: 1,
    max: 100000,
    length: 6,
    average: expect.closeTo(18518.5, 3),
  });
});

test('Return null if array is empty', () => {
  const array = [];
  expect(analyzeArray(array)).toBeNull();
});

test('Array contains non-number item : test one', () => {
  const array = [1, 2, 'a'];
  expect(analyzeArray(array)).toBe('invalid array');
});

test('Array contains non-number item : test two', () => {
  const array = [1, '2'];
  expect(analyzeArray(array)).toBe('invalid array');
});

test('Array contains non-number item : test three', () => {
  const array = 123;
  expect(analyzeArray(array)).toBe('invalid array');
});

test('Array contains non-number item : test four', () => {
  const array = { a: 123, b: 'abc', c: `${123}ab` };
  expect(analyzeArray(array)).toBe('invalid array');
});
