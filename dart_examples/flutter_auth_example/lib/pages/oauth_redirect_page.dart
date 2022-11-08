import 'dart:async';

import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';

import '../altogic.dart';

class OauthRedirectPage extends StatefulWidget {
  const OauthRedirectPage({Key? key, required this.redirect}) : super(key: key);

  final OauthRedirect redirect;

  @override
  State<OauthRedirectPage> createState() => _OauthRedirectState();
}

class _OauthRedirectState extends State<OauthRedirectPage> {
  UserSessionResult? userState;

  @override
  void initState() {
    if (widget.redirect.error == null) {
      altogic.auth.getAuthGrant(widget.redirect.token).then((value) {
        setState(() {
          userState = value;
        });
      });
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: widget.redirect.error != null
            ? Text('ERROR: ${widget.redirect.error}')
            : userState == null
                ? const CircularProgressIndicator()
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (userState!.errors != null)
                        SingleChildScrollView(
                            child: Text(userState!.errors!.toString())),
                      if (userState!.user != null)
                        Builder(builder: (context) {
                          Timer(const Duration(seconds: 3), () {
                            Navigator.pushNamed(context, '/home');
                          });
                          return SingleChildScrollView(
                            child: Text(
                                "Rotuing home...\n\nYour Data:\n\n${userState!.user!.toJson()}"),
                          );
                        })
                    ],
                  ),
      ),
    );
  }
}
