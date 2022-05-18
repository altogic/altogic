import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useContext } from "react";
import { TaskContext } from "../../context/taskContext";
import CreateProject from "./CreateProject";
import SidebarProfile from "../../components/layout/SidebarProfile";
import { SidebarContext } from "../../context/sidebarContext";
import { useRouter } from "next/router";

function ProjectTab() {
  const context = useContext(TaskContext);
  const router = useRouter();
  const sidebarContext = useContext(SidebarContext);

  function getAllTasks() {
    if (window.innerWidth < 1024) {
      sidebarContext.toggle();
    }
    context.setAllTasks();
  }

  return (
    <div className="bg-gray-800 min-h-full h-screen p-5 fixed w-72">
      <h2
        className={`font-semibold text-white mb-3 rounded-md p-2 cursor-pointer hover:bg-gray-700 ${
          context.allTodosView ? "bg-gray-700" : null
        }`}
        onClick={() => {
          getAllTasks();
          router.push("/tasks");
        }}
      >
        All Tasks
        <span className="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-indigo-100 bg-indigo-700 rounded-full">
          {context.todos.filter((todo) => !todo.status).length}
        </span>
      </h2>

      <div className="flex text-white items-center">
        <div className="">
          <h2 className="font-semibold text-white p-2">Groups</h2>
        </div>
      </div>
      <ul className=" space-y-1 text-slate-300 mt-2">
        {context.projects ? (
          context.projects.map((project_) => {
            return (
              <Link href="/tasks" key={project_._id}>
                <li
                  className={`rounded-md px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                    context.allTodosView
                      ? null
                      : context.currentProject._id === project_._id
                      ? "bg-gray-700"
                      : null
                  }`}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      sidebarContext.toggle();
                    }
                    context.setCurrentProject(project_);
                    context.setAllTodosView(false);
                  }}
                >
                  <FontAwesomeIcon icon={faDiagramProject}></FontAwesomeIcon>
                  &nbsp; {project_.name}
                  <span className="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-indigo-100 bg-indigo-700 rounded-full">
                    {
                      context.todos.filter(
                        (todo) =>
                          todo.projectId === project_._id && !todo.status
                      ).length
                    }
                  </span>
                </li>
              </Link>
            );
          })
        ) : (
          <></>
        )}
      </ul>
      <CreateProject />

      <div
        className="text-gray-200 mb-24 w-4/5 absolute bottom-0"
        onClick={() => {
          if (window.innerWidth < 1024) {
            sidebarContext.toggle();
          }
        }}
      >
        <SidebarProfile />
      </div>
    </div>
  );
}

export default ProjectTab;
