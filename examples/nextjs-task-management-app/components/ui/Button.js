import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const CustomButton = (props) => {
  return (
    <button
      className="bg-indigo-500 hover:bg-indigo-700 px-5 py-1.5 text-sm leading-5 rounded-md font-semibold text-white block w-full disabled:cursor-not-allowed disabled:bg-indigo-400"
      onClick={async () => {
        await props.onClick();
      }}
      disabled={props.disabled}
    >
      {props.buttonValue}
      {props.loading && (
        <FontAwesomeIcon
          className="ml-2"
          icon={faSpinner}
          style={{ fontSize: 15 }}
          spin
        />
      )}
    </button>
  );
};
export default CustomButton;
