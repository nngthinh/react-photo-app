export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8081"
    : "https://somewebsite.com";
