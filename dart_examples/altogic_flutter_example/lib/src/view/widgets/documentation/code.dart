import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:flutter/material.dart';

import 'code_viewer.dart';

class DartCode extends DocumentationObject {
  const DartCode(this.code);

  final String code;

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context).copyWith(
        textTheme: Theme.of(context).textTheme.apply(fontFamily: 'Code'),
      ),
      child: DartCodeViewer(
        code,
        backgroundColor: Colors.black12,
        showCopyButton: false,
      ),
    );
  }
}
