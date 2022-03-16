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
      previousAction: { ...action }, // previous action that supplied for futher actions
      data: result,
    };
    returnValue = {
      sucess: true,
      data: result,
    };
  } catch (error) {
    nextAction = {
      type: `${type}_FAILED`,
      previousAction: { ...action },
      error: error,
    };

    returnValue = {
      sucess: false,
      message: error,
    };
  }

  next(nextAction);
  return returnValue;
};

export default clientMiddleware;
