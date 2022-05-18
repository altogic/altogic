import { useContext } from "react";
import { TaskContext } from "../../context/taskContext";

function DeleteModal() {
  const context = useContext(TaskContext);
  function remove() {
    if (context.deleteModalType === "task") {
      context.removeTodo(context.currentlyEditedTodo._id);
    } else {
      context.deleteProject();
    }
    context.toggleDeleteModal();
  }
  return (
    <>
      {context.showDeleteModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="text-slate-500 leading-relaxed">
                    Do you want to remove the&nbsp;{context.deleteModalType}?
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-1 border-t border-solid border-slate-200 rounded-b text-sm">
                  <button
                    className="text-gray-500 background-transparent font-bold px-3 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => context.toggleDeleteModal()}
                  >
                    Close
                  </button>
                  <button
                    className="bg-indigo-500 text-white active:bg-indigo-600 font-bold text-sm px-3 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => remove()}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

export default DeleteModal;
