import { useEffect, useState } from "react";
import { useContext } from "react";
import {
  uploadProfilePicture,
  updateProfilePictureFieldOnDatabase,
  updateUser,
  removeProfilePhoto,
  deleteProfilePictureFieldOnDatabase,
} from "../helpers/storage";
import altogic from "../helpers/altogic";

import PrimaryButton from "../components/Buttons/PrimaryButton";
import { ModalContext } from "../context/ModalContext";
import SecondaryButton from "../components/Buttons/SecondaryButton";

const ProfileInfo = () => {
  const modalContext = useContext(ModalContext);
  const [profilePicture, setProfilePicture] = useState(
    require("../images/pp_blank.png")
  );
  const name = altogic.auth.getUser().name;

  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    if (altogic.auth.getUser().profilePicture) {
      setProfilePicture(altogic.auth.getUser().profilePicture);
    }
  }, [altogic.auth.getUser().profilePicture]);

  const handleFileSelect = async (event) => {
    setLoading(true);
    await handleFileUpload(event.target.files[0]);
  };

  const handleFileUpload = async (file) => {
    const resp = await uploadProfilePicture(file);
    setLoading(false);

    if (resp.errors === null) {
      const updateResponse = await updateProfilePictureFieldOnDatabase(
        resp.data.publicPath
      );
      if (updateResponse.errors === null) {
        await updateUser();
        await modalContext.openModal(
          "Your profile photo has been updated!",
          "success"
        );
      } else {
        await modalContext.openModal(
          updateResponse.errors.items[0].message,
          "error"
        );
      }
    } else {
      await modalContext.openModal(resp.errors.items[0].message, "error");
    }
  };

  const removePhoto = async () => {
    setRemoveLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRemoveLoading(false);
    const resp = await removeProfilePhoto();
    if (resp.errors === null) {
      await deleteProfilePictureFieldOnDatabase();
      await updateUser();
      setProfilePicture(require("../images/pp_blank.png"));
      await modalContext.openModal(
        "Your profile photo has been deleted!",
        "success"
      );
    } else {
      await modalContext.openModal(resp.errors.items[0].message, "error");
    }
  };

  return (
    <div className="bg-slate-100 relative mt-10">
      <div className="relative z-10 w-full h-full p-7 md:p-0 flex justify-center items-center">
        <div className="flex flex-col items-center w-96 bg-white rounded-2xl shadow-lg overflow-hidden">
          <br className="w-full mt-6" /> <br className="w-full mt-6" />
          <div className="relative w-full">
            <div className="pb-40%" />
          </div>
          <div className="flex flex-col items-center -mt-14">
            {profilePicture === require("../images/pp_blank.png") ? (
              <img
                alt="Profile"
                src={profilePicture}
                className="mt-5 relative z-0 border-6 border-white h-20"
              />
            ) : (
              <img
                alt="Uploaded Profile"
                src={profilePicture}
                className="mt-5 relative z-0 rounded-full border-6 border-white h-24 w-24"
              />
            )}

            <div className="flex mt-2">
              <h3 className="font-body font-bold text-blue-500 text-lg">
                {name ? name.toUpperCase() : altogic.auth.getUser().email}
              </h3>
            </div>
            <div className="text-slate-400 mb-4">
              {altogic.auth.getUser().provider.charAt(0).toUpperCase() +
                altogic.auth.getUser().provider.slice(1)}
            </div>

            <hr className="w-full mb-3" />
            {profilePicture === require("../images/pp_blank.png") ? (
              <PrimaryButton
                loading={loading}
                content="Upload Profile Photo"
                component={
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    className="cursor-pointer absolute block py-2 px-4 opacity-0"
                    onChange={handleFileSelect}
                  />
                }
              />
            ) : (
              <>
                <>
                  <PrimaryButton
                    loading={loading}
                    content="Change Profile Photo"
                    component={
                      <input
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        className="cursor-pointer absolute block py-2 px-4 opacity-0"
                        onChange={handleFileSelect}
                      />
                    }
                  />
                  <SecondaryButton
                    loading={removeLoading}
                    content="Remove Profile Photo"
                    customClickEvent={removePhoto}
                  />
                </>
              </>
            )}
          </div>
          <hr className="w-full mt-7" />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
