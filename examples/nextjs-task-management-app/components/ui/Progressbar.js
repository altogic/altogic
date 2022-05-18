function ProgressBar(props) {
  return (
    <div className="w-full flex bg-gray-300 rounded-full h-4 items-center">
      <div
        style={{
          width: `${
            props.total ? (props.completedCount / props.total) * 100 : 0
          }%`,
        }}
        className={`h-full items-center text-sm bg-indigo-600 font-medium text-blue-100 text-center p-0.5 leading-none rounded-full cursor-pointer`}
      >
        {" "}
        {props.total
          ? Math.round((props.completedCount / props.total) * 100) + "%"
          : null}
      </div>
    </div>
  );
}

export default ProgressBar;
