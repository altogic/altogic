import Link from "next/link";

function IndexView() {
  return (
    <div className="flex items-center justify-center gap-4 h-screen">
      <Link class="border px-4 py-2 font-medium text-xl" href="/magic-link">
        Login With Magic Link
      </Link>
      <Link class="border px-4 py-2 font-medium text-xl" href="/sign-in">
        Sign In
      </Link>
      <Link class="border px-4 py-2 font-medium text-xl" href="/sign-up">
        Sign Up
      </Link>
    </div>
  );
}
export default IndexView;
