import cs from "classnames";

export default function Container({ children, className }) {
  return (
    <div
      className={cs([
        "max-w-2xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8",
        className,
      ])}
    >
      {children}
    </div>
  );
}
