import { useState } from "react";
import CustomButton from "../ui/Button";
import { TaskContext } from "../../context/taskContext";
import { useContext } from "react";
import Tag from "./Tag";
import { toDateInputValue } from "../../helpers/functions";

function AddTask() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [dueDate, setDueDate] = useState(toDateInputValue(new Date()));
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const context = useContext(TaskContext);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleTagChange = (event) => {
    if (event.target.value.includes(" ")) {
      let temp = event.target.value.split(" ")[0];
      if (temp.length !== 0) {
        setTags((tags) => [...tags, temp]);
        setCurrentTag("");
      } else {
      }
    } else {
      setCurrentTag(event.target.value);
    }
  };

  const handleDueDate = (event) => {
    setDueDate(event.target.value);
  };

  async function createTodo() {
    setLoading(true);
    const response = await context.createTodo(
      title,
      description,
      priority,
      tags,
      dueDate
    );
    if (response === null) {
      setTitle("");
      setDescription("");
      setPriority(1);
      setTags([]);
      setDueDate(toDateInputValue(new Date()));
    }
    setLoading(false);
  }

  function toggleIsOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="px-5 mb-12 bg-white rounded pt-5 shadow">
      <form className=" w-full font-semibold text-gray-600">
        <div className="space-y-2  w-full text-sm">
          Title
          <div className="grid grid-cols-12 justify-center items-center">
            <div className="col-span-9">
              <input
                className=" border rounded border-gray-300 w-full p-1 focus:none items-center"
                type="text"
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            <div className="col-span-3 ml-3 items-center">
              <CustomButton
                buttonValue={innerWidth > 1024 ? "Add Task" : "+"}
                loading={loading}
                onClick={() => {
                  event.preventDefault();
                  createTodo();
                }}
                disabled={title === "" || dueDate == null}
              />
            </div>
          </div>
          {isOpen ? (
            <>
              <div className="grid grid-cols-12 items-center">
                <div className="col-span-8 items-center mr-5">
                  <label>Description</label>
                  <input
                    className="border p-1 border-gray-300 w-full rounded focus:none  items-center"
                    type="text"
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </div>
                <div className="col-span-4">
                  <label>Priority</label>
                  <div className="text-right">
                    <select
                      onChange={handlePriorityChange}
                      className="bg-white border p-1 rounded w-full border-gray-300"
                      value={priority}
                    >
                      <option value={1}>Low</option>
                      <option value={2}>Medium</option>
                      <option value={3}>High</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 items-center">
                <div className="justify-center items-center col-span-8">
                  <div className="grid grid-cols-8 items-center">
                    <div className="col-span-8 mr-5">
                      Tags
                      <input
                        className="text-md p-1 border border-gray-300 rounded focus:none w-full"
                        onChange={handleTagChange}
                        value={currentTag}
                        type="text"
                        disabled={tags.length === 3}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  Due Date
                  <div className="text-right">
                    <input
                      type="date"
                      min={toDateInputValue(new Date())}
                      required
                      value={dueDate}
                      onChange={handleDueDate}
                      className="border p-1 rounded w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                {tags !== [] ? (
                  tags.map((tag, index) => {
                    return <Tag tag={tag} key={index} />;
                  })
                ) : (
                  <></>
                )}
              </div>
            </>
          ) : null}
        </div>
      </form>
      <button
        onClick={toggleIsOpen}
        className="cursor-pointer text-indigo-500 active:none text-xs mb-4"
      >
        {isOpen ? "Hide Details" : "Show Details"}
      </button>
    </div>
  );
}

export default AddTask;
