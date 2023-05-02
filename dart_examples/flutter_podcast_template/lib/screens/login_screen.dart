import 'package:flutter/material.dart';
import 'package:fodcast_app/services/auth_service.dart';
import 'package:fodcast_app/utils/constants.dart';
import 'package:fodcast_app/widgets/custom_button.dart';
import 'package:fodcast_app/widgets/custom_text_field.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Log In'),
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
                      const SizedBox(height: 32.0),
                      CustomButton(
                        text: 'Log In',
                        onPressed: _onLoginPressed,
                      ),
                      const SizedBox(height: 16.0),
                      TextButton(
                        onPressed: () {
                          Navigator.pushReplacementNamed(
                              context, Constants.signupRoute);
                        },
                        child: const Text('Don\'t have an account? Sign Up'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
    );
  }

  void _onLoginPressed() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _isLoading = true;
      });

      final success = await AuthService().login(_email.text, _password.text);

      setState(() {
        _isLoading = false;
      });

      if (!mounted) return;
      if (success == null) {
        Navigator.pushReplacementNamed(context, Constants.splashRoute);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Unable to log in. Please try again later.'),
          ),
        );
      }
    }
  }
}
