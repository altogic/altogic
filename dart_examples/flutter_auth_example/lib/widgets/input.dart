import 'package:flutter/material.dart';
import 'package:flutter_auth_example/widgets/with_max_width.dart';

class AltogicInput extends StatefulWidget {
  const AltogicInput(
      {Key? key,
      required this.hint,
      required this.editingController,
      this.suffixIcon,
      required this.autofillHints,
      required this.inputType})
      : super(key: key);

  final String hint;
  final TextEditingController editingController;
  final WidgetBuilder? suffixIcon;
  final String autofillHints;
  final TextInputType inputType;

  @override
  State<AltogicInput> createState() => _AltogicInputState();
}

class _AltogicInputState extends State<AltogicInput> {
  @override
  Widget build(BuildContext context) {
    return WithMaxWidth(
      maxWidth: 532,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: TextField(
          onChanged: widget.suffixIcon != null
              ? (value) {
                  setState(() {});
                }
              : null,
          autofillHints: [widget.autofillHints],
          controller: widget.editingController,
          keyboardType: widget.inputType,
          decoration: InputDecoration(
            label: Text(widget.hint),
            suffixIcon: widget.suffixIcon?.call(context),
            border: const OutlineInputBorder(),
            hintText: widget.hint,
          ),
        ),
      ),
    );
  }
}
