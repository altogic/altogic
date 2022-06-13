import { useEffect, useState } from "react";
import altogic from "./helpers/altogic";

export default function Home() {
  const [todos, setTodos] = useState([]);
  /*
  Inside your useEffect() hook, send a get request to Altogic using altogic.db.model(modelName).get() function of Altogic Client Library. 
  Then, set the data you fetched inside the todos state.
  */

  useEffect(() => {
    const fetchData = async () => {
      const { data, errors } = await altogic.db.model("todo").limit(100).get();
      if (data) {
        setTodos(data);
      } else {
        console.log(errors);
      }
    };
    fetchData();
  }, []);

  // Inputted todo name
  const [todoName, setTodoName] = useState("");

  /* 
    This function creates a todo instance on the database with the help of the Altogic Client Lİbrary db.model().create() function.
    After creating an instance on the database, append the created object to the todos state
  */
  const handleAddTodo = async (todoName) => {
    try {
      const { data, errors } = await altogic.db.model("todo").create({
        name: todoName,
      });
      if (data) {
        setTodoName("");
        setTodos([...todos, data]);
      } else {
        console.log(errors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
  We need to be able to update the status of our todos. We will implement a function called toggleTodo to send an update request to Altogic 
  for updating objects using altogic.db.model(modelName).object(objectId).update({}) function of Altogic Client Library. 
  Then, we will update the todo in the todos state by iterating the array.
  */
  const toggleTodo = async (todo) => {
    try {
      const { data, errors } = await altogic.db
        .model("todo")
        .object(todo._id)
        .update({
          status: !todo.status,
        });
      if (data) {
        setTodos(
          todos.map((element) => {
            if (element._id === todo._id) {
              element = data;
            }
            return element;
          })
        );
      } else {
        console.log(errors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
  We might also want to delete our todos. We will implement a function called handleDeleteTodo to send a delete request
   to Altogic for deleting objects using altogic.db.model(modelName).object(objectId).delete() function of Altogic Client Library. 
   Then, we will delete the todo in the todos state by filtering the array.
    */
  const handleDeleteTodo = async (todo) => {
    try {
      const { data, errors } = await altogic.db
        .model("todo")
        .object(todo._id)
        .delete();
      if (errors) {
        console.log(errors);
      } else {
        setTodos(todos.filter((element) => element._id !== todo._id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-100 h-screen flex flex-col items-center justify-center">
      <div>
        <form>
          <label>Add a new todo: </label>
          <input
            className="border-2"
            type="text"
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
          ></input>
          <button
            disabled={todoName === ""}
            className="rounded bg-blue-600 ml-2 px-2 py-1 text-white"
            onClick={(event) => {
              event.preventDefault();
              handleAddTodo(todoName);
            }}
          >
            Submit
          </button>
        </form>
      </div>
      <div>
        <ul>
          {todos.map((todo) => {
            return (
              <li className="flex items-center mt-1" key={todo._id}>
                <div className="flex items-center mr-2">
                  <input
                    type="checkbox"
                    checked={todo.status}
                    onChange={(event) => {
                      event.preventDefault();
                      toggleTodo(todo);
                    }}
                  ></input>
                  <h2
                    className={`${
                      todo.status ? "line-through text-gray-400" : null
                    } ml-2 font-bold`}
                  >
                    {todo.name}
                  </h2>
                </div>
                <time
                  className={`${
                    todo.status ? "line-through text-gray-400" : null
                  } ml-2 font-bold`}
                >
                  {todo.dateTime}
                </time>
                <button
                  className="rounded bg-red-600 ml-2 px-2 py-1 text-white"
                  onClick={() => handleDeleteTodo(todo)}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
