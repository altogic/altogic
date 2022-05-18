import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";

function ErrorMessage({ message }) {
  return (
    message && (
      <p className="text-sm text-red-500 my-2 text-center">
        <FontAwesomeIcon
          icon={faXmarkCircle}
          style={{ fontSize: 10 }}
          color="red"
        ></FontAwesomeIcon>{" "}
        {message}
      </p>
    )
  );
}

export default ErrorMessage;
