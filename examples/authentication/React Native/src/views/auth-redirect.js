import { useEffect } from 'react';
import { Text, View } from 'react-native';
import altogic from '../configs/altogic';
import { useAuthContext } from '../contexts/Auth.context';

function AuthRedirectView({ route, navigation }) {
  const { setAuth, setSession } = useAuthContext();
  const access_token = route.params?.access_token;

  const handleToken = async () => {
    try {
      const { user, session, errors } = await altogic.auth.getAuthGrant(access_token);

      if (errors) throw errors;

      setAuth(user);
      setSession(session);
      navigation.navigate('Profile');
    } catch (error) {
      navigation.navigate('Index');
    }
  };

  useEffect(() => {
    handleToken();
  }, []);

  return (
    <View>
      <Text>Redirecting...</Text>
    </View>
  );
}

export default AuthRedirectView;
