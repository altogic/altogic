import 'package:flutter/material.dart';
import 'package:flutter_auth_example/widgets/button.dart';
import 'package:flutter_auth_example/widgets/input.dart';
import 'package:flutter_auth_example/widgets/logo.dart';
import 'package:flutter_auth_example/widgets/with_max_width.dart';

import '../altogic.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({Key? key}) : super(key: key);

  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  static const SizedBox verticalSpace = SizedBox(height: 20);

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    Widget widget = Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const SizedBox(width: double.infinity),
        const AltogicLogo(),
        verticalSpace,
        const WithMaxWidth(
            child: Text(
          'Sign In',
          style: TextStyle(fontSize: 22),
        )),
        verticalSpace,
        AltogicInput(hint: 'Email Address', editingController: emailController),
        verticalSpace,
        AltogicInput(hint: 'Password', editingController: passwordController),
        verticalSpace,
        AltogicButton(body: 'Sign In', onPressed: _signIn),
        verticalSpace,
        AltogicButton(
            body: 'Send Magic Link',
            onPressed: () async {
              var res =
                  await altogic.auth.sendMagicLinkEmail(emailController.text);
              String message;
              if (res == null) {
                message = "Sent Magic Link";
              } else {
                message = "Error: ${res.toJson()}";
              }
              if (mounted) {
                ScaffoldMessenger.of(context)
                    .showSnackBar(SnackBar(content: Text(message)));
              }
            }),
        verticalSpace,
        WithMaxWidth(
            child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/sign-up');
                },
                child: const Text('Forgot Password?'),
              ),
            ),
            Expanded(
              child: TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, '/sign-up');
                },
                child: const Text('Don\'t have an account?'),
              ),
            ),
          ],
        )),
      ],
    );

    if (MediaQuery.of(context).size.height < 500) {
      widget = SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 50),
        child: widget,
      );
    }

    return Scaffold(
      body: widget,
    );
  }

  Future<void> _signIn() async {
    var res = await altogic.auth
        .signInWithEmail(emailController.text, passwordController.text);
    if (res.errors != null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('An Error Occurred :\n${res.errors}')));
      }
    }
    if (res.user != null) {
      if (mounted) Navigator.pushReplacementNamed(context, '/home');
    }
  }
}
