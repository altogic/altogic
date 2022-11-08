import 'package:flutter/material.dart';

class AltogicDivider extends StatefulWidget {
  const AltogicDivider({Key? key}) : super(key: key);

  @override
  State<AltogicDivider> createState() => _AltogicDividerState();
}

class _AltogicDividerState extends State<AltogicDivider> {
  @override
  Widget build(BuildContext context) {
    return const Divider(
      color: Colors.black,
      height: 1,
      thickness: 1,
    );
  }
}
