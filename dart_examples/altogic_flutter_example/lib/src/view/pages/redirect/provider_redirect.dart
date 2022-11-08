import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';

import '../../../service/auth_service.dart';
import '../../../service/service_base.dart';
import '../../widgets/base_viewer.dart';
import '../../widgets/button.dart';
import '../../widgets/documentation/base.dart';
import '../../widgets/documentation/code.dart';
import '../../widgets/documentation/texts.dart';

class RedirectProviderPage extends StatefulWidget {
  const RedirectProviderPage({Key? key, required this.redirect})
      : super(key: key);

  final OauthRedirect redirect;

  @override
  State<RedirectProviderPage> createState() => _RedirectProviderPageState();
}

class _RedirectProviderPageState extends State<RedirectProviderPage> {
  AuthService authService = AuthService();

  @override
  void initState() {
    super.initState();
  }

  _get() async {
    await Future.delayed(const Duration(milliseconds: 200));
    if (widget.redirect.error != null) {
      authService.response.message('redirect.error: ${widget.redirect.error}');
      return;
    }
    await authService.getAuthGrant(widget.redirect.token);
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
                    const Header('Oauth Sign in Redirect Page'),
                    vSpace,
                    const AutoSpan(
                        "This page is used to sign in with oauth provider link."
                        " The page opened after signing in from the provider."
                        "\n\n"
                        "After user signed in, Altogic will redirect the "
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
