export function Verification() {
  return (
    // Add verification text to inform user
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="mt-3 text-center sm:mt-5">
          <h3
            className="text-lg leading-6 font-medium text-gray-900"
            id="modal-headline"
          >
            Verification Email Sent
          </h3>
          {/* Display verification message to the user */}
          <div className="mt-2">
            <p className="text-sm text-gray-500 w-96">
              We've sent a verification email to your email address. Please
              check your inbox and click on the link to verify your email
              address.
            </p>{" "}
            <div className="mt-5 sm:mt-6 w-96 inline-flex justify-center">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 sm:text-sm"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Go back to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
