//ignore: avoid_web_libraries_in_flutter
import 'dart:html';
import 'dart:convert';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';

Uint8List getUintList(PlatformFile file) {
  return file.bytes!;
}

void download(String name, Uint8List data) {
  final content = base64Encode(data);
  AnchorElement(
      href: "data:application/octet-stream;charset=utf-16le;base64,$content")
    ..setAttribute("download", name)
    ..click();
}
