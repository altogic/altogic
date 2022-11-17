import { Link } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';

function IndexView() {
  return (
    <View style={styles.container}>
      <Link style={styles.link} to="/magic-link">
        Login With Magic Link
      </Link>
      <Link style={styles.link} to="/sign-in">
        Sign In
      </Link>
      <Link style={styles.link} to="/sign-up">
        Sign Up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    fontSize: 45
  },
  link: {
    fontSize: 25,
    padding: 12
  }
});
export default IndexView;
