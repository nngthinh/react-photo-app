const clientMiddleware = (store) => (next) => async (action) => {
  if (!action.pendingAction) {
    return next(action);
  }

  // Destructure the action
  const { pendingActionType: type, pendingAction: promise } = action;

  // next action and return value
  let nextAction, returnValue;
  try {
    const result = await promise;
    nextAction = {
      type: `${type}_SUCCESS`,
      data: result,
    };
    returnValue = {
      sucess: true,
      data: result,
    };
  } catch (error) {
    nextAction = {
      type: `${type}_FAILED`,
      data: error,
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
