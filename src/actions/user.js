import UserRepository from "repositories/user";

const signInAction = (email, password) => ({
  pendingActionType: "SIGN_IN",
  pendingAction: async () => await UserRepository.signIn(email, password),
});

const signUpAction = (name, email, password) => ({
  pendingActionType: "SIGN_UP",
  pendingAction: async () => await UserRepository.signUp(name, email, password),
});

const signOutAction = () => ({
  pendingActionType: "SIGN_OUT",
  pendingAction: async () => await UserRepository.signOut(),
});

const getUserInfoAction = () => ({
  pendingActionType: "GET_USER_INFO",
  pendingAction: async () => await UserRepository.getUserInfo(),
});

export { signInAction, signUpAction, signOutAction, getUserInfoAction };
