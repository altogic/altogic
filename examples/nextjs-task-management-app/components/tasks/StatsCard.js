import { useContext } from "react";
import { TaskContext } from "../../context/taskContext";

function StatsCard(props) {
  const context = useContext(TaskContext);
  return (
    <div className=" shadow rounded justify-center items-center text-center bg-white">
      <div className="text-center"></div>
      <div className="font-semibold mt-5 text-3xl text-gray-700">
        {props.count}
      </div>
      <div className="mb-5 text-xs  text-gray-500">{props.title}</div>
      {props.type === "total" ? (
        <div className="w-full bg-blue-500 h-1 text-indigo-400" />
      ) : props.type === "remaining" ? (
        <div className="w-full bg-yellow-500 h-1 text-indigo-400" />
      ) : (
        <div className="w-full bg-green-500 h-1 text-indigo-400" />
      )}
    </div>
  );
}
export default StatsCard;
