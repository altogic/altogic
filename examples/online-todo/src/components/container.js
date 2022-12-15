import cs from "classnames";

export default function Container({ children, className }) {
  return (
    <div className={cs(["max-w-7xl mx-auto px-4 sm:px-6 md:px-8", className])}>
      {children}
    </div>
  );
}
