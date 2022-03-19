import { KUserActions } from "constants/actions";
import UserRepository from "repositories/user";

const signInAction = (email, password) => ({
  pendingActionType: KUserActions.PENDING_SIGN_IN,
  pendingAction: async () => await UserRepository.signIn(email, password),
});

const signUpAction = (name, email, password) => ({
  pendingActionType: KUserActions.PENDING_SIGN_UP,
  pendingAction: async () => await UserRepository.signUp(name, email, password),
});

const signOutAction = () => ({
  pendingActionType: KUserActions.PENDING_SIGN_OUT,
  pendingAction: async () => await UserRepository.signOut(),
});

const getUserInfoAction = () => ({
  pendingActionType: KUserActions.PENDING_GET_USER_INFO,
  pendingAction: async () => await UserRepository.getUserInfo(),
});

const cleanUserInfoAction = () => ({
  type: KUserActions.CLEAN_USER_INFO,
});

export {
  signInAction,
  signUpAction,
  signOutAction,
  getUserInfoAction,
  cleanUserInfoAction,
};
