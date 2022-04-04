import { loadState, saveState } from "../localStorage.js";

const mockedState = { name: "Happy", id: 1 };
const mockedSerializedState = JSON.stringify(mockedState);

beforeEach(() => {
  global.localStorage.clear();
});

describe("get", () => {
  test("get null data", () => {
    const getStateResult = loadState();
    expect(getStateResult).toEqual(undefined);
  });
  test("get none null data", () => {
    global.localStorage.setItem("state", mockedSerializedState);
    const getStateResult = loadState();
    expect(getStateResult).toEqual(mockedState);
  });
});

describe("set", () => {
  test("set data", () => {
    const getStateResult = loadState();
    expect(getStateResult).toEqual(undefined);
    const setStateResult = saveState(mockedState);
    expect(setStateResult).toBe(true);
    expect(global.localStorage.getItem("state")).toEqual(mockedSerializedState);
  });
});
