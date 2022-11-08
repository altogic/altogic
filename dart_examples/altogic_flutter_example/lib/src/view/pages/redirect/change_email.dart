
import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/service/auth_service.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/texts.dart';
import 'package:flutter/material.dart';


class ChangeMailRedirectPage extends StatefulWidget {
  const ChangeMailRedirectPage({Key? key, required this.redirect})
      : super(key: key);

  final ChangeEmailRedirect redirect;

  @override
  State<ChangeMailRedirectPage> createState() => _ChangeMailRedirectPageState();
}

class _ChangeMailRedirectPageState extends State<ChangeMailRedirectPage> {
  @override
  void initState() {
    super.initState();
  }

  final AuthService authService = AuthService();

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
                    const Header('Change Email Redirect Page'),
                    vSpace,
                    const AutoSpan("This page is used to inform changing email."
                        " The page opened after clicking on the link in the email."
                        "\n\n"
                        "After user clicked the link, Altogic will redirect the "
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
                        "If `error` parameter is null, link is valid and no action required."),
                    vSpace,
                    if (widget.redirect.error == null)
                      const AutoSpan("*No action required*")
                    else
                      AutoSpan("Error: ${widget.redirect.error}"),
                  ]),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
