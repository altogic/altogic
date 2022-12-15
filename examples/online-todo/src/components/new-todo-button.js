import { PlusIcon } from "@heroicons/react/outline";

/* This example requires Tailwind CSS v2.0+ */
export default function NewTodoButton({ onClick }) {
  return (
    <button
      type="button"
      className="relative block w-full md:w-1/2 border-2 border-indigo-300 border-dashed rounded-lg p-2 text-center hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={onClick}
    >
      <PlusIcon className="mx-auto h-12 w-12 text-indigo-400" />
      <span className="mt-2 block text-sm font-medium text-indigo-900">
        Create a new todo
      </span>
    </button>
  );
}
