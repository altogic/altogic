import altogic from "./altogic";
export const PROFILE_PICTURES = "profilePictures";

export const createBucketForProfilePictures = async () => {
  try {
    if (!(await altogic.storage.bucket(PROFILE_PICTURES).exists().data)) {
      return altogic.storage.createBucket(PROFILE_PICTURES, true);
    }
  } catch (error) {
    console.error(error);
  }
};

export const uploadProfilePicture = async (picture) => {
  try {
    if (altogic.auth.getUser().profilePicture) {
      // Checking the source of the profile photo
      if (altogic.auth.getUser().profilePicture.includes("c1-na.altogic.com")) {
        await altogic.storage
          .bucket(PROFILE_PICTURES)
          .deleteFiles([`profile_picture-${altogic.auth.getUser()._id}`]);
      }
    }
    return await altogic.storage
      .bucket(PROFILE_PICTURES)
      .upload(`profile_picture-${altogic.auth.getUser()._id}`, picture, {
        createBucket: true,
      });
  } catch (error) {
    console.error(error);
  }
};

export const updateProfilePictureFieldOnDatabase = async (pictureLink) => {
  try {
    return await altogic.db
      .model("users")
      .object(altogic.auth.getUser()._id)
      .update({ profilePicture: pictureLink });
  } catch (error) {
    console.error(error);
  }
};

export const deleteProfilePictureFieldOnDatabase = async () => {
  try {
    await altogic.db
      .model("users")
      .object(altogic.auth.getUser()._id)
      .updateFields([{ field: "profilePicture", updateType: "unset" }]);
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async () => {
  try {
    const resp = await altogic.auth.getUserFromDB();
    if (resp.errors === null) {
      altogic.auth.setUser(resp.user);
    }
  } catch (error) {
    console.error(error);
  }
};

export const removeProfilePhoto = async () => {
  try {
    return await altogic.storage
      .bucket(PROFILE_PICTURES)
      .deleteFiles([`profile_picture-${altogic.auth.getUser()._id}`]);
  } catch (error) {
    console.error(error);
  }
};
