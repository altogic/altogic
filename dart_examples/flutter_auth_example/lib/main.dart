import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';
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
  void onMagicLink(BuildContext? ctx, MagicLinkRedirect redirect) async {
    if (redirect.error != null) {
      // ignore: use_build_context_synchronously , because we dont use the this.context
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Magic link error: ${redirect.error}")));
      return;
    }

    var authGrant = await altogic.auth.getAuthGrant();
    if (authGrant.errors != null) {
      // ignore: use_build_context_synchronously , because we dont use the this.context
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Getting grant error: ${authGrant.errors}")));
      return;
    } else {
      if (ctx != null) {
        // ignore: use_build_context_synchronously , because we dont use the this.context
        Navigator.of(ctx).pushNamed('/profile');
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
