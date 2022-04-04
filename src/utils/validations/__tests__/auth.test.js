import { validateName, validateEmail, validatePassword } from "../auth";

describe("name", () => {
  it("is valid", () => {
    expect(validateName("H")).toBe(null);
    expect(validateName("Happy")).toBe(null);
    expect(validateName("HappyHappyHappyHappyHappyHappy")).toBe(null);
  });
  it("is not valid", () => {
    expect(validateName("")).toBe("Length must be between 1 and 30.");
    expect(
      validateName(
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iure ad doloribus sequi iste non aperiam ipsa modi cupiditate, ex placeat dolorum labore natus adipisci autem necessitatibus asperiores magni repudiandae ullam."
      )
    ).toBe("Length must be between 1 and 30.");
    expect(validateName("")).toBe("Length must be between 1 and 30.");
  });
});

describe("email", () => {
  it("is valid", () => {
    expect(validateEmail("happy@mail.edu.vn")).toBe(null);
    expect(validateEmail("12345678901234567890@gmail.com")).toBe(null);
  });
  it("is not valid", () => {
    expect(validateEmail("123456789012345678901@gmail.com")).toBe(
      "Longer than maximum length 30."
    );
    expect(
      validateEmail(
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iure ad doloribus sequi iste non aperiam ipsa modi cupiditate, ex placeat dolorum labore natus adipisci autem necessitatibus asperiores magni repudiandae ullam."
      )
    ).toBe("Longer than maximum length 30.");
    expect(validateEmail("")).toBe("Not a valid email address.");
    expect(validateEmail("random string")).toBe("Not a valid email address.");
  });
});

describe("password", () => {
  it("is valid", () => {
    expect(validatePassword("123aC#")).toBe(null);
    expect(validatePassword("123aC#1aB^")).toBe(null);
  });
  it("is not valid", () => {
    expect(validatePassword("")).toBe("Shorter than minimum length 6.");
    expect(validatePassword("#")).toBe("Shorter than minimum length 6.");
    expect(validatePassword("1aS#d")).toBe("Shorter than minimum length 6.");
    expect(validatePassword("1234567890")).toBe(
      "Contains at least one uppercase, one lowercase, and one number."
    );
    expect(validatePassword("qwertyuiopasdfghjklzxcvbnm")).toBe(
      "Contains at least one uppercase, one lowercase, and one number."
    );
    expect(validatePassword("QWERTYUIOPASDFGHJKLZXCVBNM")).toBe(
      "Contains at least one uppercase, one lowercase, and one number."
    );
    expect(validatePassword("1234s$53asda")).toBe(
      "Contains at least one uppercase, one lowercase, and one number."
    );
    expect(validatePassword("KSIas$da")).toBe(
      "Contains at least one uppercase, one lowercase, and one number."
    );
    expect(validatePassword("9493BAJD")).toBe(
      "Contains at least one uppercase, one lowercase, and one number."
    );
  });
});
