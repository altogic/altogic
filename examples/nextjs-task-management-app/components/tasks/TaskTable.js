import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import TableItem from "./TableItem";
import { TaskContext } from "../../context/taskContext";
import { useContext } from "react";

function TaskTable(props) {
  const context = useContext(TaskContext);

  return (
    <div className=" py-2">
      <div className="overflow-x-auto px-12 border border-gray-100 shadow-md w-full bg-white rounded-md p-3">
        <table className="w-full text-md text-left space-y-3">
          <thead className="border-b-2 border-indigo-200 ">
            <tr>
              <th></th>
              <th>Title</th>
              <th>
                Due Date{" "}
                <button onClick={context.toggleDateSort}>
                  <FontAwesomeIcon
                    icon={faSort}
                    className="cursor-pointer text-indigo-600"
                  />
                </button>
              </th>
              <th>
                Priority{" "}
                <button onClick={context.togglePrioritySort}>
                  <FontAwesomeIcon
                    icon={faSort}
                    className="cursor-pointer text-indigo-600"
                  />
                </button>
              </th>
              <th>Tags</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.done
              ? context.selectedTodos.map((todo) => {
                  if (todo.status)
                    return <TableItem todo={todo} key={todo._id} />;
                })
              : context.selectedTodos.map((todo) => {
                  if (!todo.status)
                    return <TableItem todo={todo} key={todo._id} />;
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskTable;
