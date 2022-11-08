import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/controller/user_controller.dart';
import 'package:altogic_flutter_example/src/view/pages/authorization/authorization.dart';
import 'package:altogic_flutter_example/src/view/pages/database/database.dart';
import 'package:altogic_flutter_example/src/view/pages/main_page.dart';
import 'package:altogic_flutter_example/src/view/pages/queue_page.dart';
import 'package:altogic_flutter_example/src/view/pages/realtime/relatime_page.dart';
import 'package:altogic_flutter_example/src/view/pages/redirect/change_email.dart';
import 'package:altogic_flutter_example/src/view/pages/redirect/magic_link_redirect.dart';
import 'package:altogic_flutter_example/src/view/pages/redirect/password_reset_redirect.dart';
import 'package:altogic_flutter_example/src/view/pages/redirect/provider_redirect.dart';
import 'package:altogic_flutter_example/src/view/pages/redirect/verify_mail.dart';
import 'package:altogic_flutter_example/src/view/pages/storage/bucket_manager_page.dart';
import 'package:altogic_flutter_example/src/view/pages/storage/file_manager.dart';
import 'package:altogic_flutter_example/src/view/pages/storage/storage_page.dart';
import 'package:altogic_flutter_example/src/view/pages/task_page.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:url_strategy/url_strategy.dart';

import 'src/view/pages/cache.dart';
import 'src/view/pages/endpoint.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (kIsWeb) {
    setPathUrlStrategy();
  }

  await CurrentUserController().setUser();
  //CurrentUserController().listenUser();
  runApp(const MyApp());
}

// USE THIS FOR WEB DEPLOYMENT
AltogicClient altogic = createClient(
    "https://c1-na.altogic.com/e:62d3ea1510b444043a4f80b7",
    "eb673068d11b468997bbe93c33fdc5f5");

// USE THIS FOR LOCAL DEPLOYMENT
// AltogicClient altogic = createClient(
//     "https://c4-na.altogic.com/e:633bd89b98cd8243629533e3",
//     "eb673068d11b468997bbe93c33fdc5f5");

final Map<String, WidgetBuilder> pages = {
  '/': (c) => const MainPage(),
  '/auth': (c) => const AuthorizationPage(),
  '/database': (c) => const DatabasePage(),
  '/endpoint': (c) => const EndpointPage(),
  '/cache': (c) => const CachePage(),
  '/task': (c) => const TaskManagerPage(),
  '/queue': (c) => const QueuePage(),
  '/storage': (c) => const StoragePage(),
  '/realtime': (c) => const RealtimePage(),
};

