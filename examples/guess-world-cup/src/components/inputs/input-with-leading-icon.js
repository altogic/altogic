export default function InputWithLeadingIcon({ label, imgSrc }) {
  return (
    <div>
      <label htmlFor="text" className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* <MailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
          <img
            className="h-5 w-5 text-gray-400 rounded-full"
            src={imgSrc}
            alt={label}
          />
        </div>
        <input
          type="text"
          className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter your score"
        />
      </div>
    </div>
  );
}
