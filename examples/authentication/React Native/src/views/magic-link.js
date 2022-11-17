import { Link } from '@react-navigation/native';
import { useState } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';
import altogic from '../configs/altogic';

function MagicLinkView() {
  const [email, setEmail] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function loginHandler() {
    try {
      setLoading(true);
      setError(null);

      const { errors: apiErrors } = await altogic.auth.sendMagicLinkEmail(email);
      setLoading(false);

      if (apiErrors) throw apiErrors;

      setEmail('');
      setSuccess('Email sent! Check your inbox.');
    } catch (error) {
      setError(error.items);
    }
  }

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
      <Button title="Send Magic Link" disabled={loading} onPress={loginHandler} />
      <Text style={styles.alreadyLabel}>Don't have an account yet?</Text>
      <Link style={styles.linkLabel} to="/sign-up">
        Create an account
      </Link>
      <Text style={styles.successLabel}>{success && success}</Text>
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

export default MagicLinkView;
