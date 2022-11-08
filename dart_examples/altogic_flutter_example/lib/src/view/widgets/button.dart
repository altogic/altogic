import 'package:flutter/material.dart';

import 'documentation/base.dart';

class AltogicButton extends StatelessWidget {
  const AltogicButton(
      {Key? key,
      required this.body,
      required this.onPressed,
      this.documentationBuilder,
      this.listenable,
      this.enabled})
      : super(key: key);

  final String body;

  final VoidCallback onPressed;

  final List<DocumentationObject> Function(BuildContext context)?
      documentationBuilder;

  final Listenable? listenable;

  final bool Function()? enabled;

  @override
  Widget build(BuildContext context) {
    var result = Container(
        alignment: Alignment.center,
        constraints: const BoxConstraints(maxWidth: 300),
        width: 300,
        height: 60,
        child: documentationBuilder != null
            ? Row(
                children: [
                  Expanded(
                      child: Container(
                          alignment: Alignment.center, child: Text(body))),
                  const SizedBox(
                    width: 10,
                  ),
                  IconButton(
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
                                          borderRadius:
                                              BorderRadius.circular(8),
                                        ),
                                        child: Documentation(
                                          children: documentationBuilder!(c),
                                        ),
                                      ),
                                    )
                                  ],
                                ));
                      },
                      icon: const Icon(Icons.info))
                ],
              )
            : Text(body));

    if (listenable != null) {
      return _Listenable(
        listenable: listenable!,
        builder: (context) {
          return ElevatedButton(
              style: ButtonStyle(
                maximumSize: MaterialStateProperty.all(const Size(300, 51)),
                padding: MaterialStateProperty.all(const EdgeInsets.all(0)),
                fixedSize: MaterialStateProperty.all(const Size(300, 51)),
              ),
              onPressed: enabled!() ? onPressed : null,
              child: result);
        },
      );
    }

    return ElevatedButton(
        onPressed: (enabled?.call() ?? true) ? onPressed : null,
        style: ButtonStyle(
          maximumSize: MaterialStateProperty.all(const Size(300, 51)),
          padding: MaterialStateProperty.all(const EdgeInsets.all(0)),
          fixedSize: MaterialStateProperty.all(const Size(300, 51)),
        ),
        child: result);
  }
}

class _Listenable extends StatefulWidget {
  const _Listenable({Key? key, required this.listenable, required this.builder})
      : super(key: key);

  final WidgetBuilder builder;
  final Listenable listenable;

  @override
  State<_Listenable> createState() => _ListenableState();
}

class _ListenableState extends State<_Listenable> {
  void _listener() {
    setState(() {});
  }

  @override
  void initState() {
    widget.listenable.addListener(_listener);
    super.initState();
  }

  @override
  void dispose() {
    widget.listenable.removeListener(_listener);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return widget.builder(context);
  }
}
