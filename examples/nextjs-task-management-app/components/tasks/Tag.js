function Tag(props) {
  let color =
    props.status === "filterTag"
      ? "bg-red-100"
      : "hover:bg-indigo-200 bg-indigo-100";
  return (
    <span
      className={`py-1 px-1 ${color} rounded mr-2 text-xs text-indigo-400 truncate inline-block max-h-16`}
      style={{ maxWidth: "80px" }}
    >
      {props.tag}
    </span>
  );
}

export default Tag;
