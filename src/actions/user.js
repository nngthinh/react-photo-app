import UserRepository from "repositories/user";

const signInAction = (email, password) => ({
  pendingActionType: "SIGN_IN",
  pendingAction: () => UserRepository.signIn(email, password),
});

const signUpAction = (name, email, password) => ({
  pendingActionType: "SIGN_UP",
  pendingAction: () => UserRepository.signUp(name, email, password),
});

const getUserInfoAction = () => ({
  pendingActionType: "GET_USER_INFO",
  pendingAction: () => UserRepository.getUserInfo(),
});

export { signInAction, signUpAction, getUserInfoAction };
