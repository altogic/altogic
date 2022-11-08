import 'dart:async';

import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';

import '../altogic.dart';

/// Opened with link
///  --- 1 success link
///     --- 1.1 success get auth grant
///     --- 1.2 error get auth grant
///  --- 2 error link


class MagicLinkRedirectPage extends StatefulWidget {
  const MagicLinkRedirectPage({Key? key, required this.redirect}) : super(key: key);

  final MagicLinkRedirect redirect;

  @override
  State<MagicLinkRedirectPage> createState() => _MagicLinkRedirectState();
}

class _MagicLinkRedirectState extends State<MagicLinkRedirectPage> {
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
                                "Routing home...\n\nYour Data:\n\n${userState!.user!.toJson()}"),
                          );
                        })
                    ],
                  ),
      ),
    );
  }
}
