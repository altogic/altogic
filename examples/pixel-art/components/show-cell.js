import cs from "classnames";

export default function ShowCell({ indexKey, color, size }) {
  return (
    <div
      id={indexKey}
      style={{
        backgroundColor: color,
      }}
      className={cs([
        "border border-gray-100",
        "w-full h-full",
        size === 16 && "w-4 h-4",
        size === 32 && "w-2 h-2",
        size === 48 && "w-[0.33rem] h-[0.33rem]",
        size === 64 && "w-1 h-1",
      ])}
    />
  );
}
