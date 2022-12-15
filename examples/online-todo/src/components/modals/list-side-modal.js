import ListForm from "../forms/list-form";
import SideModal from "./side-modal";

export default function ListSideModal({ show, setShow, newList }) {
  return (
    <SideModal title="List" show={show} setShow={setShow}>
      {show && <ListForm newList={newList} setShow={setShow} />}
    </SideModal>
  );
}
