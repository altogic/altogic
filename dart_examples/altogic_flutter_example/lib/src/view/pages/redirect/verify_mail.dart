
import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:flutter/material.dart';

import '../../../service/auth_service.dart';
import '../../../service/service_base.dart';
import '../../widgets/base_viewer.dart';
import '../../widgets/documentation/base.dart';
import '../../widgets/documentation/code.dart';
import '../../widgets/documentation/texts.dart';

class RedirectEmailPage extends StatefulWidget {
  const RedirectEmailPage({Key? key, required this.redirect}) : super(key: key);

  final EmailVerificationRedirect redirect;

  @override
  State<RedirectEmailPage> createState() => _RedirectEmailState();
}

class _RedirectEmailState extends State<RedirectEmailPage> {
  AuthService authService = AuthService();

  @override
  void initState() {
    //_get();
    super.initState();
  }

  _get() async {
    await Future.delayed(const Duration(milliseconds: 200));
    if (widget.redirect.error != null) {
      authService.response.message('redirect.error: ${widget.redirect.error}');
      return;
    }
    authService.response.message('Getting grant...');
    await authService.getAuthGrant(widget.redirect.token);
    if (authService.currentUserController.isLogged) {
      authService.response.message('Signed in');
    }
  }

  @override
  Widget build(BuildContext context) {
    return InheritedService(
      service: authService,
      child: BaseViewer(
        leadingHome: true,
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(8.0),
          child: Center(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(
                  width: 500,
                  child: Documentation(children: [
                    vSpace,
                    const Header('Email Verification Redirect Page'),
                    vSpace,
                    const AutoSpan(
                        "This page is used to verify the user's email address."
                        " The page opened after clicking on the link in the email."
                        "\n\n"
                        "After user clicking the link, Altogic will redirect the "
                        "user to the *redirect url*"
                        "In the Altogic setting you can specify the *redirect url*."),
                    vSpace,
                    const Header('Handling Redirect Url', level: 2),
                    vSpace,
                    const AutoSpan(
                        "Check the deep linking configuration documentation."),
                    const LinkText(
                        "Blog Post / Documentation", "www.google.com"),
                    vSpace,
                    const AutoSpan("Current redirect url is : "),
                    vSpace,
                    DartCode(widget.redirect.url),
                    vSpace,
                    const AutoSpan(
                        "If `error` parameter is null, link is valid and "
                        "you can get the auth grant from the `access_token` parameter."),
                    vSpace,
                    if (widget.redirect.error == null) DartCode("""
var result = await altogic.auth.getAuthGrant('${widget.redirect.token}');
// OR
var result = await altogic.auth.getAuthGrant(redirect.token); 


if (result.errors == null) {
  // user is signed in
}
                      """) else AutoSpan("Error: ${widget.redirect.error}"),
                  ]),
                ),
                const SizedBox(
                  height: 20,
                ),
                AltogicButton(
                    body: "Get Auth Grant",
                    onPressed: () {
                      _get();
                    }),
                const SizedBox(
                  height: 20,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// http://localhost:3000/?status=400&action=email-confirm&error=Invalid+or+expired+access+token
