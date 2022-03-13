import {
  convertCamelToSnakeJSON,
  convertSnakeToCamelJSON,
} from "utils/services/convertJson.js";

const simpleCamelData = { userId: 123, name: "Happy", isLoggedIn: false };
const simpleSnakeData = { user_id: 123, name: "Happy", is_logged_in: false };
const complexCamelData = {
  userInfo: { userId: 123, name: "Happy" },
  sessionInfo: { isLoggedIn: true, token: "123" },
  transactionsList: [
    {
      orderId: 1,
      foodList: [
        { name: "Egg fried rice", quan: 2 },
        { name: "Coca-cola", quan: 1 },
      ],
      rating: 4.9,
      "t!ps": "No",
    },
  ],
};
const complexSnakeData = {
  user_info: { user_id: 123, name: "Happy" },
  session_info: { is_logged_in: true, token: "123" },
  transactions_list: [
    {
      order_id: 1,
      food_list: [
        { name: "Egg fried rice", quan: 2 },
        { name: "Coca-cola", quan: 1 },
      ],
      rating: 4.9,
      "t!ps": "No",
    },
  ],
};

test("Convert simple json from camel to snake", () => {
  expect(convertCamelToSnakeJSON(simpleCamelData)).toEqual(simpleSnakeData);
});

test("Convert complex json from camel to snake ", () => {
  expect(convertCamelToSnakeJSON(complexCamelData)).toEqual(complexSnakeData);
});

test("Convert simple json from snake to camel", () => {
  expect(convertSnakeToCamelJSON(simpleSnakeData)).toEqual(simpleCamelData);
});

test("Convert complex json from snake to camel", () => {
  expect(convertSnakeToCamelJSON(complexSnakeData)).toEqual(complexCamelData);
});
