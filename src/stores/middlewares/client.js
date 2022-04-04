import CustomError from "constants/error";

// Executes async query to the backend
const clientMiddleware = (store) => (next) => async (action) => {
  if (!action.pendingActionType) {
    return next(action);
  }

  // Destructure the action
  const { pendingActionType: type, pendingAction: promise } = action;

  // Execute async dispatch
  let nextAction, returnValue;
  try {
    const data = await promise();
    nextAction = { type: `${type}_SUCCESS`, data };
    returnValue = { success: true, data };
  } catch (error) {
    // Skip toast message
    const skipError =
      error.message &&
      String(error.message).includes(CustomError.NETWORK_ERROR);

    nextAction = {
      type: `${type}_FAILED`,
      skipError,
      error,
    };
    returnValue = { success: false, skipError, error };
  }

  // Run next action
  next(nextAction);

  // Return async result
  return returnValue;
};

export default clientMiddleware;
