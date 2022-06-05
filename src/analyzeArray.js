const validateArray = (array) => {
  if (Array.isArray(array)) {
    for (const item of array) {
      if (typeof item !== 'number') {
        return false;
      }
    }
    return true;
  }
  return false;
};

const analyzeArray = (array) => {
  if (array.length === 0) return null;
  if (!validateArray(array)) return 'invalid array';
  const min = array.reduce((a, b) => (b < a ? b : a));
  const max = array.reduce((a, b) => (b > a ? b : a));
  const { length } = array;
  const average = array.reduce((a, b) => a + b) / length;

  return {
    min,
    max,
    length,
    average,
  };
};

export default analyzeArray;
