import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const CustomButton = (props) => {
  return (
    <div className="mt-6 text-center">
      <button
        className="bg-indigo-500 hover:bg-indigo-700 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white block w-full"
        onClick={async () => {
          await props.onClick();
        }}
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
    </div>
  );
};
export default CustomButton;
