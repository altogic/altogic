import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuthContext } from '../contexts/Auth.context';

function PrivateRoute({ children, navigation }) {
  const { auth, session } = useAuthContext();

  useEffect(() => {
    if (auth === null || session === null) {
      // Navigate to sign in, if the user has not session or don't come from magic link
      navigation.navigate('Index');
    }
  }, [auth]);

  return (
    <View>
      {auth === undefined || session === undefined ? (
        <Text>Loading...</Text>
      ) : auth ? (
        children
      ) : (
        <Text>You are redirecting to the login...</Text>
      )}
    </View>
  );
}

export default PrivateRoute;
