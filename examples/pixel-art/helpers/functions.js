import _ from "lodash";

const functions = {
  convertToTitle: (text) => {
    return _(text)
      .replace("-", " ")
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
  },

  getCutName: (name) => {
    return `${Array.from(name)[0].toUpperCase()}.${Array.from(
      name
    )[1].toUpperCase()}.`;
  },

  createSlug: (name, index) => {
    return _.replace(_.toLower(name), " ", "-") + "-" + index;
  },
};

export default functions;
