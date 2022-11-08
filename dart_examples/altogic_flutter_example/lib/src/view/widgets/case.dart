import 'package:altogic_flutter_example/src/controller/response_controller.dart';
import 'package:flutter/material.dart';

import 'divider.dart';
import 'documentation/base.dart';
import 'documentation/texts.dart';

typedef AsyncWrapper<T> = Future<T> Function(Future<T> Function() function);

abstract class MethodState extends State<MethodWidget> {
  bool get loading => _loading;

  String get name;

  List<DocumentationObject> get description;

  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder;

  bool _loading = false;

  Future<E> asyncWrapper<E>(Future<E> Function() function) async {
    _loading = true;
    setState(() {});
    try {
      return await function();
    } finally {
      _loading = false;
      setState(() {});
    }
  }

  Widget buildWidget(BuildContext context);

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.center, children: [
      const AltogicDivider(),
      const SizedBox(
        height: 10,
      ),
      Row(children: [
        Expanded(
            child: Documentation(children: [Header(name, level: 2), vSpace])),
        const SizedBox(
          width: 10,
        ),
        if (documentationBuilder != null) ...[
          Container(
            width: 40,
            alignment: Alignment.center,
            child: IconButton(
                onPressed: () {
                  showDialog(
                      context: context,
                      builder: (c) => SimpleDialog(
                            children: [
                              SimpleDialogOption(
                                child: Container(
                                  width: double.infinity,
                                  margin: const EdgeInsets.all(30),
                                  padding: const EdgeInsets.all(8),
                                  alignment: Alignment.center,
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Documentation(
                                    children: [
                                      Header(name, level: 2),
                                      vSpace,
                                      ...documentationBuilder!(c)
                                    ],
                                  ),
                                ),
                              )
                            ],
                          ));
                },
                icon: const Icon(Icons.info)),
          )
        ]
      ]),
      Documentation(children: [...description, vSpace]),
      const SizedBox(
        height: 10,
      ),
      buildWidget(context),
      const SizedBox(
        height: 30,
      ),
    ]);
  }
}

class MethodWidget extends StatefulWidget {
  const MethodWidget({super.key, this.response, required this.create});

  final ResponseViewController? response;
  final MethodState Function() create;

  // ignore_for_file: no_logic_in_create_state

  @override
  MethodState createState() => create();
}

abstract class MethodWrap extends MethodState {
  MethodWrap();

  List<Widget> children(BuildContext context);

  @override
  Widget buildWidget(BuildContext context) {
    return Wrap(
      runSpacing: 10,
      spacing: 10,
      alignment: WrapAlignment.center,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: children(context),
    );
  }
}
