const usersData = {
  // For storing info
  info: {
    1: {
      id: 1,
      name: "Admin",
      email: "admin@mail.com",
      password: "123abC#",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.tNjS4VI6W4U0lVsKsOUjcd7KHasXKNQeADEgExtW8gE",
    },
    2: {
      id: 2,
      name: "Other Admin",
      email: "otherAdmin@mail.com",
      password: "987cbA&",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90aGVyQWRtaW5AbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.E7sTxzyNPW_ZtxaxGUufbsc7cNsVe0J4NIFUnAAvnhE",
    },
  },
  // For lookup
  id: {
    "admin@mail.com": 1,
    "otherAdmin@mail.com": 2,
  },
  token: {
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQG1haWwuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.tNjS4VI6W4U0lVsKsOUjcd7KHasXKNQeADEgExtW8gE": 1,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im90aGVyQWRtaW5AbWFpbC5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.E7sTxzyNPW_ZtxaxGUufbsc7cNsVe0J4NIFUnAAvnhE": 2,
  },
};
export default usersData;
