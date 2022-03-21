import { isValidPassword, isValidEmail } from "./common";

const validateName = (name) =>
  name.length > 30 || name.length === 0
    ? "Length must be between 1 and 30."
    : null;

const validateEmail = (email) =>
  email.length > 30
    ? "Longer than maximum length 30."
    : !isValidEmail(email)
    ? "Not a valid email address."
    : null;

const validatePassword = (password) =>
  password.length < 6
    ? "Shorter than minimum length 6."
    : !isValidPassword(password)
    ? "Contains at least one uppercase, one lowercase, and one number."
    : null;

export { validateName, validateEmail, validatePassword };
