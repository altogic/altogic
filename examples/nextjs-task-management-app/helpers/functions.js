export function toDateInputValue(date) {
  var local = new Date(date);
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
}

export function convertToHumeanReadableDate(date) {
  return new Date(date).toDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function pad(num) {
  num = num.toString();
  while (num.length < 2) num = "0" + num;
  return num;
}
