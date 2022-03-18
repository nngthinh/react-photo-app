const validateName = (name) =>
  name.length > 30 || name.length === 0
    ? "Length must be between 1 and 30."
    : null;

const validateEmail = (email) =>
  email.length > 30
    ? "Longer than maximum length 30."
    : !String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ? "Not a valid email address."
    : null;

const validatePassword = (password) =>
  password.length < 6 ? "Shorter than minimum length 6." : null;

export { validateName, validateEmail, validatePassword };
