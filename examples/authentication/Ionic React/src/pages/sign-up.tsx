import { IonItem } from "@ionic/react";
import type { ErrorEntry } from "altogic";
import { useState } from "react";
import { RouteComponentProps } from "react-router";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

const SignUpView: React.FC<RouteComponentProps> = ({ history }) => {
  const context = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<ErrorEntry[] | null>(null);

  const handleSignUp = async (e: any) => {
    e.preventDefault();
    const [name, email, password] = e.target;
    try {
      setLoading(true);
      const { user, session, errors } = await altogic.auth.signUpWithEmail(
        email.value,
        password.value,
        name.value
      );

      if (errors) {
        throw errors;
      }

      if (session) {
        context?.setAuth(user);
        context?.setSession(session);
        history.push("/profile");
      } else {
        setSuccess(`We sent a verification link to ${email.value}`);
        setErrors(null);
        setLoading(false);
        name.value = "";
        email.value = "";
        password.value = "";
      }
    } catch (err: any) {
      setSuccess("");
      setErrors(err.items);
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center h-96 gap-4">
      <form
        className="flex flex-col gap-2 w-full md:w-96"
        onSubmit={handleSignUp}
      >
        <h1 className="self-start text-3xl font-bold">Create an account</h1>
        {success && (
          <div className="bg-green-500 text-white p-2">{success}</div>
        )}
        {errors && (
          <div className="bg-red-600 text-white text-[13px] p-2">
            {errors?.map(({ message }) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        )}

        <input
          className="text-black"
          type="text"
          placeholder="Type your name"
        />
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
          <IonItem className="text-indigo-600" routerLink="/sign-in">
            Already have an account?
          </IonItem>
          <button
            disabled={loading}
            type="submit"
            className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
          >
            Register
          </button>
        </div>
      </form>
    </section>
  );
};

export default SignUpView;
