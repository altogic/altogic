import Button from "../button";
import Avatar from "../avatar";
import { ClipLoader } from "react-spinners";

export default function InputPhoto({
  label,
  error,
  loading,
  onChange,
  onDelete,
  value,
  defaultAvatar,
}) {
  return (
    <div className="col-span-3 mb-2">
      <label className="block text-sm font-medium text-gray-700">
        {label || "Photo"}
      </label>
      <div className="mt-1 flex items-center">
        {loading ? (
          <ClipLoader color="pink" size={45} />
        ) : (
          <span className="inline-block bg-gray-100 rounded-full overflow-hidden h-12 w-12">
            {value ? (
              <img className={`h-12 w-12 rounded-full`} src={value} alt="" />
            ) : (
              <>
                {defaultAvatar ? (
                  <Avatar size={12} />
                ) : (
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </>
            )}
          </span>
        )}
        <label>
          <span className="ml-5 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            Change
          </span>
          <input
            disabled={loading}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={onChange}
          />
        </label>
        <Button
          className="ml-2 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
          disabled={loading}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
      {error && (
        <span className="inline-block text-sm text-red-600">
          {error.message}
        </span>
      )}
    </div>
  );
}
