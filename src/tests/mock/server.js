import axios from "axios";

const mockedDatabase = {
  users: { name: 1 },
  categories: {},
  items: {},
};

const setupMockedServer = () => {
  axios.get.mockResolvedValue({ data: { name: "Thinh", id: 1 } });
  axios.post.mockResolvedValue({ data: { accessToken: "123" } });
};

export { setupMockedServer };
