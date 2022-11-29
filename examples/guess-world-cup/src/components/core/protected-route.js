import _ from "lodash";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function Private({ children, mustHasLeague }) {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const hasLeague = user?.leagues && !_.isEmpty(user?.leagues);

  useEffect(() => {
    if (user === null) {
      navigate("/");
    } else if (mustHasLeague && !hasLeague) {
      navigate("/");
    }
  }, [user]);

  return <div>{user ? children : <div />}</div>;
}

export function Public({ children }) {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const hasLeague = user?.leagues && !_.isEmpty(user?.leagues);

  useEffect(() => {
    if (user) {
      navigate(hasLeague ? `/league/${_.first(user?.leagues).slug}` : "/");
    }
  }, [user]);

  return <div>{user ? <div /> : children}</div>;
}
