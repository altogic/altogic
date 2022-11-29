import _ from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { authActions } from "../../redux/auth/authSlice";
import InputPhoto from "../inputs/input-photo";

export default function SettingsPhotoForm() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;

    setIsLoading(true);
    setError(null);

    dispatch(
      authActions.uploadProfilePictureRequest({
        userId: user?._id,
        file,
        onSuccess: () => {
          toast.success("Profile picture updated successfully");
          setIsLoading(false);
        },
        onFailure: (errorList) => {
          setError(_.get(errorList, "items[0]"));
          setIsLoading(false);
        },
      })
    );
  };

  const handleDeleteFile = () => {
    setIsLoading(true);
    dispatch(
      authActions.deleteProfilePictureRequest({
        userId: user?._id,
        onSuccess: () => {
          toast.success("Profile picture deleted successfully");
          setIsLoading(false);
        },
        onFailure: (errorList) => {
          setError(_.get(errorList, "items[0]"));
          setIsLoading(false);
        },
      })
    );
  };

  return (
    <div className="shadow sm:rounded-md sm:overflow-hidden">
      <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Profile Picture
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <InputPhoto
            defaultAvatar
            loading={isLoading}
            onChange={handleFileChange}
            onDelete={handleDeleteFile}
            value={user?.profilePicture}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
