import cs from "classnames";
import { useSelector } from "react-redux";

const fontSize = (size) => {
  switch (size) {
    case 6:
      return "text-xs";
    case 8:
      return "text-sm";
    case 10:
      return "";
    case 12:
      return "text-lg";
    case 14:
      return "text-xl";

    default:
      return "";
  }
};

export default function Avatar({ size, anotherUser }) {
  const currentUser = useSelector((state) => state.auth.user);

  const user = anotherUser || currentUser;

  return (
    <>
      {user && (
        <>
          {user?.profilePicture ? (
            <img
              className={`h-${size} w-${size} rounded-full inline-flex items-center justify-center`}
              src={user?.profilePicture}
              alt={user?.name}
            />
          ) : (
            <span
              className={cs([
                "inline-flex items-center justify-center rounded-full bg-violet-900",
                `h-${size} w-${size}`,
              ])}
            >
              <span
                className={cs([
                  "text-xl font-medium leading-none text-white",
                  fontSize(size),
                ])}
              >
                {Array.from(user?.name)[0].toUpperCase()}
                {Array.from(user?.name)[1].toUpperCase()}
              </span>
            </span>
          )}
        </>
      )}
    </>
  );
}
