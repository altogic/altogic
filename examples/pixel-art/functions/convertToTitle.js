import _ from "lodash";

export default function convertToTitle(text) {
  return _.isNil(text)
    ? null
    : _(text)
        .replace("-", " ")
        .replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
}
