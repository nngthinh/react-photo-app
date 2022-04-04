const { GeneralAction } = require("constants/actions");

const emitNetworkErrorAction = () => ({
  type: GeneralAction.NETWORK_ERROR,
});

const emitNetworkOkAction = () => ({
  type: GeneralAction.NETWORK_OK,
});

export { emitNetworkErrorAction, emitNetworkOkAction };
