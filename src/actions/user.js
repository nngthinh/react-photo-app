import UserRepository from "repositories/user";

const signInAction = (email, password) => ({
  pendingAction: "SIGN_IN",
  promise: () => UserRepository.signIn(email, password),
});

const signUpAction = (name, email, password) => ({
  pendingAction: "SIGN_UP",
  promise: () => UserRepository.signUp(name, email, password),
});

const getUserInfoAction = () => ({
  pendingAction: "USER_INFO",
  promise: () => UserRepository.getUserInfo();
});

export { signInAction, signUpAction };
