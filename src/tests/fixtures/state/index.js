import { usersData } from "tests/fixtures/database";

// For guest
const initialState = {
  user: {
    isLoggedIn: false,
    token: null,
    info: null,
  },
  categories: { pagination: {}, list: null, detail: {} },
  items: { pagination: {}, list: null, detail: {} },
};

const expiredToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImludmFsaWR1c2VyQG1haWwuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.oqIYBDyms5uctnj7NAuP8jf_DFZJqaaYg0W4e2rvfi4";

const invalidState = {
  ...initialState,
  user: {
    isLoggedIn: true,
    token: expiredToken,
    info: {
      name: "expired user",
      id: 99,
    },
  },
};

const createState = (userId = 0) =>
  userId === 0 // Guest
    ? initialState
    : userId === -1 // Expired user
    ? invalidState
    : {
        // Valid user
        ...initialState,
        user: {
          isLoggedIn: true,
          token: usersData.info[userId].token,
          info: {
            name: usersData.info[userId].name,
            id: usersData.info[userId].id,
          },
        },
      };
export { createState as createMockedState };
