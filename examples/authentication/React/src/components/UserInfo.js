import { useRef, useState } from "react";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

function UserInfo() {
  const { auth, setAuth } = useAuthContext();
  const inputRef = useRef();

  const [name, setName] = useState("");

  const [changeMode, setChangeMode] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleNameChange = () => {
    setChangeMode(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 100);
  };

  const handleKeyDown = async (e) => {
    if (e.code === "Enter") {
      setErrors(null);

      const { data: updatedUser, errors: apiErrors } = await altogic.db
        .model("users")
        .object(auth._id)
        .update({ name });

      if (apiErrors) setErrors(apiErrors.items[0].message);
      else setAuth(updatedUser);

      setChangeMode(false);
    }
  };

  return (
    <section className="border p-4 w-full">
      {changeMode ? (
        <div className="flex items-center justify-center">
          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            type="text"
            className="border-none text-3xl text-center"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-3xl">Hello, {auth?.name}</h1>
          <button onClick={handleNameChange} className="border p-2">
            Change name
          </button>
        </div>
      )}
      {errors && <div>{errors}</div>}
    </section>
  );
}

export default UserInfo;
