<script setup>
import altogic from "~/configs/altogic";

const { data, errors } = await useAsyncData(() =>
  altogic.db.model("todo").sort("isCompleted", "asc").page(1).limit(100).get()
);

const todos = ref(data.value.data);
const sortedTodos = computed(() => {
  const completedTodo = todos.value
    .filter((todo) => todo.isCompleted)
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
  const uncompletedTodo = todos.value
    .filter((todo) => !todo.isCompleted)
    .sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1));
  return [...uncompletedTodo, ...completedTodo];
});
const todoInput = ref("");

const handleAddTodo = async () => {
  try {
    const { data, errors } = await altogic.db.model("todo").create({
      name: todoInput.value,
    });

    if (errors) throw errors;

    todoInput.value = "";
    todos.value.unshift(data);
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

    todos.value = todos.value.map((todo) =>
      todo._id === todoId ? updatedTodo : todo
    );
  } catch (errorList) {
    alert(errorList?.items[0].message);
  }
};

const handleDeleteTodo = async (todoId) => {
  try {
    const { errors } = await altogic.db.model("todo").object(todoId).delete();

    if (errors) throw errors;

    todos.value = todos.value.filter((todo) => todo._id !== todoId);
  } catch (errorList) {
    alert(errorList?.items[0].message);
  }
};
</script>

<template>
  <div
    class="max-w-2xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8"
  >
    <form @submit.prevent="handleAddTodo">
      <div class="relative">
        <input
          placeholder="Add Todo"
          class="w-full rounded-md border-gray-200 py-2.5 pr-10 pl-2 shadow-sm sm:text-sm border-2 border-dashed"
          v-model="todoInput"
          required
        />

        <span class="absolute inset-y-0 right-0 grid w-10 place-content-center">
          <button type="submit">
            <span class="sr-only">Submit</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
              id="send-icon"
              class="w-7 h-7 text-gray-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </span>
      </div>
    </form>

    <div
      v-for="todo in sortedTodos"
      :key="todo._id"
      class="flex items-center justify-between mt-2"
    >
      <div class="relative flex items-center">
        <div class="flex items-center h-5">
          <input
            type="checkbox"
            class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 rounded cursor-pointer"
            @change="handleChangeStatus(todo._id, !todo.isCompleted)"
            :checked="todo.isCompleted"
          />
        </div>
        <div
          class="ml-3 text-sm w-full p-2 cursor-pointer"
          @click="handleChangeStatus(todo._id, !todo.isCompleted)"
        >
          <label
            class="font-medium text-gray-700 cursor-pointer"
            v-bind:class="{ 'line-through': todo.isCompleted }"
          >
            {{ todo.name }}
          </label>
        </div>
      </div>
      <div class="flex items-center px-2 py-2 text-sm font-medium rounded-md">
        <button @click="handleDeleteTodo(todo._id)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            aria-hidden="true"
            class="lex-shrink-0 h-5 w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
