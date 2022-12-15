import {
  ArrowCircleRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import cs from "classnames";
import Button from "../button";

function Input({
  label,
  id,
  error,
  register,
  className,
  prefix,
  icon,
  iconSvg,
  textArea,
  autoMargin,
  newStyle,
  rightButton,
  rightButtonProps,
  ...rest
}) {
  return (
    <div className={cs(["relative", autoMargin === false ? "" : "mb-2"])}>
      <label
        htmlFor={id}
        className={`block text-base font-medium text-slate-700 mb-1 ${
          error && "text-red-600"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <div className={iconSvg || prefix ? "flex rounded-md shadow-sm" : ""}>
          {prefix && (
            <span
              className={`inline-flex items-center px-3 rounded-l-md border border-r-0 tracking-sm ${
                error
                  ? "border-red-600 text-red-900"
                  : "border-gray-300 text-slate-500"
              }`}
            >
              {prefix}
            </span>
          )}
          {iconSvg && (
            <div className="absolute top-[11px] left-0 pl-3 pointer-events-none">
              <div className="w-5 h-5 text-gray-500">{iconSvg}</div>
            </div>
          )}
          {textArea ? (
            <textarea
              id={id}
              className={`appearance-none block w-full h-full px-3 py-3 text-slate-500 border border-gray-300 shadow-sm placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                error &&
                "border-red-600 text-red-900 placeholder-red-300 focus:ring-red-600"
              } ${!prefix ? "rounded-md" : ""} ${className}`}
              {...register}
              {...rest}
              autoComplete="off"
            />
          ) : (
            <input
              id={id}
              className={cs([
                !newStyle &&
                  "appearance-none block w-full h-full px-3 py-3 text-slate-500 border border-gray-300 shadow-sm placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500",
                error &&
                  "border-red-600 text-red-900 placeholder-red-300 focus:ring-red-600",
                !prefix ? "rounded-md" : "",
                className,
                rightButton && "pr-11",
              ])}
              {...register}
              {...rest}
              autoComplete="off"
            />
          )}
          {rightButton && (
            <Button
              id="send-button"
              type="submit"
              className="absolute top-[4px] right-0 px-2"
              {...rightButtonProps}
            >
              <ArrowCircleRightIcon
                id="send-icon"
                className="w-7 h-7 text-gray-500"
              />
            </Button>
          )}
        </div>
        {error && (
          <ExclamationCircleIcon className="w-8 h-8 absolute inset-y-1 right-0 pr-3 flex items-center pointer-events-none text-red-600" />
        )}
        {error?.message && (
          <span className="inline-block text-sm text-red-600">
            {error.message}
          </span>
        )}
      </div>
    </div>
  );
}
export default Input;
