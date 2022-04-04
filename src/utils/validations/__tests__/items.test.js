import { validateDescription, validateImageUrl } from "../items";

describe("description", () => {
  it("is valid", () => {
    expect(validateDescription("1")).toBe(null);
    expect(validateDescription("1234567890")).toBe(null);
    expect(
      validateDescription(
        "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
      )
    ).toBe(null);
  });
  it("is not valid", () => {
    expect(validateDescription("")).toBe("Length must be between 1 and 200.");
    expect(
      validateDescription(
        "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901"
      )
    ).toBe("Length must be between 1 and 200.");
  });
});

describe("image url", () => {
  it("is valid", () => {
    expect(
      validateImageUrl(
        "https://i.picsum.photos/id/840/200/200.jpg?hmac=-YJWWvNEnqyfLU6PEcCnd42hVvQ9PthuYuG_M3LOZo0"
      )
    ).toBe(null);
  });
  it("is not valid", () => {
    expect(validateImageUrl("")).toBe("Missing data for required field.");
    expect(
      validateImageUrl(
        "https://i.picsum.photos/id/840/200/200.jpg?hmac=-YJWWvNEnqyfLU6PEcCnd42hVvQ9PthuYuG_M3LOZYJWWvNEnqyfLU6PEcCnd42hVvQ9PthuYuG_M3LOZYJWWvNEnqyfLU6PEcCnd42hVvQ9PthuYuG_M3LOZYJWWvNEnqyfLU6PEcCnd42hVvQ9PthuYuG_M3LOZYJWWvNEnqyfLU6PEcCnd42hVvQ9PthuYuG_M3LOZo0"
      )
    ).toBe("Longer than maximum length 200.");
    expect(validateImageUrl("abc")).toBe("Not a valid URL.");
  });
});
