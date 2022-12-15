import Button from "../button";

function LeaveTeamModal({ onCancel, onLeave, isLoading }) {
  return (
    <div className="relative z-20">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative max-w-[400px] w-full bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 ring-8 ring-red-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-red-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              </span>
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition ease-in-out duration-150 hover:bg-gray-100"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 1L1 13M1 1L13 13"
                    stroke="#667085"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="text-left mb-8">
              <div className="mb-5">
                <h3 className="text-slate-800 mb-2 text-lg font-medium tracking-sm">
                  Leave Workspace
                </h3>
                <span className="text-slate-500 text-sm tracking-sm">
                  Are you sure you would like to leave this workspace?
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center px-[14px] py-2.5 border border-gray-300 text-base font-medium tracking-sm rounded-full text-slate-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                loading={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="inline-flex items-center justify-center px-[14px] py-2.5 text-base font-medium tracking-sm rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                loading={isLoading}
                onClick={onLeave}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveTeamModal;
