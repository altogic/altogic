import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';
import 'package:fodcast_app/services/auth_service.dart';
import 'package:fodcast_app/services/podcast_service.dart';
import 'package:fodcast_app/services/user_service.dart';
import 'package:fodcast_app/utils/constants.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final AuthService _authService = AuthService();

  @override
  void initState() {
    super.initState();

    Future.delayed(const Duration(seconds: 2), () {
      _checkAuthentication(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FlutterLogo(
              size: 64.0,
            ),
            SizedBox(height: 16.0),
            Text(
              'Podcast App',
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 32.0),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }

  Future<void> _checkAuthentication(BuildContext context) async {
    if (_authService.isLoggedIn) {
      await PodcastService().loadSubscribed();
      await UserService().getUserInterests();
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, Constants.homeRoute);
    } else {
      final redirect = await AltogicState.applicationInitialRedirect;
      if (redirect != null) return;
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, Constants.loginRoute);
    }
  }
}
