import 'package:flutter/material.dart';

import 'documentation/base.dart';

class AltogicInput extends StatefulWidget {
  const AltogicInput(
      {Key? key,
      required this.hint,
      required this.editingController,
      this.info,
      this.suffixIcon,
      this.vertical = false,
      this.onSubmitted})
      : super(key: key);

  final String hint;
  final TextEditingController editingController;
  final List<DocumentationObject>? info;
  final WidgetBuilder? suffixIcon;
  final bool vertical;
  final void Function(String)? onSubmitted;

  @override
  State<AltogicInput> createState() => _AltogicInputState();
}

class _AltogicInputState extends State<AltogicInput> {
  final FocusNode _focusNode = FocusNode();

  @override
  Widget build(BuildContext context) {
    var info = widget.info != null
        ? IconButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => SimpleDialog(
                  children: [
                    SimpleDialogOption(
                      child: Documentation(children: widget.info!),
                    )
                  ],
                ),
              );
            },
            icon: const Icon(Icons.info),
          )
        : null;

    Widget field = TextField(
      focusNode: _focusNode,
      onSubmitted: (value) {
        widget.onSubmitted?.call(value);
        _focusNode.requestFocus();
      },
      onChanged: widget.suffixIcon != null
          ? (value) {
              setState(() {});
            }
          : null,
      controller: widget.editingController,
      maxLines: widget.vertical ? null : 1,
      keyboardType: TextInputType.multiline,
      decoration: InputDecoration(
        label: Text(widget.hint),
        suffixIcon: widget.suffixIcon != null && info != null
            ? SizedBox(
                width: 80,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [widget.suffixIcon!(context), info],
                ),
              )
            : widget.suffixIcon?.call(context) ?? info,
        border: const OutlineInputBorder(),
        hintText: widget.hint,
      ),
    );

    if (widget.vertical) {
      field = SingleChildScrollView(
        child: field,
      );
    }

    return Container(
      width: double.infinity,
      height: widget.vertical ? null : 50,
      constraints: BoxConstraints(
        maxWidth: widget.vertical ? 500 : 300,
      ),
      child: field,
    );
  }
}
