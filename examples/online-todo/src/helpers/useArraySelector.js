import _ from "lodash";
import { useSelector } from "react-redux";

export default function useArraySelector(selector) {
  const object = useSelector(selector);
  const list = _.values(object);
  return list;
}
