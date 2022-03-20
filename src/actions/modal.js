const { KModalAction } = require("constants/actions");

const showModalAction = (contents, props) => {
  return {
    type: KModalAction.SHOW_MODAL,
    config: {
      contents: {
        title: "",
        body: "",
        button1: "",
        button2: "",
        ...contents,
      },
      props: {
        modal: {
          relative: false,
          centered: false,
          size: "small",
          onHide: () => {},
          ...props.modal,
          show: true,
        },
        header: {
          closeButton: true,
          onHide: () => {},
          ...props.header,
        },
        button1: {
          variant: "secondary",
          onClick: () => {},
          width: "",
          ...props.button1,
        },
        button2: {
          variant: "primary",
          onClick: () => {},
          width: "",
          ...props.button2,
        },
      },
    },
  };
};

const clearModalAction = () => {
  return {
    type: KModalAction.CLEAR_MODAL,
  };
};

export { showModalAction, clearModalAction };
