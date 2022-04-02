import { ButtonItem } from "components/Common/Items";
import { useEffect } from "react";
import "./index.css";

const OfflinePage = ({ reconnect }) => {
  useEffect(() => {
    const intervalId = setInterval(reconnect, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, [reconnect]);

  return <OfflinePageView reconnect={reconnect} />;
};

const OfflinePageView = ({ reconnect }) => {
  return (
    <div className="offline">
      <div className="offlineWrapper container u-heigthFull">
        <div className="u-flex u-flexColumn u-alignItemCenter u-textCenter">
          <h2>You are offline.</h2>
          <div className="u-marginTopSmall">Please try again later.</div>
          <div className="u-flex u-justifyContentCenter u-marginTopSmall">
            <ButtonItem
              variant="primary_outline"
              width="auto"
              size="medium"
              value="Try again"
              onClick={() => reconnect()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
