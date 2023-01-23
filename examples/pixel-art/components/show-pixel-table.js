import _ from "lodash";
import ShowCell from "./show-cell";

export default function ShowPixelTable({ data, size }) {
  return (
    <div>
      {_.map(data, (row, rowIndex) => (
        <div key={rowIndex} className="flex w-full">
          {_.map(row, (column, columnIndex) => (
            <div key={`${rowIndex},${columnIndex}`}>
              <ShowCell
                size={size}
                indexKey={`${rowIndex},${columnIndex}`}
                color={column?.color}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
