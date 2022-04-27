import { useContext } from "react";
import { CounterContext } from "../context/CounterContext";

const Counter = () => {
  const context = useContext(CounterContext);
  const getMinutes = (counter) => {
    return `0${Math.floor(counter / 60).toString()}`;
  };
  const getSeconds = (counter) => {
    return counter % 60 > 9
      ? (counter % 60).toString()
      : `0${(counter % 60).toString()}`;
  };
  return (
    <div className="text-center">
      <h2 className="text-4xl text-indigo-800 font-semibold">
        {getMinutes(context.counter)}:{getSeconds(context.counter)}
      </h2>
    </div>
  );
};

export default Counter;
