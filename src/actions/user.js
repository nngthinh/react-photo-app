const signIn = (email, password) => ({
  type: UserAction.LOGIN,
  promise: postWithoutTokenChecking("/admin-tokens", {
    email,
    password,
  }),
});

export { signIn };
