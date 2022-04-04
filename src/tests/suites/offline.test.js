import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "tests/utils/rtl";
import axios from "axios";
// import RestService from "utils/services/rest";
import CustomError from "constants/error";
import App from "App";

jest.mock("axios");

describe("offline page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  it("should show when having network error", async () => {
    axios.get.mockImplementationOnce(async (url, config) => {
      throw new Error(CustomError.NETWORK_ERROR);
    });
    render(<App />);
    await waitFor(() => expect(axios.get.mock.calls.length).toBe(1));
    // * Other dangling request would not be count (?)
    await screen.findByTestId("offline-page");
  });

  it("should reload page after clicking reconnect button", async () => {
    // Server is offline
    axios.get.mockImplementationOnce(async (url, config) => {
      throw new Error(CustomError.NETWORK_ERROR);
    });
    render(<App />);
    await waitFor(() => expect(axios.get.mock.calls.length).toBe(1));
    // Server is online
    axios.get.mockImplementationOnce(async (url, config) => {
      console.log(config);
      return Promise.resolve({});
    });
    userEvent.click(await screen.findByTestId("reconnectButton"));
    await screen.findByText(/topics/i);
    await screen.findByTestId("offline-page");
    // await screen.findByText(/topics/i);
    // await waitFor(() => expect(axios.get.mock.calls.length).toBe(2));
  });
});
