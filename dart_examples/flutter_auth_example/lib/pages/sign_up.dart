import 'dart:async';

import 'package:flutter/material.dart';

import '../altogic.dart';
import '../widgets/button.dart';
import '../widgets/input.dart';
import '../widgets/logo.dart';
import '../widgets/with_max_width.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({Key? key}) : super(key: key);

  @override
  State<SignUpPage> createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
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
          'Sign Up',
          style: TextStyle(fontSize: 22),
        )),
        verticalSpace,
        AltogicInput(hint: 'Email Address', editingController: emailController),
        verticalSpace,
        AltogicInput(hint: 'Password', editingController: passwordController),
        verticalSpace,
        AltogicButton(
            body: 'Sign Up',
            onPressed: _signUp,
            enabled: () =>
                emailController.text.isNotEmpty &&
                passwordController.text.isNotEmpty,
            listenable:
                Listenable.merge([emailController, passwordController])),
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
                  Navigator.pushNamed(context, '/sign-in');
                },
                child: const Text('Already have an account?'),
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

  Future<void> _signUp() async {
    var userResult = await altogic.auth
        .signUpWithEmail(emailController.text, passwordController.text);
    if (userResult.errors != null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text(
              "An error occurred: ${userResult.errors!.items.first.message}"),
        ));
      }
    } else {
      if (mounted) {
        await showDialog(
            context: context,
            builder: (c) {
              Timer(const Duration(seconds: 3), () {
                Navigator.pop(c);
              });
              return const SimpleDialog(
                children: [
                  SimpleDialogOption(
                      child: Text(
                          "User created successfully.\n\nTo sign in verify your email!")),
                ],
              );
            });
        if (mounted) Navigator.pushNamed(context, '/sign-in');
      }
    }
  }
}
