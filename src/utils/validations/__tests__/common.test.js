import { isValidEmail, isValidPassword, isValidUrl } from "../common";

describe("email", () => {
  it("is valid", () => {
    expect(isValidEmail("happy@mail.edu.vn")).toBe(true);
  });
  it("is not valid", () => {
    expect(isValidEmail("happymail.edu.vn")).toBe(false);
  });
});

describe("password", () => {
  it("is valid", () => {});
  it("is not valid", () => {
    expect(isValidPassword("")).toBe(false);
    expect(isValidPassword("#")).toBe(false);
    expect(isValidPassword("1aS#d")).toBe(false);
    expect(isValidPassword("1234567890")).toBe(false);
    expect(isValidPassword("qwertyuiopasdfghjklzxcvbnm")).toBe(false);
    expect(isValidPassword("QWERTYUIOPASDFGHJKLZXCVBNM")).toBe(false);
    expect(isValidPassword("1234s$53asda")).toBe(false);
    expect(isValidPassword("KSIas$da")).toBe(false);
    expect(isValidPassword("9493BAJD")).toBe(false);
  });
});

describe("url", () => {
  it("is valid", () => {
    expect(
      isValidUrl(
        "https://i.picsum.photos/id/840/200/200.jpg?hmac=-YJWWvNEnqyfLU6PEcCnd42hVvQ9PthuYuG_M3LOZo0"
      )
    ).toBe(true);
  });
  it("is not valid", () => {
    expect(isValidUrl("abc")).toBe(false);
  });
});
