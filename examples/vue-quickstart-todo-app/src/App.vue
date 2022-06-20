<template>
  <div id="app">
    <div
      class="bg-slate-100 h-screen flex flex-col items-center justify-center"
    >
      <div>
        <form>
          <label>Add a new todo: </label>
          <input class="border-2" type="text" v-model="todoName" />
          <button
            :disabled="todoName == ''"
            class="rounded bg-blue-600 ml-2 px-2 py-1 text-white"
            @click="
              (event) => {
                event.preventDefault();
                handleAddTodo(todoName);
              }
            "
          >
            Submit
          </button>
        </form>
      </div>
      <div>
        <ul>
          <li
            class="flex items-center mt-1"
            :key="todo._id"
            v-for="todo in todos"
          >
            <div class="flex items-center mr-2">
              <input
                type="checkbox"
                :checked="todo.status"
                @change="
                  (event) => {
                    event.preventDefault();
                    toggleTodo(todo);
                  }
                "
              />
              <h2
                :class="`${
                  todo.status ? 'line-through text-gray-400' : null
                } ml-2 font-bold`"
              >
                {{ todo.name }}
              </h2>
            </div>
            <time
              :class="`${
                todo.status ? 'line-through text-gray-400' : null
              } ml-2 font-bold`"
            >
              {{ todo.dateTime }}
            </time>
            <button
              class="rounded bg-red-600 ml-2 px-2 py-1 text-white"
              @click="handleDeleteTodo(todo)"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import altogic from "./helpers/altogic";

export default {
  name: "App",
  data() {
    return {
      todos: [], // To store the to-do list
      todoName: "", // Inputted to-do name
    };
  },
  methods: {
    // This function handles creating a to-do instance
    async handleAddTodo() {
      try {
        // Send a create todo model request to Altogic with the given to-do name
        const { data, errors } = await altogic.db.model("todo").create({
          name: this.todoName,
        });
        if (data) {
          // If the above request doesn't throw an error, append the created to-do to the todo list
          this.todoName = "";
          this.todos = [...this.todos, data];
        } else {
          console.log(errors);
        }
      } catch (error) {
        console.log(error);
      }
    },

    // This function toggles the status of the related to-do
    async toggleTodo(todo) {
      try {
        // Send a update todo instance request to Altogic
        const { data, errors } = await altogic.db
          .model("todo")
          .object(todo._id)
          .update({
            status: !todo.status,
          });
        if (data) {
          // If the above request doesn't throw an error, update the todo status on the todos array stored on the client side
          this.todos = this.todos.map((element) => {
            if (element._id === todo._id) {
              element = data;
            }
            return element;
          });
        } else {
          console.log(errors);
        }
      } catch (error) {
        console.log(error);
      }
    },

    // This funtion deleted the related to-do instance
    async handleDeleteTodo(todo) {
      try {
        //Send a delete request to Altogic with given to-do id
        const result = await altogic.db.model("todo").object(todo._id).delete();
        if (result.errors) {
          console.log(result.errors);
        } else {
          // If the result doesn't throw an error, delete the given to-do from the todos array stored on the client side
          this.todos = this.todos.filter((element) => element._id !== todo._id);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },

  // We have to fetch all todo instances from the backend when the App component is rendered
  async mounted() {
    // Retrive first 100(for pagination) to-do instances from Altogic
    const { data, errors } = await altogic.db.model("todo").limit(100).get();
    if (data) {
      this.todos = data;
    } else {
      console.log(errors);
    }
  },
};
</script>

