import { Modal } from "@ahaui/react";
import { ButtonItem } from "../Items";

const CustomModal = ({ contents, props }) => {
  return <CustomModalView contents={contents} props={props}></CustomModalView>;
};

const CustomModalView = ({ contents, props }) => {
  return (
    <Modal {...props.modal} data-testid="modal">
      <Modal.Header {...props.header} data-testid="modal-header">
        <Modal.Title>{contents.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body data-testid="modal-body">{contents.body}</Modal.Body>
      <Modal.Footer data-testid="modal-footer">
        <ButtonItem
          data-testid="modal-button1"
          {...props.button1}
          value={contents.button1}
        />
        <ButtonItem
          data-testid="modal-button2"
          {...props.button2}
          value={contents.button2}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
