const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const isValidPassword = (password) =>
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password);

const isValidEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    ? true
    : false;

export { isValidEmail, isValidPassword, isValidUrl };
