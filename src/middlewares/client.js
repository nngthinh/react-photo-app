const clientMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  return result;
};

export default clientMiddleware;
