// Camel case/snake case switching util

const convertCamelToSnakeString = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const convertSnakeToCamelString = (str) =>
  str
    .toLowerCase()
    .replace(
      /([_][a-z])/g,
      (group) => `${group.toUpperCase().replace("_", "")}`
    );

const convertAllKeysInObject = (obj, convertFunc) => {
  // Object e.g array, json
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      // If array
      return obj.map((ele) => convertAllKeysInObject(ele, convertFunc));
    } else {
      // If json
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof key === "string") {
          newObj[convertFunc(key)] = convertAllKeysInObject(value, convertFunc);
        } else {
          newObj[key] = convertAllKeysInObject(value, convertFunc);
        }
      }
      return newObj;
    }
  }
  // Primitive value e.g array's element, object's value
  return obj;
};

const convertCamelToSnakeJSON = (obj) =>
  convertAllKeysInObject(obj, convertCamelToSnakeString);
const convertSnakeToCamelJSON = (obj) =>
  convertAllKeysInObject(obj, convertSnakeToCamelString);
export { convertCamelToSnakeJSON, convertSnakeToCamelJSON };
