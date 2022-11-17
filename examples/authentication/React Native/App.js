import React from 'react';
import { Text } from 'react-native';
import AuthProvider from './src/contexts/Auth.context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrivateRoute from './src/components/PrivateRoute';

import AuthRedirectView from './src/views/auth-redirect';
import IndexView from './src/views/index';
import MagicLinkView from './src/views/magic-link';
import ProfileView from './src/views/profile';
import SignInView from './src/views/sign-in';
import SignUpView from './src/views/sign-up';

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    // Public Routes
    Index: '/',
    AuthRedirect: '/auth-redirect/:access_token?',
    MagicLink: '/magic-link',
    SignIn: '/sign-in',
    SignUp: '/sign-up',
    // Private Routes
    Profile: '/profile'
  }
};

const linking = {
  prefixes: ['myapp://'],
  config
};

function App() {
  return (
    <AuthProvider>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Stack.Navigator>
          {/* Private Routes */}
          <Stack.Screen
            name="Profile"
            options={{
              headerLeft: () => null,
              headerBackVisible: false
            }}
          >
            {(props) => (
              <PrivateRoute {...props}>
                <ProfileView {...props} />
              </PrivateRoute>
            )}
          </Stack.Screen>
          {/* Public Routes */}
          <Stack.Screen
            name="Index"
            options={{
              headerLeft: () => null,
              headerBackVisible: false
            }}
            component={IndexView}
          />
          <Stack.Screen name="MagicLink" component={MagicLinkView} />
          <Stack.Screen name="SignUp" component={SignUpView} />
          <Stack.Screen name="SignIn" component={SignInView} />
          <Stack.Screen name="AuthRedirect" component={AuthRedirectView} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
