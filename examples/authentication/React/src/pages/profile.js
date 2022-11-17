import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import Sessions from "../components/Sessions";
import UserInfo from "../components/UserInfo";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

function ProfileView() {
  const { setAuth, setSession } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { errors } = await altogic.auth.signOut();

      if (errors) {
        throw errors;
      }

      setSession(null);
      setAuth(null);
      navigate("/sign-in");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="h-screen py-4 space-y-4 flex flex-col text-center items-center">
      <Avatar />
      <UserInfo />
      <Sessions />
      <button
        className="bg-gray-400 rounded py-2 px-3 text-white"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </section>
  );
}

export default ProfileView;
