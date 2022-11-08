import 'package:altogic_flutter_example/src/controller/response_controller.dart';
import 'package:flutter/cupertino.dart';

abstract class ServiceBase {
  ResponseViewController response = ResponseViewController();
}

class InheritedService extends InheritedWidget {
  const InheritedService(
      {Key? key, required Widget child, required this.service})
      : super(key: key, child: child);

  ResponseViewController get response => service.response;

  final dynamic service;

  static T of<T extends ServiceBase>(BuildContext context) {
    return context
        .dependOnInheritedWidgetOfExactType<InheritedService>()!
        .service as T;
  }

  @override
  bool updateShouldNotify(InheritedService oldWidget) {
    return false;
  }
}
