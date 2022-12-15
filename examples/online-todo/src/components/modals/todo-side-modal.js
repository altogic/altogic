import _ from "lodash";
import TodoForm from "../forms/todo-form";
import SideModal from "./side-modal";

export default function TodoSideModal({ selectedTodo, setSelectedTodo }) {
  const show = !_.isNil(selectedTodo?._id) || selectedTodo === true;
  return (
    <SideModal title="Todo" show={show} setShow={setSelectedTodo}>
      {selectedTodo && (
        <TodoForm
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
        />
      )}
    </SideModal>
  );
}
