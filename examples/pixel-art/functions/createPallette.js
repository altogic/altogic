import _ from "lodash";

export default function createPallette(size) {
  return _.map(new Array(size), (row, rowIndex) =>
    _.map(new Array(size), (column, columnIndex) => ({
      y: rowIndex,
      x: columnIndex,
      color: "#fff",
    }))
  );
}
