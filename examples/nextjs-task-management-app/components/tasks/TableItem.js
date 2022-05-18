import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faRocket, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { TaskContext } from "../../context/taskContext";
import { convertToHumeanReadableDate } from "../../helpers/functions";
import Tag from "./Tag";

function TableItem(props) {
  const [status, setStatus] = useState(props.todo.status);
  const context = useContext(TaskContext);
  const handleStatus = () => {
    context.handleDoneTodo(props.todo._id, props.todo.status);
  };

  return (
    <tr className="border-b h-10 text-sm">
      <td>
        <input
          type="checkbox"
          defaultChecked={status}
          onChange={handleStatus}
          className="accent-indigo-600"
        />
      </td>
      {status ? (
        <td className="line-through text-gray-400" title={props.todo.title}>
          {props.todo.title.length > 15
            ? props.todo.title.slice(0, 15) + "..."
            : props.todo.title}
        </td>
      ) : (
        <td title={props.todo.title}>
          {props.todo.title.length > 15
            ? props.todo.title.slice(0, 15) + "..."
            : props.todo.title}
        </td>
      )}
      <td>{convertToHumeanReadableDate(props.todo.dueDate)}</td>
      <td>
        {props.todo.priority == "3" ? (
          <span className="py-0.5 px-1.5 bg-red-100 mr-2 text-xs rounded text-red-700 font-semibold">
            <FontAwesomeIcon icon={faRocket} /> High
          </span>
        ) : props.todo.priority === "2" ? (
          <span className="py-0.5 px-1.5 bg-yellow-100 mr-2 text-xs rounded text-yellow-700 font-semibold">
            Medium
          </span>
        ) : (
          <span className="py-0.5 px-1.5 bg-green-100 mr-2 text-xs rounded text-green-700 font-semibold">
            Low
          </span>
        )}
      </td>
      <td>
        {props.todo.tags.map((tag, index) => {
          return (
            <span
              className="hover:cursor-pointer"
              onClick={() => {
                context.filterByTag(tag);
              }}
            >
              <Tag tag={tag} />
            </span>
          );
        })}
      </td>
      <td>
        {!props.todo.status && (
          <span>
            <FontAwesomeIcon
              icon={faPencil}
              className="text-indigo-600 cursor-pointer"
              onClick={() => context.toggleModal(props.todo)}
            />
          </span>
        )}
      </td>
    </tr>
  );
}

export default TableItem;
