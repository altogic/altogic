import { useContext, useState } from "react";
import { TaskContext } from "../../context/taskContext";
import {
  toDateInputValue,
  convertToHumeanReadableDate,
} from "../../helpers/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function EditTaskModal(props) {
  const context = useContext(TaskContext);

  const [title, setTitle] = useState(context.currentlyEditedTodo.title);
  const [description, setDescription] = useState(
    context.currentlyEditedTodo.description
  );
  const [priority, setPriority] = useState(
    context.currentlyEditedTodo.priority
  );
  const [dueDate, setDueDate] = useState(
    context.currentlyEditedTodo.dueDate.slice(0, 10)
  );

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleDueDate = (event) => {
    setDueDate(event.target.value);
  };

  function handleDeleteModal() {
    context.setShowModal(false);
    context.setDeleteModalType("task");
    context.toggleDeleteModal();
  }

  return (
    <>
      {context.showModal ? (
        <>
          <div className=" justify-center items-center  overflow-x-hidden overflow-y-auto fixed  inset-0 top-24 z-50 outline-none focus:outline-none ">
            <div className="relative  mx-auto max-w-5xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="items-start justify-between p-5 border-b border-solid  rounded">
                  <input
                    className="text-2xl font-semibold w-3/5"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                  />
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-gray-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => context.toggleModal(null)}
                  >
                    <span className="bg-transparent text-gray-500 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <div className="flex items-center">
                    <label className="font-semibold text-indigo-800 text-sm">
                      Project Name
                    </label>
                    <p className="text-gray-400 mx-5 text-sm">
                      {
                        context.projects.find(
                          (project) =>
                            project._id ===
                            context.currentlyEditedTodo.projectId
                        ).name
                      }
                    </p>
                  </div>
                  <hr className=" my-2" />
                  <div className="flex items-center">
                    <label className="font-semibold text-indigo-800 text-sm">
                      Date Created
                    </label>
                    <p className="text-gray-400 mx-5 text-xs">
                      {convertToHumeanReadableDate(
                        context.currentlyEditedTodo.createdAt
                      )}
                    </p>
                  </div>
                  <hr className=" my-2" />
                  <div className="flex items-center">
                    <label className="font-semibold text-indigo-800 text-sm">
                      Due Date
                    </label>
                    <input
                      type="date"
                      min={toDateInputValue(new Date())}
                      required
                      value={dueDate}
                      className="text-bold mx-8 text-sm text-gray-400"
                      onChange={handleDueDate}
                    />
                  </div>
                  <hr className="border my-3" />
                  <div className="flex items-center">
                    <label className="font-semibold text-indigo-800 text-sm">
                      Priority
                    </label>
                    <select
                      onChange={handlePriorityChange}
                      defaultValue={priority}
                      className="bg-slate-100 border p-1 rounded mx-8 text-sm"
                    >
                      <option value={1}>Low</option>
                      <option value={2}>Medium</option>
                      <option value={3}>High</option>
                    </select>
                  </div>
                  <hr className=" my-2" />
                  <textarea
                    className="w-full bg-gray-100 rounded shadow-xs "
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </div>

                <div className="grid grid-cols-12 items-center">
                  <div
                    onClick={() => handleDeleteModal()}
                    className="col-span-6 ml-5"
                  >
                    <span className="text-red-600 font-bold cursor-pointer text-xs ml-2">
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      REMOVE TASK
                    </span>
                  </div>
                  <div className="col-span-6">
                    <div className="flex justify-end items-center p-6  border-solid border-slate-200 rounded-b">
                      <button
                        className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-xs outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => context.toggleModal(null)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-indigo-600 text-white  font-bold uppercase text-xs px-3 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() =>
                          context.updateTask(
                            title,
                            description,
                            dueDate,
                            priority
                          )
                        }
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
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

export default EditTaskModal;
