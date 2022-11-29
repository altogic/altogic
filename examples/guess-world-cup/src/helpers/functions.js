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

  getResult(home, away) {
    if (home > away) return "home";
    else if (away > home) return "away";
    else return "draw";
  },
};

export default functions;
