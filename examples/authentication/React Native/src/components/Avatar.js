import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import altogic from '../configs/altogic';
import { useAuthContext } from '../contexts/Auth.context';

function Avatar() {
  const { auth, setAuth } = useAuthContext();

  const [loading, setLoading] = useState(false);

  const handleUploadPhoto = async () => {
    try {
      let asset = null;
      const res = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        includeBase64: true
      });
      if (!res.didCancel && res.errorCode !== 'permission') {
        asset = res.assets[0];
      }
      if (!asset) {
        throw new Error('No valid file');
      }

      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName
      });

      setLoading(true);

      const { publicPath } = await uploadPhoto(formData, `user_${auth._id}`);
      await updateUserInfo({ profilePicture: publicPath });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPhoto = async (file, filename) => {
    const { data, errors } = await altogic.storage.bucket('root').upload(filename, file);

    if (errors) {
      throw errors;
    }
    return data;
  };

  const updateUserInfo = async (data) => {
    const { data: userFromDB, errors } = await altogic.db
      .model('users')
      .object(auth._id)
      .update(data);

    if (errors) {
      throw errors;
    }
    setAuth(userFromDB);
  };

  return (
    <View>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Image
            style={styles.tinyLogo}
            source={{
              uri:
                auth.profilePicture ||
                `https://ui-avatars.com/api/?name=${auth.email}&background=0D8ABC&color=fff`
            }}
          />
        )}
      </View>
      <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.5} onPress={handleUploadPhoto}>
        <Text style={styles.buttonTextStyle}>Change Avatar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 5
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16
  },
  tinyLogo: {
    width: 150,
    height: 150
  }
});

export default Avatar;
