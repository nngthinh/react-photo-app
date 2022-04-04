import { isValidUrl } from "utils/validations/common";

const validateName = (name) =>
  name.length > 30 || name.length === 0
    ? "Length must be between 1 and 30."
    : null;

const validateDescription = (description) =>
  description.length > 200 || description.length === 0
    ? "Length must be between 1 and 200."
    : null;

const validateImageUrl = (url) =>
  url.length > 200
    ? "Longer than maximum length 200."
    : url.length === 0
    ? "Missing data for required field."
    : !isValidUrl(url)
    ? "Not a valid URL."
    : null;

export { validateName, validateDescription, validateImageUrl };
