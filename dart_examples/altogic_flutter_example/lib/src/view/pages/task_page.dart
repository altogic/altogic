import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/service/task_service.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/input.dart';
import 'package:flutter/material.dart';

import '../../../main.dart';
import '../widgets/documentation/texts.dart';

class TaskManagerPage extends StatefulWidget {
  const TaskManagerPage({Key? key}) : super(key: key);

  @override
  State<TaskManagerPage> createState() => _TaskManagerPageState();
}

class _TaskManagerPageState extends State<TaskManagerPage> {
  TaskService taskService = TaskService();

  final widgets = [RunTaskMethod.new, GetTaskStatus.new];

  @override
  Widget build(BuildContext context) {
    return InheritedService(
        service: taskService,
        child: BaseViewer(
          body: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 30,
            ),
            child: Column(
              children: [
                const Documentation(children: [
                  Header("Task Manager"),
                  vSpace,
                  AutoSpan(
                      "This page is used to manage tasks. It is used to run and get status."),
                  vSpace
                ]),
                ...widgets.map((e) => MethodWidget(
                      create: e,
                      response: taskService.response,
                    ))
              ],
            ),
          ),
        ));
  }
}

class RunTaskMethod extends MethodWrap {
  RunTaskMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: "Run Once",
          onPressed: () {
            asyncWrapper(() async {
              await TaskService.of(context).runOnce();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("This method is used to run task."),
        vSpace,
        const AutoSpan('There is a task with name "hello" in this project.'),
        vSpace,
        const AutoSpan("The task is runs every 15 minutes."),
        vSpace,
        const AutoSpan("To run task you need to call `runOnce`."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan("This method is used to run task."),
            vSpace,
            const AutoSpan(
                'There is a task with name "hello" in this project.'),
            vSpace,
            const AutoSpan("The task is runs every 15 minutes."),
            vSpace,
            const AutoSpan("To run task you need to call `runOnce`"),
            vSpace,
            const DartCode("""
var res = await altogic.task.runOnce('hello');
if (res.errors == null) {
  // success
}
    """)
          ];

  @override
  String get name => "Run Once";
}

class EnsureMethod extends MethodWrap {
  EnsureMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: "Get Cache",
          onPressed: () {
            asyncWrapper(() async {
              var res = await altogic.cache.get("task_cache").asMap();
              // ignore: use_build_context_synchronously
              TaskService.of(context).response.response(res);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'The task adds cache item with key "task_cache" and value '
            '`{"time" : <now>}`.'),
        vSpace,
        const AutoSpan(
            'If you run task, to ensure "task_cache" is  up-to-date.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => null;

  @override
  String get name => "Ensure Task Run";
}

class GetTaskStatus extends MethodWrap {
  GetTaskStatus();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
          hint: 'Task ID',
          editingController: TaskService.of(context).idController),
      AltogicButton(
          body: "Get Status",
          enabled: () => TaskService.of(context).idController.text.length == 24,
          listenable: TaskService.of(context).idController,
          onPressed: () {
            asyncWrapper(() async {
              await TaskService.of(context)
                  .getTaskStatus(TaskService.of(context).idController.text);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("This method is used to get task status."),
        vSpace,
        const AutoSpan("To get task status you need to call `getStatus`"),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan("This method is used to get task status."),
            vSpace,
            const AutoSpan("To get task status you need to call `getStatus`"),
            vSpace,
            DartCode("""
var res = await altogic.task.getTaskStatus('${TaskService.of(c).idController.text}');
if (res.errors == null) {
  // success
}
    """)
          ];

  @override
  String get name => "Get Status";
}
