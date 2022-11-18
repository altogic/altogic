import type { User } from "altogic";
import { useState } from "react";
import altogic from "../configs/altogic";
import { useAuthContext } from "../contexts/Auth.context";

const Avatar = () => {
  const context = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;
    try {
      setLoading(true);
      setError("");
      const { publicPath } = (await updateProfilePicture(file)) as any;
      const updatedUser = await updateUser({ profilePicture: publicPath });
      context?.setAuth(updatedUser);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const updateProfilePicture = async (file: any) => {
    const { data, errors } = await altogic.storage
      .bucket("root")
      .upload(`user_${context?.auth?._id}`, file);
    if (errors) throw new Error("Couldn't upload file");
    return data;
  };
  const updateUser = async (data: any) => {
    const { data: updatedUser, errors } = await altogic.db
      .model("users")
      .object(context?.auth?._id)
      .update(data);
    if (errors) throw new Error("Couldn't update user");
    return updatedUser as User;
  };

  return (
    <div>
      <figure className="flex flex-col gap-4 items-center justify-center py-2">
        <picture className="border rounded-full w-24 h-24 overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src={
              context?.auth?.profilePicture ||
              `https://ui-avatars.com/api/?name=${context?.auth?.name}&background=0D8ABC&color=fff`
            }
            alt={context?.auth?.name}
          />
        </picture>
      </figure>
      <div className="flex flex-col gap-4 justify-center items-center">
        <label className="border p-2 cursor-pointer">
          <span>{loading ? "Uploading..." : "Change Avatar"}</span>

          <input
            disabled={loading}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        {error && <div className="bg-red-500 p-2 text-white">{error}</div>}
      </div>
    </div>
  );
};

export default Avatar;
