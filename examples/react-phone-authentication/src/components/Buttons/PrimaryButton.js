import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
const PrimaryButton = ({ children, component, ...props }) => {
  const fullWidth = props.fullWidth ? "w-full" : "";
  return (
    <button
      className={`my-2 disabled:cursor-not-allowed text-sm whitespace-nowrap inline-flex items-center justify-center text-center px-4 py-2 border border-transparent rounded-md shadow-sm  font-medium text-white bg-indigo-600 hover:bg-indigo-700 ${fullWidth}`}
      onClick={props.customClickEvent}
      disabled={props.disabled}
    >
      {props.loading ? (
        <>
          <FontAwesomeIcon icon={faCircleNotch} color="white" spin />
          &nbsp;
        </>
      ) : (
        <></>
      )}

      {props.content}
      {children}
      {component}
    </button>
  );
};

export default PrimaryButton;
