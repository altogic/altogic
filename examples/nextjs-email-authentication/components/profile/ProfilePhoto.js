import Image from "next/image";
import React from "react";
import { Fragment } from "react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { altogic } from "../../helpers/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function ProfilePhoto(props) {
  const context = useContext(UserContext);
  const [profilePictureUrl, setProfilePictureUrl] =
    useState("/blankPhoto.jpeg");
  const [photoChanged, setphotoChanged] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!photoChanged && props.profilePicture != null) {
      setProfilePictureUrl(props.profilePicture);
    }
  }, [profilePictureUrl, props.profilePicture, photoChanged]);

  async function removeProfilePhotoHandler() {
    await altogic.storage.deleteFile(profilePictureUrl);
    await context.profilePicChanged("resultOfUpload.data.publicPath", true);
    setphotoChanged(true);
    setProfilePictureUrl("/blankPhoto.jpeg");
  }
  async function handleChange(event) {
    await photoUploadHandler(event.target.files[0]);
  }

  async function photoUploadHandler(image) {
    if (image != null) {
      const fileName = "photo" + context.user._id;
      let resultOfUpload;
      setphotoChanged(true);
      setUploading(true);
      if (context.user?.profilePicture) {
        //This lines delete the file and uploads a new one.

        await altogic.storage.deleteFile(profilePictureUrl);
        resultOfUpload = await altogic.storage
          .bucket("profilePictures")
          .upload(fileName, image);
      } else {
        //There is not a profile picture yet.
        //This line uploads a file to the bucket named "profilePictures" and creates the bucket if it doesn't exists.
        resultOfUpload = await altogic.storage
          .bucket("profilePictures")
          .upload(fileName, image, {
            createBucket: true,
            isPublic: true
          });
      }
      if (resultOfUpload.data) {
        await context.profilePicChanged(resultOfUpload.data.publicPath, false);
        setProfilePictureUrl(resultOfUpload.data.publicPath);
        setUploading(false);
      }
    }
  }

  return (
    <div>
      <div className="flex items-start justify-center z-10">
        <Image
          className="object-cover rounded-full z-0 "
          src={profilePictureUrl}
          alt="Current profile photo"
          width={100}
          height={100}
        ></Image>

        {profilePictureUrl != "/blankPhoto.jpeg" ? (
          <button
            className="z-90 object-right-top "
            onClick={removeProfilePhotoHandler}
          >
            <FontAwesomeIcon
              className="ml-2 "
              icon={faCircleXmark}
              size={"1x"}
              color="red"
            />
          </button>
        ) : (
          <></>
        )}
      </div>

      <div className=" btn-group mt-4 text-center ">
        <button className="my-2  text-sm whitespace-nowrap inline-flex items-center justify-center text-center px-4 py-2 border border-transparent rounded-md shadow-sm  font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          Upload Profile Picture
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            className="cursor-pointer absolute py-2 opacity-0 pin-r pin-t"
            onChange={handleChange}
          />
          {uploading && (
            <FontAwesomeIcon
              className="ml-2"
              icon={faSpinner}
              size={"1x"}
              spin
            />
          )}
        </button>
      </div>
    </div>
  );
}

export default ProfilePhoto;
