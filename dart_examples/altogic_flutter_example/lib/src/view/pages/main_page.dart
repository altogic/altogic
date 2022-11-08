import 'package:altogic_flutter_example/src/controller/user_controller.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/texts.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher_string.dart';

import '../../../main.dart';

class MainPage extends StatefulWidget {
  const MainPage({Key? key}) : super(key: key);

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  final Set<String> _authRequired = {
    '/database',
    '/chat',
    '/task',
    '/queue',
    '/storage',
    '/realtime',
    '/cache'
  };

  @override
  Widget build(BuildContext context) {
    var list = [
      const SizedBox(
        height: 40,
      ),
      const Documentation(children: [
        Header('Altogic Flutter Client Example'),
        vSpace,
        AutoSpan("This is an example of using the Altogic Flutter Client."
            " You can find the source code on managers and their methods."),
      ]),
      const SizedBox(
        height: 40,
      ),
      Container(
        width: double.infinity,
        alignment: Alignment.center,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text("Example app in development. Check issues for progress",
                style: TextStyle(fontStyle: FontStyle.italic, fontSize: 18)),
            const SizedBox(
              height: 10,
            ),
            InkWell(
              onTap: () {
                launchUrlString(
                    'https://github.com/yazmehmet/altogic_flutter_example/issues');
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.network(
                    'https://cdn-icons-png.flaticon.com/512/25/25231.png',
                    width: 50,
                    height: 50,
                  ),
                  const SizedBox(
                    width: 20,
                  ),
                  const Text("Issues"),
                ],
              ),
            ),
            const SizedBox(
              height: 10,
            ),
            const Text('Issues and Pull Requests are welcome!')
          ],
        ),
      ),
      const SizedBox(
        height: 40,
      ),
      Container(
        width: double.infinity,
        alignment: Alignment.center,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Text("Altogic Dart package",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(
              height: 10,
            ),
            InkWell(
              onTap: () {
                launchUrlString('https://pub.dev/packages/altogic_dart');
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.network(
                    'assets/assets/pub.png',
                    height: 50,
                    width: 50,
                  ),
                  const SizedBox(
                    width: 20,
                  ),
                  const Text("pub.dev package"),
                ],
              ),
            ),
            const SizedBox(
              height: 10,
            ),
            const Text('Likes are welcome!')
          ],
        ),
      ),
      const SizedBox(
        height: 40,
      ),
      const Documentation(children: [
        vSpace,
        Header('Setting Up Client'),
        vSpace,
        DartCode("final client = createClient('<envUrl>', '<clientKey>');"),
        vSpace,
        AutoSpan(
            'You can find your *client key* and *env-url* in your project settings.'),
        vSpace,
        ImageDoc(
            'https://c1-na.altogic.com/_storage/62d3ea1510b444043a4f80b7/62d3ea1510b444043a4f80b7/634817ae03066f355bfff664',
            padding: EdgeInsets.symmetric(horizontal: 16),
            maxWidth: 800),
        vSpace,
        Header("Getting Managers", level: 2),
        vSpace,
        AutoSpan("You can get managers from the `altogic` now!"
            "\nManagers are used to access the services in your project. \nE.g:"),
        vSpace,
        DartCode("final authManager = altogic.auth;"),
        vSpace,
        AutoSpan(
            "You can find the available managers in the below. Go to the manager's page to see the methods."),
        vSpace,
        vSpace
      ]),
      SizedBox(
        width: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            for (var page in pages.keys.toList()..remove('/')) ...[
              AltogicButton(
                  onPressed: () {
                    Navigator.of(context).pushNamed(page);
                  },
                  enabled: () =>
                      !_authRequired.contains(page) ||
                      CurrentUserController().isLogged,
                  body: routeNames[page]!),
              if (!CurrentUserController().isLogged &&
                  _authRequired.contains(page))
                const Padding(
                  padding: EdgeInsets.only(top: 5),
                  child: Text(
                    'Login Required',
                    style: TextStyle(color: Colors.red),
                  ),
                ),
              const SizedBox(
                height: 20,
              )
            ],
          ],
        ),
      )
    ];

    return Scaffold(
      appBar: const PreferredSize(
          preferredSize: Size.fromHeight(60),
          child: AltogicAppBar(
            leadingHome: false,
            autoImplementLeading: false,
          )),
      body: ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          itemCount: list.length,
          itemBuilder: (c, i) {
            return Container(
                width: double.infinity,
                alignment: Alignment.center,
                child: SizedBox(width: 600, child: list[i]));
          }),
    );
  }
}
