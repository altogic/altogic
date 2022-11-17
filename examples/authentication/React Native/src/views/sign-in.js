import { Link } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet, Text } from 'react-native';
import altogic from '../configs/altogic';
import { useAuthContext } from '../contexts/Auth.context';

function SignInView({ navigation }) {
  const { setAuth, setSession } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    try {
      const { user, session, errors } = await altogic.auth.signInWithEmail(email, password);

      if (errors) {
        throw errors;
      }

      setSession(session);
      setAuth(user);
      navigation.navigate('Profile');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(val) => setEmail(val)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor="white"
        onChangeText={(val) => setPassword(val)}
        value={password}
      />
      <Button title="Login" onPress={handleSignIn} />
      <Text style={styles.alreadyLabel}>Don't have an account yet?</Text>
      <Link style={styles.linkLabel} to="/sign-up">
        Create an account
      </Link>
      <Text>{error && JSON.stringify(error, null, 3)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 55,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  successLabel: {
    color: 'green'
  },
  alreadyLabel: {
    marginTop: 20
  },
  linkLabel: {
    color: 'blue'
  }
});

export default SignInView;
