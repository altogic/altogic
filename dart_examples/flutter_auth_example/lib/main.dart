import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';
import 'package:flutter_auth_example/pages/email_verification_redirect.dart';
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
  await altogic.restoreLocalAuthSession();
  runApp(const AltogicAuthExampleApp());
}

class AltogicAuthExampleApp extends StatefulWidget {
  const AltogicAuthExampleApp({Key? key}) : super(key: key);

  @override
  State<AltogicAuthExampleApp> createState() => _AltogicAuthExampleAppState();
}

class _AltogicAuthExampleAppState extends AltogicState<AltogicAuthExampleApp> {
  @override
  void onEmailVerificationLink(
      BuildContext? context, EmailVerificationRedirect redirect) {
    if (context != null) {
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (c) =>
                  EmailVerificationRedirectPage(redirect: redirect)));
    }
  }

  @override
  void onMagicLink(BuildContext? context, MagicLinkRedirect redirect) {
    if (context != null) {
      Navigator.push(
          context,
          MaterialPageRoute(
              builder: (c) => MagicLinkRedirectPage(redirect: redirect)));
    }
  }

  @override
  void onOauthProviderLink(
      BuildContext? context, OauthRedirect redirect) async {
    await altogic.auth.getAuthGrant(redirect.token);
  }

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
    );
  }
}
