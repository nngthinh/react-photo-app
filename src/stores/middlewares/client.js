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
    nextAction = { type: `${type}_FAILED`, error };
    returnValue = { success: false, error };
  }

  // Run next action
  next(nextAction);

  // Return async result
  return returnValue;
};

export default clientMiddleware;
