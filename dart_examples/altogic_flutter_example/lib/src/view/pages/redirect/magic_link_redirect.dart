
import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/service/auth_service.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/texts.dart';
import 'package:flutter/material.dart';

import '../../widgets/button.dart';

class MagicLinkRedirectPage extends StatefulWidget {
  const MagicLinkRedirectPage({Key? key, required this.redirect})
      : super(key: key);

  final MagicLinkRedirect redirect;

  @override
  State<MagicLinkRedirectPage> createState() => _MagicLinkRedirectPageState();
}

class _MagicLinkRedirectPageState extends State<MagicLinkRedirectPage> {
  ValueNotifier<String> response = ValueNotifier<String>('Getting grant...');

  AuthService authService = AuthService();

  @override
  void initState() {
    super.initState();
  }

  _get() async {
    await Future.delayed(const Duration(milliseconds: 200));
    if (widget.redirect.error != null) {
      response.value = 'redirect.error: ${widget.redirect.error}';
      return;
    }
    response.value = '';
    await authService.getAuthGrant(widget.redirect.token);
    if (authService.currentUserController.isLogged) {
      response.value = 'Signed in';
    } else {
      response.value = 'Failed to sign in';
    }
  }

  final TextEditingController password = TextEditingController();

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
                    const Header('Magic Link Redirect Page'),
                    vSpace,
                    const AutoSpan(
                        "This page is used to verify and sign in with the magic link."
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
