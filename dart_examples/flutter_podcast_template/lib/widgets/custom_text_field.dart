import 'package:flutter/material.dart';

class CustomTextField extends StatelessWidget {
  final String label;
  final String hintText;
  final int? maxLines;
  final bool obscureText;
  final String? Function(String?)? validator;
  final TextEditingController? controller;

  const CustomTextField(
      {Key? key,
      required this.label,
      required this.hintText,
      this.maxLines,
      this.obscureText = false,
      this.validator,
      this.controller})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: label,
        hintText: hintText,
        border: const OutlineInputBorder(),
      ),
      maxLines: obscureText ? 1 : maxLines,
      obscureText: obscureText,
      validator: validator,
      controller: controller,
      keyboardType: TextInputType.emailAddress,
      textInputAction: TextInputAction.next,
      style: const TextStyle(fontSize: 14),
    );
  }
}
