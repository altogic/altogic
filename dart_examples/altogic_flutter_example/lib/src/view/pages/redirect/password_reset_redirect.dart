
import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/service/auth_service.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/texts.dart';
import 'package:altogic_flutter_example/src/view/widgets/input.dart';
import 'package:flutter/material.dart';

class ResetPwdRedirectPage extends StatefulWidget {
  const ResetPwdRedirectPage({Key? key, required this.redirect})
      : super(key: key);

  final PasswordResetRedirect redirect;

  @override
  State<ResetPwdRedirectPage> createState() => _ResetPwdRedirectPageState();
}

class _ResetPwdRedirectPageState extends State<ResetPwdRedirectPage> {
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
    await authService.resetPwdWithToken(widget.redirect.token, password.text);
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
                      const Header('Password Reset Redirect Page'),
                      vSpace,
                      const AutoSpan(
                          "This page is used to password reset with access token."
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
                          "you can change the password with the `access_token` parameter."),
                      vSpace,
                      if (widget.redirect.error == null) DartCode("""
var result = await altogic.auth.resetPwdWithToken('${widget.redirect.token}', '${password.text}');
// OR
var result = await altogic.auth.resetPwdWithToken(redirect.token, '${password.text}'); 


if (result.errors == null) {
  // user is signed in
}
                      """) else AutoSpan("Error: ${widget.redirect.error}"),
                    ]),
                  ),
                  vSpace.doc(context),
                  AltogicInput(
                      hint: 'New Password', editingController: password),
                  vSpace.doc(context),
                  AltogicButton(
                      body: "Change",
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
        ));
  }
}
