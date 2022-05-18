import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import { useState, useContext } from "react";
import { TaskContext } from "../../context/taskContext";

function CreateProject() {
  const [project, setProject] = useState("");
  const context = useContext(TaskContext);
  const handleProject = (event) => {
    setProject(event.target.value);
  };
  return (
    <form>
      <div className="flex justify-center items-center mt-3 px-4">
        &nbsp;
        <input
          type="text"
          className="rounded-md px-4 py-2 bg-gray-700 text-gray-300 inline-flex text-sm w-full mr-2 focus:bg-gray-600"
          placeholder="Add a new project"
          value={project}
          onChange={handleProject}
        />
        <button
          className="disabled:cursor-not-allowed"
          disabled={project === ""}
          onClick={() => {
            event.preventDefault();
            context.addProject(project);
            setProject("");
          }}
        >
          <FontAwesomeIcon
            icon={faPlusCircle}
            color="white"
            size="xl"
          ></FontAwesomeIcon>
        </button>
      </div>
    </form>
  );
}

export default CreateProject;
