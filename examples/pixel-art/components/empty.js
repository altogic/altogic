import { FlagIcon } from "@heroicons/react/outline";

export default function Empty({ message }) {
  return (
    <div className="items-center flex flex-col">
      <span className="mt-10 inline-flex items-center justify-center w-14 h-14 rounded-full bg-violet-100 mb-6 ring-8 ring-violet-50">
        <FlagIcon className="w-7 h-7 text-violet-600" />
      </span>
      <p className="text-slate-500 text-md">{message}</p>
    </div>
  );
}
