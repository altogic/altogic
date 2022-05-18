import { useContext } from "react";
import { TaskContext } from "../../context/taskContext";
import TaskItem from "./TaskItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglass,
  faCalendarCheck,
  faList,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import AddTask from "./AddTask";
import TaskTable from "./TaskTable";
import CustomButton from "../../components/ui/Button";
import EditTaskModal from "./EditTaskModal";
import Tag from "./Tag";
import DeleteModal from "./DeleteModal";

function TaskView() {
  const context = useContext(TaskContext);
  const [isTable, setIsTable] = useState(false);
  const toggleTable = () => {
    setIsTable(!isTable);
  };
  const toggle = () => {
    context.setDeleteModalType("group");
    context.toggleDeleteModal();
  };
  return (
    <div className="bg-slate-100 min-h-screen p-5 lg:px-24 w-full">
      {context.currentProject !== null || context.allTodosView ? (
        <>
          <div>
            <h2 className="font-semibold mb-8">
              {context.allTodosView
                ? "ALL TASKS"
                : context.currentProject.name.toUpperCase()}
            </h2>
            {context.currentProject !== null ? <AddTask /> : null}
            <div className="flex text-sm items-center font-semibold text-right justify-end">
              <div className="items-center">
                {context.currentlyFilteredTag === null ? null : (
                  <span
                    className="hover:cursor-pointer"
                    onClick={() => context.filterByTag(null)}
                  >
                    <Tag
                      tag={context.currentlyFilteredTag}
                      status={"filterTag"}
                    ></Tag>
                  </span>
                )}
                <select
                  className=" ml-2 rounded-lg p-2"
                  onChange={(event) =>
                    context.filterByPriority(event.target.value)
                  }
                  value={context.currentlyFilteredPriority}
                >
                  <option
                    className="rounded-md px-4 py-2 cursor-pointer hover:bg-gray-700"
                    key={0}
                    value={4}
                  >
                    All
                  </option>
                  <option
                    className="rounded-md px-4 py-2 cursor-pointer hover:bg-gray-700"
                    key={1}
                    value={1}
                  >
                    Low
                  </option>
                  <option
                    className="rounded-md px-4 py-2 cursor-pointer hover:bg-gray-700"
                    key={2}
                    value={2}
                  >
                    Medium
                  </option>
                  <option
                    className="rounded-md px-4 py-2 cursor-pointer hover:bg-gray-700"
                    key={3}
                    value={3}
                  >
                    High
                  </option>
                  ) -
                </select>
              </div>
              <div className="hidden sm:block ml-4">
                <FontAwesomeIcon
                  className={`cursor-pointer mx-1 ${
                    isTable ? null : "text-indigo-600"
                  }`}
                  icon={faList}
                  onClick={toggleTable}
                  size="xl"
                />
                <FontAwesomeIcon
                  className={`cursor-pointer ml-1 ${
                    isTable ? "text-indigo-600" : null
                  }`}
                  icon={faTableCells}
                  onClick={toggleTable}
                  size="xl"
                />
              </div>
            </div>
            <h2 className=" text-md text-gray-700">
              <FontAwesomeIcon icon={faHourglass} className="mr-1" />
              TODO
            </h2>
            {isTable ? (
              <TaskTable done={false} />
            ) : (
              <div className="my-2">
                {context.selectedTodos.map((todo) => {
                  if (todo.status === false) {
                    return (
                      <TaskItem
                        todo={todo}
                        key={todo._id}
                        titleWidth="lg:w-96 md:w-96 w-36"
                        isList={true}
                      />
                    );
                  }
                })}
              </div>
            )}
            <h2 className="text-md mt-7 text-gray-700">
              <FontAwesomeIcon icon={faCalendarCheck} className="mr-1" />
              DONE
            </h2>
            {isTable ? (
              <TaskTable done={true} />
            ) : (
              <div className="my-2">
                {context.selectedTodos.map((todo) => {
                  if (todo.status === true) {
                    return (
                      <TaskItem
                        todo={todo}
                        key={todo._id}
                        titleWidth="lg:w-96 md:w-96 w-24"
                        isList={true}
                      />
                    );
                  }
                })}
              </div>
            )}
          </div>
          <hr className="my-6" />
          {context.allTodosView ? null : (
            <div className="w-full flex">
              <CustomButton
                buttonValue="Delete Group"
                onClick={() => {
                  toggle();
                }}
              />
            </div>
          )}
        </>
      ) : (
        <p>No group is selected</p>
      )}
      <DeleteModal />
      {context.showModal ? <EditTaskModal /> : null}
    </div>
  );
}

export default TaskView;
