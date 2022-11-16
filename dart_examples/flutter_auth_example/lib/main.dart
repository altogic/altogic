import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';
import 'package:flutter_auth_example/pages/magic_link.dart';
import 'package:flutter_auth_example/pages/profile_page.dart';

import 'altogic.dart';
import 'pages/sign_in.dart';
import 'pages/sign_up.dart';
import 'pages/splash.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  altogic.auth.authStateChanges.listen((event) {
    debugPrint("Auth State : $event");
  });

  await altogic.restoreAuthSession();
  runApp(const AltogicAuthExampleApp());
}

class AltogicAuthExampleApp extends StatefulWidget {
  const AltogicAuthExampleApp({Key? key}) : super(key: key);

  @override
  State<AltogicAuthExampleApp> createState() => _AltogicAuthExampleAppState();
}

class _AltogicAuthExampleAppState extends AltogicState<AltogicAuthExampleApp> {
  @override
  void onMagicLink(BuildContext? context, MagicLinkRedirect redirect) async {
    var authGrant = await altogic.auth.getAuthGrant();
    if (authGrant.errors != null) {
      // Show a snackbar with the error
    } else {
      if (context != null) {
        Navigator.of(context).pushNamed('/profile');
      }
    }
  }

  @override
  void onEmailChangeLink(BuildContext? context, ChangeEmailRedirect redirect) {}

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      navigatorObservers: [navigatorObserver],
      routes: {
        '/': (c) => const SplashScreen(),
        '/profile': (c) => const ProfilePage(),
        '/sign-in': (c) => const SignInPage(),
        '/sign-up': (c) => const SignUpPage(),
      },
      onGenerateInitialRoutes: (String initialRoute) {
        var uri = Uri.parse(initialRoute);

        if (uri.path == "/profile") {
          if (altogic.auth.currentState.isLoggedIn) {
            return [
              MaterialPageRoute(
                  builder: (c) => const ProfilePage(),
                  settings: const RouteSettings(name: "/profile"))
            ];
          } else {
            return [
              MaterialPageRoute(
                  builder: (c) => const SignInPage(),
                  settings: const RouteSettings(name: "/sign-in"))
            ];
          }
        }

        return [
          MaterialPageRoute(
            builder: (context) => const SplashScreen(),
          ),
        ];
      },
    );
  }
}
