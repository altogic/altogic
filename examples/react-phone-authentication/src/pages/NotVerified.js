import { useContext, useState } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import PrimaryButton from "../components/Buttons/PrimaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const NotVerified = () => {
  const context = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);
  const resend = async (event) => {
    setLoading(true);
    event.preventDefault();
    await context.resendVerificationCode();
    setLoading(false);
  };

  return (
    <div className="flex bg-gray-bg1 my-8 mb-20">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-lg py-1 px-16">
        <div className="min-h-full flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-md w-full space-y-8 text-center">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              size="5x"
              className="text-indigo-600"
            />
            <div>Your phone number has not been verified yet.</div>
            <div>
              We sent another verification code to:
              <span className="text-indigo-600">
                {sessionStorage.getItem("phoneNumber")}
              </span>
            </div>
            <div className="grid-flow-row">
              <div className="btn-group">
                <PrimaryButton
                  loading={loading}
                  customClickEvent={resend}
                  content="Resend Verification Code"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotVerified;
