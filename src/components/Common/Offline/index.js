import { ButtonItem } from "components/Common/Items";
import "./index.css";

const OfflinePage = () => {
  return (
    <div class="offline">
      <div class="offlineWrapper container">
        <div class="u-flex u-flexColumn u-alignItemCenter u-textCenter">
          <h1>Internet was gone ...</h1>
          <div className="u-marginTopMedium">Please try again later</div>
          <div class="u-flex u-justifyContentCenter u-marginTopSmall">
            <ButtonItem
              variant="primary_outline"
              width="auto"
              value="Try again"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
