import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faSpinner,
  faExclamation,
} from "@fortawesome/free-solid-svg-icons";

function Notification(props) {
  const { message, status } = props;

  let colorClasses = "";
  let faIcon;

  if (status === "success") {
    colorClasses =
      "bg-emerald-500 text-xs text-white px-4 py-2 rounded-full shadow outline-none mr-1 mb-1 ease-linear ";
    faIcon = faCheck;
  }
  if (status === "pending") {
    colorClasses =
      "bg-yellow-500 text-xs text-white px-4 py-2 rounded-full shadow outline-none mr-1 mb-1 ease-linear ";
    faIcon = faSpinner;
  }

  if (status === "error") {
    colorClasses =
      "bg-red-500 text-xs text-white px-4 py-2 rounded-full shadow outline-none mr-1 mb-1 ease-linear ";
    faIcon = faExclamation;
  }

  return (
    <div className="flex z-90 sticky top-2 items-center justify-end w-full my-4 overflow-hidden p-4 ">
      <div className={colorClasses} type="button">
        <FontAwesomeIcon icon={faIcon} color="white" /> {message}
      </div>
    </div>
  );
}

export default Notification;
