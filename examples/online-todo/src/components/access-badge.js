import cs from "classnames";

export default function AccessBadge({ isPublic }) {
  return (
    <span
      className={cs(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800",
        isPublic && "bg-green-100 text-green-800"
      )}
    >
      {isPublic ? "Public" : "Private"}
    </span>
  );
}
