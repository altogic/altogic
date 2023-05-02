import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fodcast_app/models/episode.dart';
import 'package:fodcast_app/screens/episode_screen.dart';
import 'package:fodcast_app/screens/home_screen.dart';
import 'package:fodcast_app/screens/login_screen.dart';
import 'package:fodcast_app/screens/podcast_screen.dart';
import 'package:fodcast_app/screens/profile_screen.dart';
import 'package:fodcast_app/screens/signup_screen.dart';
import 'package:fodcast_app/utils/altogic_service.dart';
import 'package:fodcast_app/utils/audio_manager.dart';
import 'package:fodcast_app/utils/constants.dart';
import 'package:provider/provider.dart';

import 'screens/splash_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await altogic.restoreAuthSession();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
  ));
  SystemChrome.setPreferredOrientations(
      [DeviceOrientation.portraitUp, DeviceOrientation.portraitDown]);

  runApp(
    ChangeNotifierProvider(
      create: (_) => AudioManager(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatefulWidget {
  /* final AuthService _authService = AuthService(); */

  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends AltogicState<MyApp> {
  @override
  void onEmailVerificationLink(
      BuildContext context, EmailVerificationRedirect redirect) async {
    //ignore_for_file: curly_braces_in_flow_control_structures
    if (redirect.error != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(redirect.error!),
        ),
      );
    } else {
      final auth = await altogic.auth.getAuthGrant(redirect.token);
      if (auth.errors != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(auth.errors!.toJson().toString()),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Email verified successfully'),
          ),
        );
        await Future.delayed(const Duration(seconds: 1));
        Navigator.of(context).pushReplacementNamed(Constants.splashRoute);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorObservers: [navigatorObserver],
      title: 'Podcast App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
      ),
      initialRoute: Constants.splashRoute,
      routes: {
        Constants.homeRoute: (_) {
          return const HomeScreen();
        },
        Constants.loginRoute: (_) => const LoginScreen(),
        Constants.signupRoute: (_) => const SignUpScreen(),
        Constants.profileRoute: (_) => const ProfileScreen(),
        Constants.splashRoute: (_) => const SplashScreen()

        // Add more routes here
      },
      onGenerateRoute: (settings) {
        final Uri uri = Uri.parse(settings.name!);

        if (uri.pathSegments.length == 2 &&
            uri.pathSegments.first == 'podcasts') {
          final podcastId = uri.pathSegments.last;
          return MaterialPageRoute(
            builder: (_) => PodcastScreen(podcastId: podcastId),
          );
        } else if (uri.pathSegments.length == 1 &&
            uri.pathSegments.first == 'episodes' &&
            settings.arguments != null) {
          final episode = settings.arguments as Episode;
          return MaterialPageRoute(
            builder: (_) => EpisodeScreen(episode: episode),
          );
        }

        return null;
      },
      onUnknownRoute: (_) => MaterialPageRoute(
        builder: (_) => const Scaffold(
          body: Center(
            child: Text('Page not found.'),
          ),
        ),
      ),
    );
  }
}
