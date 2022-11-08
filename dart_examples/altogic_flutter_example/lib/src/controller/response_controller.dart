import 'dart:convert';

import 'package:altogic/altogic.dart';
import 'package:flutter/cupertino.dart';

class ResponseViewController with ChangeNotifier {
  ResponseViewController();

  String? _value;

  String get value => _value ?? "No response";

  set _setValue(String? value) {
    _value = value;
    notifyListeners();
  }

  void loading() {
    _setValue = "Loading...";
  }

  void error(APIError? error) {
    if (error == null) {
      _setValue = "No error";
    } else {
      _setValue = const JsonEncoder.withIndent("    ").convert(error.toJson());
    }
  }

  void message(String message) {
    _setValue = message;
  }

  void success([String? data]) {
    _setValue = data ?? "Success";
  }

  void clear() {
    _setValue = null;
  }

  void response(APIResponse data) {
    if (data.errors != null) {
      error(data.errors);
    } else {
      success(const JsonEncoder.withIndent("    ").convert(data.data));
    }
  }
}
