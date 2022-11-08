import 'package:altogic_flutter_example/src/service/auth_service.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/view/pages/authorization/cases.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:flutter/material.dart';

import '../../widgets/documentation/texts.dart';

class AuthorizationPage extends StatefulWidget {
  const AuthorizationPage({Key? key}) : super(key: key);

  @override
  State<AuthorizationPage> createState() => _AuthorizationPageState();
}

class _AuthorizationPageState extends State<AuthorizationPage> {
  AuthService authService = AuthService();


  List<MethodState Function()> list = [
    SignUpWithEmailMethod.new,
    SignUpWithPhoneMethod.new,
    SignInWithEmailMethod.new,
    SignInWithPhoneMethod.new,
    SignInWithCodeMethod.new,
    SignInWithProviderMethod.new,
    SignOutMethod.new,
    SignOutAllMethod.new,
    SignOutMethodAllEx.new,
    GetAllSessionsMethod.new,
    GetAllUserFromDbMethod.new,
    ChangePassword.new,
    GetAuthGrant.new,
    ReSendVerificationEmailMethod.new,
    ReSendVerificationCodeMethod.new,
    SendMagicLinkMethod.new,
    SendResetPwdEmailMethod.new,
    SendResetPwdCodeMethod.new,
    SendSignInCodeMethod.new,
    ResetPwdWithToken.new,
    ResetPwdWithCode.new,
    ChangeEmail.new,
    ChangePhone.new,
    VerifyPhone.new
  ];

  @override
  Widget build(BuildContext context) {
    return InheritedService(
      service: authService,
      child: BaseViewer(
          body: ListView.builder(
        itemCount: list.length + 1,
        padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 16),
        itemBuilder: (context, index) {
          if (index == 0) {
            return Column(
              children: const [
                Documentation(children: [
                  Header("Authorization"),
                  vSpace,
                  AutoSpan("This page is used to authorize user in the system. "
                      "It is used to get access token and refresh token. "),
                ]),
                SizedBox(
                  height: 40,
                ),
              ],
            );
          }

          return MethodWidget(
            create: list[index - 1],
            response: authService.response,
          );
        },
      )),
    );
  }
}
