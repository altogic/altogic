import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const SecondaryButton = (props) => {
  return (
    <button
      className="whitespace-nowrap2 mx-1 text-indigo-600 text-sm inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm  font-medium bg-slate-200 hover:bg-slate-300"
      onClick={props.customClickEvent}
    >
      {props.loading ? (
        <>
          <FontAwesomeIcon icon={faCircleNotch} color="indigo-600" spin />
          &nbsp;
        </>
      ) : (
        <></>
      )}{" "}
      {props.content}
    </button>
  );
};

export default SecondaryButton;
