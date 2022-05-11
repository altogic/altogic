import { useState } from "react";

function Switch(props) {
  const [toggle, setToggle] = useState(props.enabled);
  const toggleClass = " transform translate-x-6";
  const toggleColor = toggle ? "bg-indigo-500" : "bg-gray-500";
  return (
    <div onClick={props.onClick}>
      {/*   Switch Container */}
      <div
        className={`md:w-14 md:h-7 w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${toggleColor}`}
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        {/* Switch */}
        <div
          className={
            "bg-white md:w-6 md:h-6 h-5 w-5 rounded-full shadow-md transform duration-300 ease-in-out" +
            (toggle ? toggleClass : null)
          }
        ></div>
      </div>
    </div>
  );
}

export default Switch;
