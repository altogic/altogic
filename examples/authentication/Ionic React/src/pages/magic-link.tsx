import { IonItem } from "@ionic/react";
import type { ErrorEntry } from "altogic";
import { useState } from "react";
import altogic from "../configs/altogic";

const MagicLinkView = () => {
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState<ErrorEntry[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function loginHandler(e: any) {
    e.preventDefault();
    const [email] = e.target;
    setLoading(true);
    setErrors(null);

    const { errors: apiErrors } = await altogic.auth.sendMagicLinkEmail(
      email.value
    );
    setLoading(false);

    if (apiErrors) {
      setErrors(apiErrors.items);
    } else {
      email.value = "";
      setSuccess("Email sent! Check your inbox.");
    }
  }

  return (
    <section className="flex flex-col items-center justify-center h-96 gap-4">
      <form
        className="flex flex-col gap-2 w-full md:w-96"
        onSubmit={loginHandler}
      >
        <h1 className="self-start text-3xl font-bold">Login with magic link</h1>
        {success && (
          <div className="bg-green-600 text-white text-[13px] p-2">
            {success}
          </div>
        )}
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
        <div className="flex justify-between gap-4">
          <IonItem className="text-indigo-600" routerLink="/sign-up">
            Don't have an account? Register now
          </IonItem>
          <button
            disabled={loading}
            type="submit"
            className="border py-2 px-3 border-gray-500 hover:bg-gray-500 hover:text-white transition shrink-0"
          >
            Send magic link
          </button>
        </div>
      </form>
    </section>
  );
};

export default MagicLinkView;
