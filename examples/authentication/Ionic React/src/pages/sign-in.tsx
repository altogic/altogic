import { IonItem } from "@ionic/react";
import { RouteComponentProps } from "react-router";
import type { ErrorEntry } from "altogic";
import { useState } from "react";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

const SignInView: React.FC<RouteComponentProps> = ({ history }) => {
  const context = useAuthContext();

  const [errors, setErrors] = useState<ErrorEntry[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: any) => {
    e.preventDefault();
    const [email, password] = e.target;
    try {
      setLoading(true);
      const { user, session, errors } = await altogic.auth.signInWithEmail(
        email.value,
        password.value
      );

      if (errors) {
        throw errors;
      }

      context?.setAuth(user);
      context?.setSession(session);
      history.push("/profile");
    } catch (err: any) {
      setLoading(false);
      setErrors(err.items);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-96 gap-4">
      <form
        className="flex flex-col gap-2 w-full md:w-96"
        onSubmit={handleSignIn}
      >
        <h1 className="self-start text-3xl font-bold">Login to your account</h1>
        {errors && (
          <div className="bg-red-600 text-white text-[13px] p-2">
            {errors.map(({ message }) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}

        <input
          className="text-black"
          type="email"
          placeholder="Type your email"
        />
        <input
          className="text-black"
          autoComplete="new-password"
          type="password"
          placeholder="Type your password"
        />
        <div className="flex justify-between gap-4">
          <IonItem className="text-indigo-600" routerLink="/sign-up">
            Don't have an account? Register now
          </IonItem>
          <button
            disabled={loading}
            type="submit"
            className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
          >
            Login
          </button>
        </div>
      </form>
    </section>
  );
};

export default SignInView;
