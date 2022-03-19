import { convertSnakeToCamelJSON } from "utils/services/convertJson";

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
    const data = result.data;
    nextAction = {
      type: `${type}_SUCCESS`,
      data: data,
    };
    returnValue = {
      success: true,
      data: data,
    };
  } catch (err) {
    const error = err.response.data;
    nextAction = {
      type: `${type}_FAILED`,
      error: convertSnakeToCamelJSON(error),
    };
    returnValue = {
      success: false,
      error: convertSnakeToCamelJSON(error),
    };
  }

  next(nextAction);
  return returnValue;
};

export default clientMiddleware;
