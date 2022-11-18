import type { User } from "altogic";
import { useState } from "react";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

const UserInfo = () => {
  const context = useAuthContext();

  const [name, setName] = useState("");

  const [changeMode, setChangeMode] = useState(true);
  const [error, setError] = useState("");

  const handleNameChange = () => {
    if (!changeMode && context?.auth?.name !== name) {
      changeName();
    }
    setChangeMode(!changeMode);
  };

  const changeName = async () => {
    setError("");
    const { data: updatedUser, errors: apiErrors } = await altogic.db
      .model("users")
      .object(context?.auth?._id)
      .update({ name });
    if (apiErrors) setError(apiErrors.items[0].message);
    else context?.setAuth(updatedUser as User);
  };

  return (
    <section className="border p-4 w-full">
      <div className="space-y-4">
        {changeMode ? (
          <h1 className="text-3xl">Hello, {context?.auth?.name}</h1>
        ) : (
          <input
            type="text"
            className="border-none text-3xl text-center text-black"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        )}

        <button onClick={handleNameChange} className="border p-2">
          {changeMode ? "Change name" : "Update name"}
        </button>
      </div>

      {error && <div>{error}</div>}
    </section>
  );
};

export default UserInfo;
