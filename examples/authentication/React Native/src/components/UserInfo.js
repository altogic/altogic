import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import altogic from '../configs/altogic';
import { useAuthContext } from '../contexts/Auth.context';

function UserInfo() {
  const { auth, setAuth } = useAuthContext();
  const [changeMode, setChangeMode] = useState(true);
  const [errors, setErrors] = useState(null);

  const [name, setName] = useState(auth.name);

  const handleNameChange = () => {
    if (!changeMode && auth.name !== name) {
      changeName();
    }
    setChangeMode(!changeMode);
  };

  const changeName = async () => {
    setErrors(null);
    const { data: updatedUser, errors: apiErrors } = await altogic.db
      .model('users')
      .object(auth._id)
      .update({ name });
    if (apiErrors) setErrors(apiErrors.items[0].message);
    else setAuth(updatedUser);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {changeMode ? (
          <Text style={styles.text}>Hello, {auth?.name}</Text>
        ) : (
          <TextInput type="text" style={styles.input} onChangeText={setName} value={name} />
        )}
        <Button title={changeMode ? 'Change name' : 'Update name'} onPress={handleNameChange} />
      </View>
      {errors && <Text>{errors}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 1,
    marginTop: 12,
    height: 100
  },
  inputContainer: {
    flex: 1,
    padding: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    width: '100%',
    textAlign: 'center',
    fontSize: 25
  },
  input: {
    borderWidth: 1,
    borderColor: 'blue',
    width: '100%',
    textAlign: 'center',
    fontSize: 25
  }
});

export default UserInfo;
