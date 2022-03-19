import { ToastContainer, toast, Icon } from "@ahaui/react";
const Toast = ({
  position = "bottom-left",
  autoDismiss = 5000,
  dismissible = true,
  hideProgressBar = true,
} = {}) => {
  return (
    <ToastContainer
      position={position}
      autoDismiss={autoDismiss}
      dismissible={dismissible}
      hideProgressBar={hideProgressBar}
    />
  );
};

// General notificaiton
const notify = (message, title = "") =>
  toast(() => <ToastView icon="helpCircle" title={title} message={message} />);

// Successful notificaiton
const notifyPositive = (message, title = "") =>
  toast.success(
    () => <ToastView icon="checkmarkCircle" title={title} message={message} />,
    {}
  );

// Failure notificaiton
const notifyNegative = (message, title = "") =>
  toast.error(
    () => <ToastView icon="alert" title={title} message={message} />,
    {}
  );

// Caution notificaiton
const notifyWarning = (message, title = "") =>
  toast.warn(
    () => <ToastView icon="warning" title={title} message={message} />,
    {}
  );

// Informative notificaiton
const notifyInformation = (message, title = "") =>
  toast.info(
    () => (
      <ToastView icon="informationCircle" title={title} message={message} />
    ),
    {}
  );

const ToastView = ({ icon, title, message }) => {
  return (
    <div className="u-flex u-flexGrow1">
      <div className="u-marginRightExtraSmall">
        <Icon name={icon} size="small" />
      </div>
      <div className="u-flexGrow1">
        {title && (
          <div className="u-fontMedium u-marginTopTiny u-marginBottomExtraSmall">
            {title}
          </div>
        )}
        <div className="u-marginTopTiny">{message}</div>
      </div>
    </div>
  );
};

export default Toast;
export {
  notify,
  notifyInformation,
  notifyWarning,
  notifyPositive,
  notifyNegative,
};
