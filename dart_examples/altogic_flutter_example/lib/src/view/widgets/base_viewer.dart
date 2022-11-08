import 'package:altogic_flutter_example/main.dart';
import 'package:altogic_flutter_example/src/controller/response_controller.dart';
import 'package:altogic_flutter_example/src/controller/user_controller.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:flutter/material.dart';

class BaseViewer extends StatefulWidget {
  const BaseViewer(
      {Key? key, required this.body, this.leadingHome = true, this.leading})
      : super(key: key);

  final bool leadingHome;

  final Widget body;
  final Widget? leading;

  @override
  State<BaseViewer> createState() => _BaseViewerState();
}

class _BaseViewerState extends State<BaseViewer> {
  final ValueNotifier<double> _responseAreaHeight = ValueNotifier(200.0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: widget.body,
          ),
          AreaResizer(notifier: _responseAreaHeight),
          ValueListenableBuilder(
              valueListenable: _responseAreaHeight,
              builder: (c, v, _) {
                return Container(
                  padding: const EdgeInsets.all(8.0),
                  width: double.infinity,
                  height: v,
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Response",
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 20,
                          ),
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        _ResponseViewer(
                            responseViewController:
                                InheritedService.of(context).response),
                      ],
                    ),
                  ),
                );
              }),
        ],
      ),
      appBar: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: AltogicAppBar(
            leadingHome: widget.leadingHome,
            leading: widget.leading,
          )),
    );
  }
}

class AreaResizer extends StatefulWidget {
  const AreaResizer({Key? key, required this.notifier}) : super(key: key);

  final ValueNotifier<double> notifier;

  @override
  State<AreaResizer> createState() => _AreaResizerState();
}

class _AreaResizerState extends State<AreaResizer> {
  bool _isResizing = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.resizeUpDown,
      child: GestureDetector(
        onVerticalDragStart: (_) {
          setState(() {
            _isResizing = true;
          });
        },
        onVerticalDragEnd: (_) {
          Future.delayed(const Duration(milliseconds: 200)).then((v) {
            setState(() {
              _isResizing = false;
            });
          });
        },
        onVerticalDragUpdate: (details) {
          widget.notifier.value -= details.delta.dy;
        },
        child: Container(
          width: double.infinity,
          alignment: Alignment.center,
          height: 6,
          decoration: BoxDecoration(
            border: Border.all(color: Colors.black, width: 0.5),
          ),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            height: _isResizing ? 6 : 2,
            width: _isResizing ? MediaQuery.of(context).size.width : 100,
            color: Colors.black,
          ),
        ),
      ),
    );
  }
}

class AltogicAppBar extends StatefulWidget {
  const AltogicAppBar(
      {Key? key,
      this.leadingHome = false,
      this.autoImplementLeading = true,
      this.leading})
      : super(key: key);

  final bool leadingHome;
  final bool autoImplementLeading;
  final Widget? leading;

  @override
  State<AltogicAppBar> createState() => _AltogicAppBarState();
}

class _AltogicAppBarState extends State<AltogicAppBar> {
  CurrentUserController controller = CurrentUserController();

  @override
  void initState() {
    controller.addListener(_listener);
    super.initState();
  }

  @override
  void dispose() {
    controller.removeListener(_listener);
    super.dispose();
  }

  void _listener() => setState(() {});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      automaticallyImplyLeading:
          !widget.leadingHome && widget.autoImplementLeading,
      leading: widget.leading ??
          (widget.leadingHome
              ? IconButton(
                  onPressed: () {
                    Navigator.of(context).pushNamed('/');
                  },
                  icon: const Icon(Icons.home))
              : null),
      title: Text(controller.isLogged
          ? 'Hello ${controller.user.name ?? controller.user.mailOrPhone} !'
          : 'Welcome To Test App'),
      actions: [
        if (controller.isLogged)
          Tooltip(
            message: 'Logout',
            child: IconButton(
              icon: const Icon(Icons.logout),
              onPressed: () async {
                await altogic.auth.signOut();
                CurrentUserController().user = null;
                CurrentUserController().market = null;
                if (mounted) Navigator.of(context).pushNamed('/');
              },
            ),
          ),
      ],
    );
  }
}

class _ResponseViewer extends StatefulWidget {
  const _ResponseViewer({required this.responseViewController});

  final ResponseViewController responseViewController;

  @override
  State<_ResponseViewer> createState() => _ResponseViewerState();
}

class _ResponseViewerState extends State<_ResponseViewer> {
  @override
  void initState() {
    widget.responseViewController.addListener(_listener);
    super.initState();
  }

  @override
  void dispose() {
    widget.responseViewController.removeListener(_listener);
    super.dispose();
  }

  void _listener() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(0.0),
      child: SelectableText(widget.responseViewController.value),
    );
  }
}
