import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useContext } from "react";
import {
  faRocket,
  faCalendar,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { TaskContext } from "../../context/taskContext";
import { convertToHumeanReadableDate } from "../../helpers/functions";
import Tag from "./Tag";

function TaskItem(props) {
  const [doneStatus, setDoneStatus] = useState(props.todo.status);
  async function handleChange(event) {
    event.stopPropagation();
    context.handleDoneTodo(props.todo._id, props.todo.status);
  }
  const context = useContext(TaskContext);
  const openModal = (event) => {
    if (event.target.nodeName === "DIV") {
      context.toggleModal(props.todo);
    }
  };

  return (
    <>
      <div className="flex">
        <div
          className="my-1 pb-3 px-6 p-3  shadow w-full bg-white rounded cursor-pointer"
          onClick={openModal}
        >
          {window.innerWidth < 1024 ? (
            props.isList ? (
              <div className="flex">
                {props.todo.tags.map((tag, index) => {
                  return (
                    <span
                      className="hover:cursor-pointer"
                      key={index}
                      onClick={() => {
                        context.filterByTag(tag);
                      }}
                    >
                      <Tag tag={tag} />
                    </span>
                  );
                })}
              </div>
            ) : null
          ) : null}
          <div className="grid grid-cols-12 items-center">
            <div className="col-span-6">
              <div className="flex items-center">
                <div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-0 focus:ring-0 accent-indigo-600 rounded-full"
                    defaultChecked={doneStatus}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <div
                    className={` ${
                      props.isList ? "text-md" : "text-xs"
                    } ml-3 cursor-pointer truncate  ${props.titleWidth} ${
                      props.todo.status
                        ? "line-through text-gray-400"
                        : "text-gray-700 "
                    } `}
                    title={props.todo.title}
                  >
                    {props.todo.title}
                  </div>
                  {!props.todo.status ? (
                    <div className="ml-3 text-gray-400 text-xs font-light">
                      <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                      {convertToHumeanReadableDate(props.todo.dueDate)}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="col-span-6">
              {!props.todo.status && (
                <div className="flex text-right justify-end items-center text-sm">
                  <div className="">
                    {window.innerWidth > 1024 ? (
                      props.isList ? (
                        <div className="flex">
                          {props.todo.tags.map((tag, index) => {
                            return (
                              <span
                                className="hover:cursor-pointer"
                                key={index}
                                onClick={() => {
                                  context.filterByTag(tag);
                                }}
                              >
                                <Tag tag={tag} />
                              </span>
                            );
                          })}
                        </div>
                      ) : null
                    ) : null}
                    <div className="mt-1">
                      {props.todo.priority === "3" ? (
                        <span className="py-0.5 px-1.5 bg-red-100 mr-2 text-xs rounded text-red-700">
                          <FontAwesomeIcon icon={faRocket} /> High
                        </span>
                      ) : props.todo.priority === "2" ? (
                        <span className="py-0.5 px-1.5 bg-yellow-100 mr-2 text-xs rounded text-yellow-700  ">
                          Medium
                        </span>
                      ) : (
                        <span className="py-0.5 px-1.5 bg-green-100 mr-2 text-xs rounded text-green-700 cursor-text">
                          Low
                        </span>
                      )}
                    </div>
                  </div>
                  {props.isList ? (
                    <div
                      className="text-indigo-600 cursor-pointer mx-3"
                      onClick={() => context.toggleModal(props.todo)}
                    >
                      <FontAwesomeIcon icon={faPencil} />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskItem;