final routeNames = {
  '/': 'Main',
  '/auth': 'Authorization',
  '/database': 'Database',
  '/chat': 'Chat',
  '/endpoint': 'Endpoint',
  '/cache': 'Cache',
  '/task': 'Task',
  '/queue': 'Queue',
  '/storage': 'Storage',
  '/realtime': 'Realtime',
};

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends AltogicState<MyApp> {
  final primaryColor = const Color.fromRGBO(25, 118, 210, 1);

  @override
  void onOauthProviderLink(BuildContext? context, OauthRedirect redirect) {
    // TODO: if you want to handle oauth redirect in mobile app
    // implement this method
  }

  @override
  void onEmailChangeLink(BuildContext? context, ChangeEmailRedirect redirect) {
    // TODO: if you want to handle oauth redirect in mobile app
    // implement this method
  }

  @override
  void onPasswordResetLink(
      BuildContext? context, PasswordResetRedirect redirect) {
    // TODO: if you want to handle oauth redirect in mobile app
    // implement this method
  }

  @override
  void onEmailVerificationLink(
      BuildContext? context, EmailVerificationRedirect redirect) {
    // TODO: if you want to handle oauth redirect in mobile app
    // implement this method
  }

  @override
  void onMagicLink(BuildContext? context, MagicLinkRedirect redirect) {
    // TODO: if you want to handle oauth redirect in mobile app
    // implement this method
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute: '/',
      routes: pages,
      onGenerateRoute: (s) {
        switch (s.name) {
          case '/bucket':
            var args = s.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
                settings: RouteSettings(name: '/bucket/${args['bucket']}'),
                builder: (c) => BucketManagerPage(
                      bucket: args['bucket']!,
                    ));
          case '/file':
            var args = s.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
                settings: RouteSettings(
                    name: '/file/${args['bucket']}/${args['file']}'),
                builder: (c) => FileManagerPage(
                      bucket: args['bucket']!,
                      file: args['file']!,
                    ));
        }

        if (s.name?.startsWith('/bucket') ?? false) {
          return MaterialPageRoute(
              settings: s,
              builder: (c) => BucketManagerPage(
                  bucket: s.name!.replaceAll('/bucket/', '')));
        }
        if (s.name?.startsWith('/file') ?? false) {
          var args = s.name!.replaceAll('/file/', '').split('/');
          return MaterialPageRoute(
              settings: s,
              builder: (c) => FileManagerPage(bucket: args[0], file: args[1]));
        }
        return null;
      },
      onGenerateInitialRoutes: (path) {
        // In web we can get initial route from url
        var redirect = getWebRedirect(path);

        if (redirect != null) {
          switch (redirect.action) {
            case RedirectAction.emailConfirm:
              return [
                MaterialPageRoute(
                    builder: (c) => RedirectEmailPage(
                        redirect: redirect as EmailVerificationRedirect))
              ];
            case RedirectAction.provider:
              return [
                MaterialPageRoute(
                    builder: (c) => RedirectProviderPage(
                        redirect: redirect as OauthRedirect))
              ];
            case RedirectAction.passwordReset:
              return [
                MaterialPageRoute(
                    builder: (c) => ResetPwdRedirectPage(
                        redirect: redirect as PasswordResetRedirect))
              ];
            case RedirectAction.magicLink:
              return [
                MaterialPageRoute(
                    builder: (c) => MagicLinkRedirectPage(
                          redirect: redirect as MagicLinkRedirect,
                        ))
              ];
            case RedirectAction.changeEmail:
              return [
                MaterialPageRoute(
                    builder: (c) => ChangeMailRedirectPage(
                          redirect: redirect as ChangeEmailRedirect,
                        ))
              ];
          }
        }

        var uri = Uri.parse(path);
        if (path.startsWith('/bucket')) {
          return [
            MaterialPageRoute(
                settings:
                    RouteSettings(name: path, arguments: uri.queryParameters),
                builder: (c) =>
                    BucketManagerPage(bucket: path.replaceAll('/bucket/', '')))
          ];
        }

        if (path.startsWith('/file')) {
          var args = path.replaceAll('/file/', '').split('/');
          return [
            MaterialPageRoute(
                builder: (c) => FileManagerPage(bucket: args[0], file: args[1]))
          ];
        }

        if (pages.containsKey(uri.path)) {
          return [
            MaterialPageRoute(
              builder: pages[uri.path]!,
            )
          ];
        }
        return [
          MaterialPageRoute(
            builder: pages['/']!,
          )
        ];
      },
      debugShowCheckedModeBanner: false,
      title: 'Altogic Flutter Demo',
      theme: ThemeData(
        useMaterial3: false,
        fontFamily: 'WorkSans',
        primarySwatch:
            MaterialColor(primaryColor.value, getSwatch(primaryColor)),
        buttonTheme: const ButtonThemeData(
          buttonColor: Color.fromRGBO(25, 118, 210, 1),
          textTheme: ButtonTextTheme.primary,
        ),
      ),
    );
  }

  Map<int, Color> getSwatch(Color color) {
    final hslColor = HSLColor.fromColor(color);
    final lightness = hslColor.lightness;
    const lowDivisor = 6;

    const highDivisor = 5;

    final lowStep = (1.0 - lightness) / lowDivisor;
    final highStep = lightness / highDivisor;

    return {
      50: (hslColor.withLightness(lightness + (lowStep * 5))).toColor(),
      100: (hslColor.withLightness(lightness + (lowStep * 4))).toColor(),
      200: (hslColor.withLightness(lightness + (lowStep * 3))).toColor(),
      300: (hslColor.withLightness(lightness + (lowStep * 2))).toColor(),
      400: (hslColor.withLightness(lightness + lowStep)).toColor(),
      500: (hslColor.withLightness(lightness)).toColor(),
      600: (hslColor.withLightness(lightness - highStep)).toColor(),
      700: (hslColor.withLightness(lightness - (highStep * 2))).toColor(),
      800: (hslColor.withLightness(lightness - (highStep * 3))).toColor(),
      900: (hslColor.withLightness(lightness - (highStep * 4))).toColor(),
    };
  }
}
