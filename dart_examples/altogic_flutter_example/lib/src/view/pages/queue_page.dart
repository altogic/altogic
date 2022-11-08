import 'package:altogic_flutter_example/src/service/queue_service.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/input.dart';
import 'package:flutter/material.dart';
import '../widgets/documentation/texts.dart';

class QueuePage extends StatefulWidget {
  const QueuePage({Key? key}) : super(key: key);

  @override
  State<QueuePage> createState() => _QueuePagePageState();
}

class _QueuePagePageState extends State<QueuePage> {
  QueueService taskService = QueueService();

  late final widgets = [RunQueueMethod.new, GetMessageStatus.new];

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
                  Header("Queue Manager"),
                  vSpace,
                  AutoSpan(
                      "This page is used to manage queue. It is used to run and get status."),
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

class RunQueueMethod extends MethodWrap {
  RunQueueMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: "Submit Message",
          onPressed: () {
            asyncWrapper(() async {
              await QueueService.of(context).submitMessage();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("This method is used to submit message queue."),
        vSpace,
        const AutoSpan('There is a queue with name "hello" in this project.'),
        vSpace,
        const AutoSpan(
            "To submit message to queue you need to call `submitMessage`."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan("This method is used to submit message queue."),
            vSpace,
            const AutoSpan(
                'There is a queue with name "hello" in this project.'),
            vSpace,
            const AutoSpan(
                "To submit message to queue you need to call `submitMessage`."),
            vSpace,
            const DartCode("""
var res = await altogic.queue.submitMessage("hello", {
  "entry": {
    "key1": "value1",
  }
});
if (res.errors == null) {
  // success
}
    """)
          ];

  @override
  String get name => "Submit Message";
}

class GetMessageStatus extends MethodWrap {
  GetMessageStatus();

  @override
  List<Widget> children(BuildContext context) {
    var queue = QueueService.of(context).idController;
    return [
      AltogicInput(hint: 'Message ID', editingController: queue),
      AltogicButton(
          body: "Get Status",
          enabled: () => queue.text.length == 24,
          listenable: queue,
          onPressed: () {
            asyncWrapper(() async {
              await QueueService.of(context).getMessageStatus(
                queue.text,
              );
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("This method is used to get message status."),
        vSpace,
        const AutoSpan(
            "To get task status you need to call `getMessageStatus`"),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan("This method is used to get message status."),
            vSpace,
            const AutoSpan(
                "To get task status you need to call `getMessageStatus`"),
            vSpace,
            DartCode("""
var res = await altogic.task.getMessageStatus("${QueueService.of(context).idController.text}");
if (res.errors == null) {
  // success
}
    """)
          ];

  @override
  String get name => "Get Status";
}
