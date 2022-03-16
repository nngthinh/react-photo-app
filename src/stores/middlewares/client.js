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
    const result = await promise();
    nextAction = {
      type: `${type}_SUCCESS`,
      data: result,
    };
    returnValue = {
      success: true,
      data: result,
    };
  } catch (error) {
    nextAction = {
      type: `${type}_FAILED`,
      error: error,
    };

    returnValue = {
      success: false,
      message: error,
    };
  }

  next(nextAction);
  return returnValue;
};

export default clientMiddleware;
