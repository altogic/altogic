import { Button, ScrollView } from 'react-native';
import Avatar from '../components/Avatar';
import Sessions from '../components/Sessions';
import UserInfo from '../components/UserInfo';
import altogic from '../configs/altogic';
import { useAuthContext } from '../contexts/Auth.context';

function ProfileView({ navigation }) {
  const { setSession, setAuth } = useAuthContext();

  const handleSignOut = async () => {
    await altogic.auth.signOut();
    setAuth(null);
    setSession(null);
    navigation.navigate('Index');
  };

  return (
    <ScrollView>
      <Avatar />
      <UserInfo />
      <Sessions />
      <Button title="Sign Out" onPress={handleSignOut} />
    </ScrollView>
  );
}

export default ProfileView;
