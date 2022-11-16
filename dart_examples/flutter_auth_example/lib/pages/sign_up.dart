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
  final TextEditingController nameController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          child: Form(
            child: Column(
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
                AltogicInput(
                  hint: 'Email Address',
                  editingController: emailController,
                  autofillHints: AutofillHints.email,
                  inputType: TextInputType.emailAddress,
                ),
                verticalSpace,
                AltogicInput(
                  hint: 'Password',
                  editingController: passwordController,
                  autofillHints: AutofillHints.password,
                  inputType: TextInputType.visiblePassword,
                ),
                verticalSpace,
                AltogicInput(
                  hint: 'Name',
                  editingController: nameController,
                  autofillHints: AutofillHints.name,
                  inputType: TextInputType.name,
                ),
                verticalSpace,
                AltogicButton(
                    body: 'Sign Up',
                    onPressed: _signUp,
                    enabled: () =>
                        emailController.text.isNotEmpty &&
                        passwordController.text.isNotEmpty &&
                        nameController.text.isNotEmpty,
                    listenable: Listenable.merge(
                        [emailController, passwordController, nameController])),
                verticalSpace,
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/sign-in');
                  },
                  child: const Text('Already have an account?'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _signUp() async {
    var userResult = await altogic.auth.signUpWithEmail(
        emailController.text, passwordController.text, nameController.text);
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
                          "User created successfully.\n\nTo sign in, check your mail box!")),
                ],
              );
            });
        if (mounted) Navigator.pushNamed(context, '/sign-in');
      }
    }
  }
}
