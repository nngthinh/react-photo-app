import { Modal } from "@ahaui/react";
import { ButtonItem } from "../Items";

const CustomModal = ({ contents, props }) => {
  return <CustomModalView contents={contents} props={props}></CustomModalView>;
};

const CustomModalView = ({ contents, props }) => {
  return (
    <Modal {...props.modal}>
      <Modal.Header {...props.header}>
        <Modal.Title>{contents.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{contents.body}</Modal.Body>
      <Modal.Footer>
        <ButtonItem {...props.button1} value={contents.button1} />
        <ButtonItem {...props.button2} value={contents.button2} />
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
