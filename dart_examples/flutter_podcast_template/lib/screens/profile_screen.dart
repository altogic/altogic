import 'package:flutter/material.dart';
import 'package:fodcast_app/services/auth_service.dart';
import 'package:fodcast_app/utils/constants.dart';
import 'package:fodcast_app/widgets/custom_button.dart';
import 'package:fodcast_app/widgets/custom_text_field.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final _displayName = TextEditingController();
  final _bio = TextEditingController();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  void _loadUserData() {
    final user = AuthService().user;

    setState(() {
      _displayName.text = user.name ?? '';
      _bio.text = user.bio ?? '';
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
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
                        label: 'Display Name',
                        hintText: 'Enter your display name',
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your display name';
                          }
                          return null;
                        },
                        controller: _displayName,
                      ),
                      const SizedBox(height: 16.0),
                      CustomTextField(
                        label: 'Bio',
                        hintText: 'Enter your bio',
                        maxLines: 3,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your bio';
                          }
                          return null;
                        },
                        controller: _bio,
                      ),
                      const SizedBox(height: 32.0),
                      CustomButton(
                        text: 'Save',
                        onPressed: _onSavePressed,
                      ),
                      const SizedBox(height: 16.0),
                      CustomButton(
                        text: 'Logout',
                        onPressed: () async {
                          await AuthService().logout();
                          if (mounted) {
                            Navigator.pushNamedAndRemoveUntil(
                              context,
                              Constants.splashRoute,
                              (route) => false,
                            );
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
    );
  }

  void _onSavePressed() async {
    if (_formKey.currentState?.validate() ?? false) {
      setState(() {
        _isLoading = true;
      });

      final success = await AuthService().updateUser(
        displayName: _displayName.text,
        bio: _bio.text,
      );

      setState(() {
        _isLoading = false;
      });

      if (!mounted) return;
      if (success == null) {
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Unable to update profile. Please try again later.'),
          ),
        );
      }
    }
  }
}
