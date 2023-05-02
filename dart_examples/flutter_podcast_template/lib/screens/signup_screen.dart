import 'package:flutter/material.dart';
import 'package:fodcast_app/services/auth_service.dart';
import 'package:fodcast_app/utils/constants.dart';
import 'package:fodcast_app/widgets/custom_button.dart';
import 'package:fodcast_app/widgets/custom_text_field.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _confirmPassword = TextEditingController();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sign Up'),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      CustomTextField(
                        label: 'Name',
                        hintText: 'Enter your name',
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your name';
                          } else if (!Constants.name.hasMatch(value)) {
                            return 'Please enter a valid name';
                          }
                          return null;
                        },
                        controller: _name,
                      ),
                      const SizedBox(height: 16.0),
                      CustomTextField(
                        label: 'Email',
                        hintText: 'Enter your email address',
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your email address';
                          } else if (!Constants.emailRegExp.hasMatch(value)) {
                            return 'Please enter a valid email address';
                          }
                          return null;
                        },
                        controller: _email,
                      ),
                      const SizedBox(height: 16.0),
                      CustomTextField(
                        label: 'Password',
                        hintText: 'Enter your password',
                        obscureText: true,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your password';
                          }
                          return null;
                        },
                        controller: _password,
                      ),
                      const SizedBox(height: 16.0),
                      CustomTextField(
                        label: 'Confirm Password',
                        hintText: 'Confirm your password',
                        obscureText: true,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please confirm your password';
                          } else if (value != _password.text) {
                            return 'Passwords do not match';
                          }
                          return null;
                        },
                        controller: _confirmPassword,
                      ),
                      const SizedBox(height: 32.0),
                      CustomButton(
                        text: 'Sign Up',
                        onPressed: _onSignUpPressed,
                      ),
                      const SizedBox(height: 16.0),
                      TextButton(
                        onPressed: () {
                          Navigator.pushReplacementNamed(
                            context,
                            Constants.loginRoute,
                          );
                        },
                        child: const Text('Already have an account? Login'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
    );
  }

  void _onSignUpPressed() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _isLoading = true;
      });

      final success = await AuthService().signup(
        _name.text,
        _email.text,
        _password.text,
      );

      setState(() {
        _isLoading = false;
      });

      if (success == null) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Verification email sent. Please verify your email.'),
          ),
        );
        Navigator.pushReplacementNamed(
          context,
          Constants.loginRoute,
        );
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Unable to sign up. Please try again later.'),
          ),
        );
      }
    }
  }
}
