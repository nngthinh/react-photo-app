const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem("state", JSON.stringify(state));
    return true;
  } catch (err) {
    return false;
  }
};

export { loadState, saveState };
