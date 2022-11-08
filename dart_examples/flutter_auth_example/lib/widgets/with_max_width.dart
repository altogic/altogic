import 'package:flutter/material.dart';

class WithMaxWidth extends StatelessWidget {
  const WithMaxWidth({super.key, required this.child, this.maxWidth = 500});

  final Widget child;
  final double maxWidth;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxWidth: maxWidth,
        ),
        child: child,
      ),
    );
  }
}
