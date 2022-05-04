const NotFound = () => {
  return (
    <div className="flex bg-gray-bg1 my-8 mb-20">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-lg py-1 px-16">
        <div className="min-h-full flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-md w-full space-y-8">
            <h1>404 Not Found!</h1>
            <p>
              <a className="text-blue-500" href={window.location.href}>
                {window.location.href}{" "}
              </a>{" "}
              not found!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
