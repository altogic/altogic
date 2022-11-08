import 'dart:async';

import 'package:flutter/material.dart';

import '../altogic.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  Future<void> init() async {
    await Future.delayed(const Duration(milliseconds: 500));
    final user = altogic.auth.currentState.user;
    if (user != null) {
      if (mounted) Navigator.pushReplacementNamed(context, '/homepage');
    } else {
      if (mounted) Navigator.pushReplacementNamed(context, '/sign-in');
    }
  }

  @override
  void initState() {
    init();
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
