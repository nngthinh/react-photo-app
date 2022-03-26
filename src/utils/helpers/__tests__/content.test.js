import { shortenContent } from "../content";

const longContent =
  "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis ad odit reiciendis possimus eaque, debitis sunt natus saepe pariatur non itaque odio expedita animi dolorem nisi repellendus ipsa provident id.";
const shortenedLongContent = "Lorem ipsu...";
const shortContent = "Lorem";
const limit = 10;

describe("content", () => {
  it("is shortened", () => {
    expect(shortenContent(longContent, limit)).toBe(shortenedLongContent);
  });
  it("is not shortened", () => {
    expect(shortenContent(shortContent, limit)).toBe(shortContent);
  });
});
