import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/main.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:flutter/cupertino.dart';

class TaskService extends ServiceBase {
  static TaskService of(BuildContext context) =>
      InheritedService.of<TaskService>(context);

  TextEditingController idController = TextEditingController();

  Future<void> runOnce() async {
    var res = await altogic.task.runOnce('hello');
    response.response(APIResponse(
      errors: res.errors,
      data: res.data?.toJson(),
    ));
    idController.text = res.data?.taskId ?? '';
  }

  ValueNotifier<String?> id = ValueNotifier<String?>(null);

  Future<void> getTaskStatus(String taskId) async {
    var res = await altogic.task.getTaskStatus(taskId);
    response.response(APIResponse(
      errors: res.errors,
      data: res.data?.toJson(),
    ));
  }
}
