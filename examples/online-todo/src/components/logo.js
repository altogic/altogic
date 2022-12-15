import logoPrimary from "../assets/logo-todo-primary.png";
import logo from "../assets/logo-todo.png";

export default function Logo({ className, w, h, primary }) {
  return (
    <img
      className={className || `w-[${w || "80px"}] h-[${h || "80px"}] mb-6`}
      src={!primary ? logoPrimary : logo}
      alt="List"
    />
  );
}
