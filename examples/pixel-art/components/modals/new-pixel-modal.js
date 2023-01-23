import NewPixelForm from "../forms/new-pixel-form";
import Modal from "./modal";

export default function NewPixelModal({ show, setShow }) {
  return (
    <Modal show={show} setShow={setShow} isCreate>
      {show && <NewPixelForm />}
    </Modal>
  );
}
