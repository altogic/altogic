import 'dart:async';

import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';

import '../altogic.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Future<void> init() async {
    if (mounted) {
      var launchedRedirect = await AltogicState.applicationInitialRedirect;
      if (launchedRedirect != null) {
        return;
      }
    }
    final user = altogic.auth.currentState.user;

    if (user != null) {
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/profile');
      }
    } else {
      if (mounted) Navigator.pushReplacementNamed(context, '/sign-in');
    }
  }

  @override
  void initState() {
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      init();
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
