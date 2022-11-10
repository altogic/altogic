import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';
import 'package:flutter_auth_example/pages/home_page.dart';
import 'package:flutter_auth_example/pages/magic_link.dart';

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
  void onMagicLink(BuildContext? context, MagicLinkRedirect redirect) {

    if (context != null) {
      Navigator.of(context).push(MaterialPageRoute(
          builder: (c) => MagicLinkRedirectPage(redirect: redirect)));
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
        '/homepage': (c) => const HomePage(),
        '/sign-in': (c) => const SignInPage(),
        '/sign-up': (c) => const SignUpPage(),
      },
      onGenerateInitialRoutes: (String initialRoute) {
        var uri = Uri.parse(initialRoute);

        if (uri.path == "/homepage") {
          if (altogic.auth.currentState.isLoggedIn) {
            return [
              MaterialPageRoute(
                  builder: (c) => const HomePage(),
                  settings: const RouteSettings(name: "/homepage"))
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
