import altogic from "@/configs/altogic";
import { useState } from "react";

export async function getServerSideProps() {
  try {
    const { data: todosFromDb, errors } = await altogic.db
      .model("todo")
      .sort("updatedAt", "desc")
      .sort("isCompleted", "asc")
      .page(1)
      .limit(100)
      .get();

    if (errors) throw errors;

    return { props: { todosFromDb } };
  } catch (errorList) {
    return { errorCode: errorList?.status || 404 };
  }
}

export default function Home({ todosFromDb }) {
  const [todos, setTodos] = useState(todosFromDb);

  const sortedTodos = todos.sort((a, b) =>
    a.isCompleted === b.isCompleted ? 0 : a.isCompleted ? 1 : -1
  );

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const [name] = e.target;

    try {
      const { data, errors } = await altogic.db.model("todo").create({
        name: name.value,
      });

      if (errors) throw errors;

      name.value = "";
      setTodos([data, ...todos]);
    } catch (errorList) {
      alert(errorList?.items[0].message);
    }
  };

  const handleChangeStatus = async (todoId, newStatus) => {
    try {
      const { data: updatedTodo, errors } = await altogic.db
        .model("todo")
        .object(todoId)
        .update({
          isCompleted: newStatus,
        });

      if (errors) throw errors;

      setTodos(todos.map((todo) => (todo._id === todoId ? updatedTodo : todo)));
    } catch (errorList) {
      alert(errorList?.items[0].message);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const { errors } = await altogic.db.model("todo").object(todoId).delete();

      if (errors) throw errors;

      setTodos(todos.filter((todo) => todo._id !== todoId));
    } catch (errorList) {
      alert(errorList?.items[0].message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
      <form onSubmit={handleAddTodo}>
        <div className="relative">
          <input
            placeholder="Add Todo"
            className="w-full rounded-md border-gray-200 py-2.5 pr-10 pl-2 shadow-sm sm:text-sm border-2 border-dashed"
          />

          <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
            <button type="submit">
              <span className="sr-only">Submit</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                id="send-icon"
                className="w-7 h-7 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  stroke-strokelinejoin="round"
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </span>
        </div>
      </form>

      {sortedTodos?.map((todo) => (
        <div key={todo._id} className="flex items-center justify-between mt-2">
          <div className="relative flex items-center">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                className="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 rounded cursor-pointer"
                onChange={() => handleChangeStatus(todo._id, !todo.isCompleted)}
                checked={todo.isCompleted}
              />
            </div>
            <div
              className="ml-3 text-sm w-full p-2 cursor-pointer"
              onClick={() => handleChangeStatus(todo._id, !todo.isCompleted)}
            >
              <label
                className={`font-medium text-gray-700 cursor-pointer ${
                  todo.isCompleted && "line-through"
                }`}
              >
                {todo.name}
              </label>
            </div>
          </div>
          <div className="flex items-center px-2 py-2 text-sm font-medium rounded-md">
            <button onClick={() => handleDeleteTodo(todo._id)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="lex-shrink-0 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
