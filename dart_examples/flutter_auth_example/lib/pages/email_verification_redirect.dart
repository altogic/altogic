import 'dart:async';

import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';

import '../altogic.dart';

class EmailVerificationRedirectPage extends StatefulWidget {
  const EmailVerificationRedirectPage({Key? key, required this.redirect})
      : super(key: key);

  final EmailVerificationRedirect redirect;

  @override
  State<EmailVerificationRedirectPage> createState() =>
      _EmailRedirectPageState();
}

class _EmailRedirectPageState extends State<EmailVerificationRedirectPage> {
  UserSessionResult? userState;

  @override
  void initState() {
    if (widget.redirect.error == null) {
      altogic.auth.getAuthGrant(widget.redirect.token).then((value) {
        setState(() {
          userState = value;
        });
        if (value.user != null && value.session != null) {
          Timer(const Duration(seconds: 3), () {
            Navigator.pushNamed(context, '/home');
          });
        }
      });
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    Widget body;

    if (widget.redirect.error != null) {
      body = Text('ERROR: ${widget.redirect.error}');
    } else if (userState == null) {
      body = const CircularProgressIndicator();
    } else if (userState!.errors != null) {
      body = SingleChildScrollView(child: Text(userState!.errors!.toString()));
    } else if (userState!.user != null) {

      body =
          Text("Routing home...\n\nYour Data:\n\n${userState!.user!.toJson()}");
    } else {
      body = const Text("Unknown error");
    }

    return Scaffold(
      body: Center(
        child: body,
      ),
    );
  }
}
