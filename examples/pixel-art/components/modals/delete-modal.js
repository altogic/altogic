function DeleteModal({ title, description, setDeleteModal, clickDelete }) {
  return (
    <div className="relative z-20">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative max-w-[400px] w-full bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 ring-8 ring-red-50">
                <svg
                  className="w-6 h-6 text-red-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 2C8.44772 2 8 2.44772 8 3C8 3.55228 8.44772 4 9 4V2ZM15 4C15.5523 4 16 3.55228 16 3C16 2.44772 15.5523 2 15 2V4ZM3 5C2.44772 5 2 5.44772 2 6C2 6.55228 2.44772 7 3 7V5ZM21 7C21.5523 7 22 6.55228 22 6C22 5.44772 21.5523 5 21 5V7ZM19.9978 6.06652C20.0345 5.51546 19.6176 5.03895 19.0665 5.00221C18.5155 4.96548 18.039 5.38242 18.0022 5.93348L19.9978 6.06652ZM18.2987 16.5193L17.3009 16.4528L18.2987 16.5193ZM5.70129 16.5193L4.7035 16.5858L5.70129 16.5193ZM5.99779 5.93348C5.96105 5.38242 5.48454 4.96548 4.93348 5.00221C4.38242 5.03895 3.96548 5.51546 4.00221 6.06652L5.99779 5.93348ZM7.49834 20.6997L7.06223 21.5996H7.06223L7.49834 20.6997ZM6.19998 19.485L7.06888 18.99L6.19998 19.485ZM17.8 19.485L18.6689 19.98H18.6689L17.8 19.485ZM16.5017 20.6997L16.9378 21.5996H16.9378L16.5017 20.6997ZM11 10.5C11 9.94772 10.5523 9.5 10 9.5C9.44772 9.5 9 9.94772 9 10.5H11ZM9 15.5C9 16.0523 9.44772 16.5 10 16.5C10.5523 16.5 11 16.0523 11 15.5H9ZM15 10.5C15 9.94772 14.5523 9.5 14 9.5C13.4477 9.5 13 9.94772 13 10.5H15ZM13 15.5C13 16.0523 13.4477 16.5 14 16.5C14.5523 16.5 15 16.0523 15 15.5H13ZM9 4H15V2H9V4ZM3 7H21V5H3V7ZM18.0022 5.93348L17.3009 16.4528L19.2965 16.5858L19.9978 6.06652L18.0022 5.93348ZM13.5093 20H10.4907V22H13.5093V20ZM6.69907 16.4528L5.99779 5.93348L4.00221 6.06652L4.7035 16.5858L6.69907 16.4528ZM10.4907 20C9.68385 20 9.13703 19.9993 8.71286 19.9656C8.30086 19.9329 8.08684 19.8736 7.93444 19.7998L7.06223 21.5996C7.52952 21.826 8.0208 21.917 8.55459 21.9593C9.07622 22.0007 9.71571 22 10.4907 22V20ZM4.7035 16.5858C4.75505 17.359 4.79686 17.9972 4.87287 18.5149C4.95066 19.0447 5.07405 19.5288 5.33109 19.98L7.06888 18.99C6.98505 18.8429 6.9117 18.6333 6.85166 18.2243C6.78984 17.8034 6.75274 17.2578 6.69907 16.4528L4.7035 16.5858ZM7.93444 19.7998C7.57072 19.6235 7.26895 19.3412 7.06888 18.99L5.33109 19.98C5.73123 20.6824 6.33479 21.247 7.06223 21.5996L7.93444 19.7998ZM17.3009 16.4528C17.2473 17.2578 17.2102 17.8034 17.1483 18.2243C17.0883 18.6333 17.015 18.8429 16.9311 18.99L18.6689 19.98C18.926 19.5288 19.0493 19.0447 19.1271 18.5149C19.2031 17.9972 19.245 17.359 19.2965 16.5858L17.3009 16.4528ZM13.5093 22C14.2843 22 14.9238 22.0007 15.4454 21.9593C15.9792 21.917 16.4705 21.826 16.9378 21.5996L16.0656 19.7998C15.9132 19.8736 15.6991 19.9329 15.2871 19.9656C14.863 19.9993 14.3161 20 13.5093 20V22ZM16.9311 18.99C16.7311 19.3412 16.4293 19.6235 16.0656 19.7998L16.9378 21.5996C17.6652 21.247 18.2688 20.6824 18.6689 19.98L16.9311 18.99ZM9 10.5V15.5H11V10.5H9ZM13 10.5V15.5H15V10.5H13Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
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
                  {title}
                </h3>
                <span className="text-slate-500 text-sm tracking-sm">
                  {description}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal(false)}
                className="inline-flex items-center justify-center px-[14px] py-2.5 border border-gray-300 text-base font-medium tracking-sm rounded-full text-slate-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-[14px] py-2.5 text-base font-medium tracking-sm rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => {
                  clickDelete();
                  setDeleteModal(false);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
