import { createContext, useState } from "react";
import { useEffect, useContext } from "react";
import { altogic } from "../helpers/altogic";
import { pad } from "../helpers/functions";
import { UserContext } from "./userContext";

export const TaskContext = createContext();
const TaskProvider = ({ children }) => {
  const userCtx = useContext(UserContext);

  // Todos and projects.
  const [todos, setTodos] = useState([]);
  const [projects, setProjects] = useState([]);

  // Current project state.
  const [currentProject, setCurrentProject] = useState(null);

  // Selected todos for the view.
  const [selectedTodos, setSelectedTodos] = useState([]);

  // Todo that we are editing in the modal.
  const [currentlyEditedTodo, setCurrentlyEditedTodo] = useState(null);

  // Show modal booleans.
  const [showModal, setShowModal] = useState(false);

  // Boolean values for sorting.
  const [dateSortedAsc, setDateSortedAsc] = useState(false);
  const [priortiySortedHighest, setPriortiySortedHighest] = useState(true);

  // State for showing which values we are filtering with.
  const [currentlyFilteredTag, setcurrentlyFilteredTag] = useState(null);
  const [currentlyFilteredPriority, setcurrentlyFilteredPriority] = useState(0);

  // Todos in the calendar view.
  const [calendarTodos, setCalendarTodos] = useState([]);

  // Store the currently selected date.
  const [currentlySelectedDate, setCurrentlySelectedDate] = useState(null);

  // Boolean for indicating if we are viewing all views.
  const [allTodosView, setAllTodosView] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalType, setDeleteModalType] = useState("");

  const [statsByPriority, setStatsByPriority] = useState(null);

  useEffect(() => {
    // Get all the projects and todos when user session changes.
    getAllProjects();
    getAllTodos();
  }, [userCtx.session]);

  useEffect(() => {
    // When current project changes, reset the filters.
    setDateSortedAsc(false);
    setPriortiySortedHighest(true);
    setcurrentlyFilteredPriority(0);
    setcurrentlyFilteredTag(null);

    if (userCtx.user != null) computeStatsByPriority();

    if (currentProject) {
      setSelectedTodos(
        todos.filter((todo) => todo.projectId === currentProject._id)
      );
    } else if (allTodosView) {
      setSelectedTodos(todos);
    }
    if (currentlySelectedDate !== null) {
      handleCalendarSelectedTasks(
        currentlySelectedDate.day,
        currentlySelectedDate.month,
        currentlySelectedDate.year
      );
    }
  }, [currentProject, todos]);

  useEffect(() => {
    if (projects.length === 0) {
      // If there is no project, set all tasks view.
      setAllTasks();
    } else {
      setCurrentProject(projects[0]);
    }
  }, [projects]);

  async function computeStatsByPriority() {
    // Decide if we will compute the todos in all projects or for the current project.
    const filterString =
      currentProject !== null
        ? `userId=='${userCtx.user._id}' && projectId=='${currentProject._id}'`
        : `userId=='${userCtx.user._id}'`;

    // Compute with Altogic Client Library function.
    const { data } = await altogic.db
      .model("todos")
      .filter(filterString)
      .group("priority")
      .compute({ name: "count", type: "count" });

    // Set the counts of priority.
    let priorityLowCount;
    let priorityMediumCount;
    let priorityHighCount;

    data.map((element) => {
      if (element.groupby.group === "1") {
        priorityLowCount = element.count;
      } else if (element.groupby.group === "2") {
        priorityMediumCount = element.count;
      } else if (element.groupby.group === "3") {
        priorityHighCount = element.count;
      }
      setStatsByPriority([
        priorityLowCount ?? 0,
        priorityMediumCount ?? 0,
        priorityHighCount ?? 0,
      ]);
    });
  }

  function toggleDeleteModal() {
    setShowDeleteModal(!showDeleteModal);
  }

  function handleCalendarSelectedTasks(day, month, year) {
    // Set the calendar todos for the selected day.
    setCalendarTodos(
      todos.filter((todo) => {
        if (
          todo.dueDate.slice(8, 10) === pad(day) &&
          todo.dueDate.slice(5, 7) === pad(month) &&
          todo.dueDate.slice(0, 4) === year.toString() &&
          !todo.status
        ) {
          if (allTodosView) {
            return todo;
          }
          if (todo.projectId === currentProject._id) {
            return todo;
          }
        }
      })
    );
    setCurrentlySelectedDate({ day: day, month: month, year: year });
  }

  function toggleModal(todo) {
    // Toggle the modal and set the currently edited todo.
    setShowModal(!showModal);
    setCurrentlyEditedTodo(todo);
  }

  async function addProject(projectName) {
    // Add a project and get all the projects again.
    await altogic.db
      .model("projects")
      .create({ name: projectName, userId: userCtx.user._id });
    getAllProjects();
  }

  async function handleDoneTodo(todoId, currentValue) {
    // Toggle the status field of the todo.
    const { data } = await altogic.db
      .model("todos")
      .object(todoId)
      .update({ status: !currentValue });
    if (data) {
      setTodos(
        todos.map((todo) => {
          if (todo._id === todoId) {
            todo.status = !currentValue;
          }
          return todo;
        })
      );
    }
  }

  async function filterByTag(tag) {
    setcurrentlyFilteredPriority(0);
    if (tag === null) {
      setcurrentlyFilteredTag(null);
      setSelectedTodos(
        todos.filter((todo) => {
          if (currentProject === null) {
            return true;
          } else {
            return todo.projectId === currentProject._id;
          }
        })
      );
    } else {
      // Construct the query string.
      const filterString =
        currentProject !== null
          ? `IN(tags,'${tag}')  && projectId=='${currentProject._id}' && userId== '${userCtx.user._id}'`
          : `IN(tags,'${tag}')  && userId== '${userCtx.user._id}'`;
      // Filter the database.
      const { data } = await altogic.db
        .model("todos")
        .filter(filterString)
        .get();
      if (data) {
        setcurrentlyFilteredTag(tag);
        setSelectedTodos(data);
      }
    }
  }

  function setAllTasks() {
    // Set the all tasks view.
    setAllTodosView(true);
    setSelectedTodos(todos);
    setCurrentProject(null);
    setcurrentlyFilteredPriority(0);
    setcurrentlyFilteredTag(null);
  }

  async function filterByPriority(priority) {
    setcurrentlyFilteredTag(null);
    if (priority === "4") {
      setcurrentlyFilteredPriority(0);
      setSelectedTodos(
        todos.filter((todo) => {
          if (currentProject === null) {
            return true;
          } else {
            return todo.projectId === currentProject._id;
          }
        })
      );
    } else {
      // Construct the query string.
      const filterString =
        currentProject !== null
          ? `priority == '${priority}' && projectId == '${currentProject._id}' && userId == '${userCtx.user._id}'`
          : `priority == '${priority}'  && userId == '${userCtx.user._id}'`;
      // Filter the database.
      const { data } = await altogic.db
        .model("todos")
        .filter(filterString)
        .get();
      if (data) {
        setcurrentlyFilteredPriority(priority);
        setSelectedTodos(data);
      }
    }
  }

  async function createTodo(title, description, priority, tags, dueDate) {
    // Create todo object in the database.
    const { data, errors } = await altogic.db.model("todos").create({
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      userId: userCtx.user._id,
      status: false,
      projectId: currentProject._id,
      tags: tags,
    });
    if (data) {
      setTodos((todos) => [...todos, data]);
    }
    return errors;
  }

  async function removeTodo(todoId) {
    // Remove todo from the database.
    const { errors } = await altogic.db.model("todos").object(todoId).delete();
    if (!errors) {
      setTodos(todos.filter((todo) => todo._id !== todoId));
      setShowModal(false);
    }
  }

  async function getAllProjects() {
    // Get all projects from the database and set projects in the context.
    if (userCtx.user) {
      const { data } = await altogic.db
        .model("projects")
        .filter(`userId=='${userCtx.user._id}'`)
        .get();
      setProjects(data);
      setCurrentProject(data[0] ?? null);
    } else {
      setProjects([]);
    }
  }

  async function getAllTodos() {
    // Get all todos from the database and set todos in the context.
    if (userCtx.user) {
      const { data } = await altogic.db
        .model("todos")
        .filter(`userId=='${userCtx.user._id}'`)
        .limit(500)
        .sort("dueDate", "asc")
        .get();
      setTodos(data);
    } else {
      setTodos([]);
    }
  }

  async function deleteProject() {
    // Delete the todos of the project first.
    await altogic.db
      .model("todos")
      .filter(
        `userId == '${userCtx.user._id}' && projectId == '${currentProject._id}'`
      )
      .delete();
    // Delete the project.
    const { errors } = await altogic.db
      .model("projects")
      .filter(
        `_id == '${currentProject._id}' && userId == '${userCtx.user._id}' `
      )
      .delete();
    if (!errors) {
      // Set todos and projects in the context.
      setTodos(todos.filter((todo) => todo.projectId !== currentProject._id));
      setProjects(
        projects.filter((project) => project._id !== currentProject._id)
      );
    }
  }

  async function updateTask(title, description, dueDate, priority) {
    // Update the task in the database.
    const { data } = await altogic.db
      .model("todos")
      .object(currentlyEditedTodo._id)
      .update({
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
      });
    setTodos(
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo = data;
        }
        return todo;
      })
    );
    if (data) {
      // Close the modal.
      toggleModal(null);
    }
  }

  function toggleDateSort() {
    // Toggle the date sort in the table view.
    if (dateSortedAsc) {
      setSelectedTodos(
        selectedTodos.sort(
          (a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate)
        )
      );
    } else {
      setSelectedTodos(
        selectedTodos.sort(
          (a, b) => Date.parse(b.dueDate) - Date.parse(a.dueDate)
        )
      );
    }
    setDateSortedAsc(!dateSortedAsc);
  }

  function togglePrioritySort() {
    // Toggle the priority sort in the table view.
    if (priortiySortedHighest) {
      setSelectedTodos(selectedTodos.sort((a, b) => a.priority - b.priority));
    } else {
      setSelectedTodos(selectedTodos.sort((a, b) => b.priority - a.priority));
    }
    setPriortiySortedHighest(!priortiySortedHighest);
  }

  return (
    <TaskContext.Provider
      value={{
        todos,
        addProject,
        currentProject,
        setCurrentProject,
        projects,
        setShowModal,
        selectedTodos,
        showModal,
        toggleModal,
        createTodo,
        removeTodo,
        handleDoneTodo,
        deleteProject,
        updateTask,
        currentlyEditedTodo,
        toggleDateSort,
        togglePrioritySort,
        filterByTag,
        currentlyFilteredTag,
        currentlyFilteredPriority,
        filterByPriority,
        setAllTasks,
        handleCalendarSelectedTasks,
        calendarTodos,
        allTodosView,
        setAllTodosView,
        showDeleteModal,
        toggleDeleteModal,
        deleteModalType,
        setDeleteModalType,
        statsByPriority,
      }}
    >
      {" "}
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
