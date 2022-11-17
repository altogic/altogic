import { Link } from "react-router-dom";

function IndexView() {
  return (
    <div className="flex items-center justify-center gap-4 h-screen">
      <Link className="border px-4 py-2 font-medium text-xl" to="/magic-link">
        Login With Magic Link
      </Link>
      <Link className="border px-4 py-2 font-medium text-xl" to="/sign-in">
        Sign In
      </Link>
      <Link className="border px-4 py-2 font-medium text-xl" to="/sign-up">
        Sign Up
      </Link>
    </div>
  );
}
export default IndexView;
