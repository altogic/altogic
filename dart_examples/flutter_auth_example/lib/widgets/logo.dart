import 'package:flutter/material.dart';
import 'package:flutter_auth_example/widgets/with_max_width.dart';

class AltogicLogo extends StatelessWidget {
  const AltogicLogo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return WithMaxWidth(
      maxWidth: 200,
      child: Image.asset('assets/logo.png'),
    );
  }
}
