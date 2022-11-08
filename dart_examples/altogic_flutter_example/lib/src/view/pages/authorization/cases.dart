import 'package:altogic_flutter_example/src/doc/auth/sign_in.dart';
import 'package:altogic_flutter_example/src/service/auth_service.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/input.dart';
import 'package:flutter/material.dart';

import '../../widgets/documentation/code.dart';
import '../../widgets/documentation/texts.dart';

class SignUpWithEmailMethod extends MethodWrap {
  SignUpWithEmailMethod();

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController nameController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan('Creates a new user using the email and password '
            'authentication method in the database.'),
        vSpace,
        Description('For setting other fields of user look more information.'),
        vSpace,
        LeftSpace('A confirmation mail will '
            'be sent when the sign-up method works successfully.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => AuthDoc.signUpWithEmail;

  @override
  String get name => 'Sign Up With Email';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Email', editingController: emailController),
      AltogicInput(hint: 'Password', editingController: passwordController),
      AltogicInput(hint: 'User Name', editingController: nameController),
      AltogicButton(
          body: 'Sign Up',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).signUpWithEmail(
                  emailController.text,
                  passwordController.text,
                  nameController.text);
            });
          },
          listenable: Listenable.merge([emailController, passwordController]),
          enabled: () {
            return !loading &&
                emailController.text.isNotEmpty &&
                passwordController.text.isNotEmpty;
          }),
    ];
  }
}

class SignUpWithPhoneMethod extends MethodWrap {
  SignUpWithPhoneMethod();

  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController nameController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan(
            'Creates a new user using the mobile phone number and password '
            'authentication method in the database.\n\n'
            'If phone number confirmation is *enabled* in your app authentication'
            'settings then a confirmation code SMS will be sent to the phone and this'
            'method will return the user data and a `null` session.'),
        vSpace,
        Description('For setting other fields of user look more information.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => AuthDoc.signUpWithPhone;

  @override
  String get name => 'Sign Up With Phone';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Phone', editingController: phoneController),
      AltogicInput(hint: 'Password', editingController: passwordController),
      AltogicInput(hint: 'User Name', editingController: nameController),
      const PhoneNotAvailable(),
      AltogicButton(
          body: 'Sign Up',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).signUpWithPhone(
                  phoneController.text,
                  passwordController.text,
                  nameController.text);
            });
          },
          listenable: Listenable.merge([phoneController, passwordController]),
          enabled: () {
            return !loading &&
                phoneController.text.isNotEmpty &&
                passwordController.text.isNotEmpty;
          }),
    ];
  }
}

class PhoneNotAvailable extends StatelessWidget {
  const PhoneNotAvailable({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Column(
        children: const [
          Text(
            "Phone number authentication is not available in this example.",
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.red, fontSize: 18),
          ),
          Text(
            "You can configure it in your Altogic authorization settings. "
            "Twilio, MessageBird and Vonage services supported.",
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.black),
          ),
        ],
      ),
    );
  }
}

class SignInWithEmailMethod extends MethodWrap {
  SignInWithEmailMethod();

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  List<DocumentationObject> get description =>
      const [Description('Log in an existing user using email and password.')];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => AuthDoc.signInWithEmail;

  @override
  String get name => 'Sign In With Email';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Email', editingController: emailController),
      AltogicInput(hint: 'Password', editingController: passwordController),
      AltogicButton(
          body: 'Sign In',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).signInWithEmail(
                  emailController.text, passwordController.text);
            });
          },
          listenable: Listenable.merge([emailController, passwordController]),
          enabled: () {
            return !loading &&
                emailController.text.isNotEmpty &&
                passwordController.text.isNotEmpty;
          }),
    ];
  }
}

class SignInWithPhoneMethod extends MethodWrap {
  SignInWithPhoneMethod();

  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        Description('Log in an existing user using phone number and password.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => AuthDoc.signInWithPhone;

  @override
  String get name => 'Sign In With Phone';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Phone', editingController: phoneController),
      AltogicInput(hint: 'Password', editingController: passwordController),
      const PhoneNotAvailable(),
      AltogicButton(
          body: 'Sign In',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).signInWithPhone(
                  phoneController.text, passwordController.text);
            });
          },
          listenable: Listenable.merge([phoneController, passwordController]),
          enabled: () {
            return !loading &&
                phoneController.text.isNotEmpty &&
                passwordController.text.isNotEmpty;
          }),
    ];
  }
}

class SignInWithCodeMethod extends MethodWrap {
  SignInWithCodeMethod();

  final TextEditingController phoneController = TextEditingController();
  final TextEditingController codeController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan('Log in an existing user using phone number and SMS code'
            ' (OTP - one time password) that is sent to the phone. Before calling this method, you need to call the'
            ' `sendSignInCode` method to get the SMS code delivered to the phone.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => AuthDoc.signInWithCode;

  @override
  String get name => 'Sign In With Code';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Phone', editingController: phoneController),
      AltogicInput(hint: 'Code', editingController: codeController),
      const PhoneNotAvailable(),
      AltogicButton(
          body: 'Sign In',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context)
                  .signInWithPhone(phoneController.text, codeController.text);
            });
          },
          listenable: Listenable.merge([phoneController, codeController]),
          enabled: () {
            return !loading &&
                phoneController.text.isNotEmpty &&
                codeController.text.isNotEmpty;
          }),
    ];
  }
}

class SignInWithProviderMethod extends MethodWrap {
  SignInWithProviderMethod();

  var r =
      'Signs in a user using the Oauth2 flow of the specified provider. Calling'
      ' this method with the name of the sign in provider will return a URL that'
      ' user have to redirect.'
      ''
      'If the provider sign in completes successfully, Altogic directs the user'
      ' to the redirect URL with an access token that you can use to fetch the'
      ' authentication grants (e.g., user and session data).'
      ''
      'If you are using this package with Flutter, ``signInWithProviderFlutter``'
      ' function will launch redirect URL automatically. Then, you can use the'
      ' ``handleRedirectUri`` function in `onGenerateRoute` or'
      ' `onGenerateInitialRoute` to get auth information when your application is'
      ' opened again with the redirect URL you specified in the Altogic interface.'
      ''
      'To access the ``signInWithProviderFlutter`` and ``handleRedirectUri``'
      ' methods, you must import the altogic_flutter package.'
      ''
      'If this is the first time a user is using this provider then a new user'
      ' record is created in the database, otherwise the lastLoginAt field value'
      ' of the existing user record is updated.'
      ''
      '[provider] can be :'
      '   "google" |'
      '   "facebook" |'
      '   "twitter" |'
      '   "discord" |'
      '   "github"';

  @override
  List<DocumentationObject> get description => const [
        AutoSpan(
            'Signs in a user using the Oauth2 flow of the specified provider. Calling'
            ' this method with the name of the sign in provider will return a URL that'
            ' user have to redirect.'),
        vSpace,
        AutoSpan(
            'If the provider sign in completes successfully, Altogic directs the user'
            ' to the redirect URL with an access token that you can use to fetch the'
            ' authentication grants (e.g., user and session data).'),
        vSpace,
        AutoSpan(
            'Available providers: google, facebook, twitter, discord, github'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            const AutoSpan(
                'If you are using this package with Flutter, `signInWithProviderFlutter`'
                ' function will launch redirect URL automatically. Then, you can use the'
                ' `handleRedirectUri` function in `onGenerateRoute` or'
                ' `onGenerateInitialRoute` to get auth information when your application is'
                ' opened again with the redirect URL you specified in the Altogic interface.'
                '\n\n'
                'To access the `signInWithProviderFlutter` and `handleRedirectUri`'
                ' methods, you must import the altogic_flutter package.'
                '\n\n'
                'If this is the first time a user is using this provider then a new user'
                ' record is created in the database, otherwise the lastLoginAt field value'
                ' of the existing user record is updated.'),
            vSpace,
            const DartCode("""
altogic.auth.signInWithProviderFlutter(provider);
    """),
            vSpace,
            const AutoSpan(
                'Now, the oAuth screen opens. After the user signs in, the'
                ' redirect URL is opened again. You can use the `handleRedirectUri`'),
            vSpace,
            const Header('Handling redirect', level: 2),
            vSpace,
            const Header("Flutter Web / Dart WebDev", level: 3),
            vSpace,
            const AutoSpan(
                'If you are using Flutter Web or Dart WebDev, you can use the `handleRedirectUri`'
                ' function in redirect page, you can route to the redirect page'
                ' in `onGenerateInitialRoute` in the get auth information'
                ' when your application is opened again with the redirect URL you specified in the'
                ' Altogic interface.'),
            vSpace,
            const Header('Other Platforms', level: 3),
            vSpace,
            const AutoSpan(
                'If you are using other platforms, you can use the `uni_links` package and deep linking.'
                ' On your application splash screen, you can check if the '
                ' application is opened with deep link and the url which open your app.'
                '\n\n'
                'If your app opened with deep link, you can use the `handleRedirectUri` to get auth result.'),
          ];

  @override
  String get name => 'Sign In With Provider';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Google',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).signInWithProvider('google');
            });
          }),
      AltogicButton(
          body: 'Github',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).signInWithProvider('github');
            });
          }),
    ];
  }
}

class SignOutMethod extends MethodWrap {
  final TextEditingController sessionToken = TextEditingController();

  SignOutMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
          hint: 'Session Token (optional)', editingController: sessionToken),
      AltogicButton(
        body: 'Sign Out',
        onPressed: () {
          asyncWrapper(() async {
            await AuthService.of(context).signOut(
                sessionToken.text.trim().isEmpty ? null : sessionToken.text);
          });
        },
      ),
    ];
  }

  @override
  List<DocumentationObject> get description => const [
        AutoSpan(
            'Log out. If an input token is *not* provided, signs out the user from the'
            ' current session')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => AuthDoc.signOut;

  @override
  String get name => 'Sign Out';
}

class SignOutAllMethod extends MethodWrap {
  SignOutAllMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
        body: 'Sign Out All',
        onPressed: () {
          asyncWrapper(() async {
            await AuthService.of(context).signOutAll();
          });
        },
      ),
    ];
  }

  @override
  List<DocumentationObject> get description => const [
        AutoSpan('Signs out users from all their'
            'active sessions.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => AuthDoc.signOutAll;

  @override
  String get name => 'Sign Out All';
}

class SignOutMethodAllEx extends MethodWrap {
  final TextEditingController sessionToken = TextEditingController();

  SignOutMethodAllEx();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
        body: 'Sign Out All Except Current',
        onPressed: () {
          asyncWrapper(() async {
            await AuthService.of(context).signOutAllExceptCurrent();
          });
        },
      ),
    ];
  }

  @override
  List<DocumentationObject> get description => const [
        AutoSpan('This method signs out users from all their'
            'active sessions except the current one which makes the api call.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => AuthDoc.signOutAllExceptCurrent;

  @override
  String get name => 'Sign Out All Except Current';
}

class ReSendVerificationEmailMethod extends MethodWrap {
  ReSendVerificationEmailMethod();

  final TextEditingController emailController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan(
            'Resends the email to verify the user\'s email address. If the user\'s'
            ' email has already been validated or email confirmation is *disabled*'
            ' in your app authentication settings, it returns an error.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Resends the email to verify the user\'s email address. If the user\'s'
                ' email has already been validated or email confirmation is *disabled*'
                ' in your app authentication settings, it returns an error.'),
            vSpace,
            const AutoSpan('Example:'),
            vSpace,
            const DartCode("""
var errors  = await altogic.auth.resendVerificationEmail(
  emailAddress
);

if (errors != null) {
  // success
}
        """)
          ];

  @override
  String get name => 'Re-Send Verification Email';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Email', editingController: emailController),
      AltogicButton(
          body: 'Send',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context)
                  .resendVerificationEmail(emailController.text);
            });
          },
          listenable: emailController,
          enabled: () {
            return !loading && emailController.text.isNotEmpty;
          }),
    ];
  }
}

class ReSendVerificationCodeMethod extends MethodWrap {
  ReSendVerificationCodeMethod();

  final TextEditingController phoneController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan(
            'Resends the code to verify the user\'s phone number. If the user\'s phone'
            ' has already been validated or phone confirmation is *disabled* in your'
            ' app authentication settings, it returns an error.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Resends the code to verify the user\'s phone number. If the user\'s phone'
                ' has already been validated or phone confirmation is *disabled* in your'
                ' app authentication settings, it returns an error.'),
            vSpace,
            const AutoSpan('Example:'),
            vSpace,
            const DartCode("""
var errors  = await altogic.auth.resendVerificationCode(
  phoneNumber
);

if (errors != null) {
  // success
}
        """)
          ];

  @override
  String get name => 'Re-Send Verification Code';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Phone', editingController: phoneController),
      const PhoneNotAvailable(),
      AltogicButton(
          body: 'Send',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context)
                  .resendVerificationCode(phoneController.text);
            });
          },
          listenable: phoneController,
          enabled: () {
            return !loading && phoneController.text.isNotEmpty;
          }),
    ];
  }
}

class SendMagicLinkMethod extends MethodWrap {
  SendMagicLinkMethod();

  final TextEditingController emailController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan('Sends a magic link to the email of the user.\n\n'
            'This method works only if email confirmation is *enabled* in your app'
            ' authentication settings and the user\'s email address has already been'
            ' verified.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Sends a magic link to the email of the user.'
                '\n\n'
                'This method works only if email confirmation is *enabled* in your app'
                ' authentication settings and the user\'s email address has already been'
                ' verified.'
                '\n\n'
                'When the user clicks on the link in email, Altogic verifies the validity'
                ' of the magic link and if successful redirects the user to the redirect'
                ' URL specified in you app authentication settings with an access token in'
                ' a query string parameter named \'access_token.\' You can call `getAuthGrant` '
                ' method with this access token to create a new session object.'
                '\n\n'
                'If email confirmation is *disabled* in your app authentication settings'
                ' or if the user\'s email has not been verified, it returns an error.'),
            vSpace,
            const AutoSpan('Example:'),
            vSpace,
            const DartCode("""
var errors  = await altogic.auth.sendMagicLink(
  emailAddress
);

if (errors != null) {
  // success
}
        """)
          ];

  @override
  String get name => 'Send Magic Link';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Email', editingController: emailController),
      AltogicButton(
          body: 'Send',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).sendMagicLink(emailController.text);
            });
          },
          listenable: emailController,
          enabled: () {
            return !loading && emailController.text.isNotEmpty;
          }),
    ];
  }
}

class SendResetPwdEmailMethod extends MethodWrap {
  SendResetPwdEmailMethod();

  final TextEditingController emailController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan('Sends an email with a link to reset password.'
            '\n\n'
            'This method works only if email confirmation is *enabled* in your app'
            ' authentication settings and the user\'s email address has already been'
            ' verified.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Sends an email with a link to reset password.'
                '\n\n'
                'This method works only if email confirmation is *enabled* in your app'
                ' authentication settings and the user\'s email address has already been'
                ' verified.'
                '\n\n'
                'When the user clicks on the link in email, Altogic verifies the validity'
                ' of the reset-password link and if successful redirects the user to the'
                ' redirect URL specified in you app authentication settings with an access'
                ' token in a query string parameter named `access_token`. At this state your'
                ' app needs to detect `action=reset-pwd` in the redirect URL and display'
                ' a password reset form to the user. After getting the new password from'
                ' the user, you can call [resetPwdWithToken] method with the access'
                ' token and new password to change the password of the user.'
                '\n\n'
                'If email confirmation is **disabled** in your app authentication settings'
                ' or if the user\'s email has not been verified, it returns an error.'),
            vSpace,
            const Description('Example:'),
            vSpace,
            const DartCode("""
var errors  = await altogic.auth.sendResetPwdEmail(
  emailAddress
);

if (errors != null) {
  // success
}
        """)
          ];

  @override
  String get name => 'Send Reset Password Email';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Email', editingController: emailController),
      AltogicButton(
          body: 'Send',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context)
                  .sendResetPwdEmail(emailController.text);
            });
          },
          listenable: emailController,
          enabled: () {
            return !loading && emailController.text.isNotEmpty;
          }),
    ];
  }
}

class SendResetPwdCodeMethod extends MethodWrap {
  SendResetPwdCodeMethod();

  final TextEditingController phoneController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan('Sends an SMS code to reset password.'
            '\n\n'
            'This method works only if phone number confirmation is *enabled* in your'
            ' app authentication settings and the user\'s phone number has already been'
            ' verified.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Sends an SMS code to reset password.'
                '\n\n'
                'This method works only if phone number confirmation is *enabled* in your'
                ' app authentication settings and the user\'s phone number has already been'
                ' verified.'
                '\n\n'
                'After sending the SMS code, you need to display a password reset form to'
                ' the user. When you get the new password from the user, you can call'
                ' `resetPwdWithCode` method with the phone number of the user,'
                ' SMS code and new password.'
                '\n\n'
                'If phone number confirmation is *disabled* in your app authentication'
                ' settings or if the user\'s phone has not been verified, it returns an error'),
            const Description('Example:'),
            vSpace,
            const DartCode("""
var errors  = await altogic.auth.sendResetPwdCode(
  phoneNumber
);

if (errors != null) {
  // success
}
        """)
          ];

  @override
  String get name => 'Send Reset Password Code';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Phone Number', editingController: phoneController),
      const PhoneNotAvailable(),
      AltogicButton(
          body: 'Send',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context)
                  .sendResetPwdEmail(phoneController.text);
            });
          },
          listenable: phoneController,
          enabled: () {
            return !loading && phoneController.text.isNotEmpty;
          }),
    ];
  }
}

class SendSignInCodeMethod extends MethodWrap {
  SendSignInCodeMethod();

  final TextEditingController phoneController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan(
            'Sends an SMS code (OTP - one time password) that can be used to sign in'
            ' to the phone number of the user.'
            '\n\n'
            'This method works only if sign in using authorization codes is *enabled*'
            ' in your app authentication settings and the user\'s phone number has'
            ' already been verified.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Sends an SMS code (OTP - one time password) that can be used to sign in'
                ' to the phone number of the user.'
                '\n\n'
                'This method works only if sign in using authorization codes is *enabled*'
                ' in your app authentication settings and the user\'s phone number has'
                ' already been verified.'
                '\n\n'
                'After getting the SMS code you can call the `signInWithCode` method.'
                ' Altogic verifies the validity of the code and if successful returns the'
                ' auth grants (e.g., session) of the user.'
                '\n\n'
                'If sign in using authorization codes is *disabled* in your app'
                ' authentication settings or if the user\'s phone has not been verified,'
                ' it returns an error.'),
            const Description('Example:'),
            vSpace,
            const DartCode("""
var errors  = await altogic.auth.sendSignInCode(
  phoneNumber
);

if (errors != null) {
  // success
}
        """)
          ];

  @override
  String get name => 'Send Sign In Code';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Phone Number', editingController: phoneController),
      const PhoneNotAvailable(),
      AltogicButton(
          body: 'Send',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context)
                  .sendSignInCode(phoneController.text);
            });
          },
          listenable: phoneController,
          enabled: () {
            return !loading && phoneController.text.isNotEmpty;
          }),
    ];
  }
}

class ResetPwdWithToken extends MethodWrap {
  ResetPwdWithToken();

  final TextEditingController tokenController = TextEditingController();
  final TextEditingController newPwdController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan(
            ' Resets the password of the user using the access token provided through'
            ' the `sendResetPwdEmail` flow.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Resets the password of the user using the access token provided through'
                ' the `sendResetPwdEmail` flow.'
                ''
                '`accessToken` The access token that is retrieved from'
                ' the redirect URL query string parameter'),
            const Description('Example:'),
            vSpace,
            const DartCode("""
var errors = await altogic.auth.resetPwdWithToken(
  token,
  newPwd
);

if (errors != null) {
  // success
}
        """)
          ];

  @override
  String get name => 'Reset Password With Token';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Token', editingController: tokenController),
      AltogicInput(hint: 'New Password', editingController: newPwdController),
      AltogicButton(
          body: 'Change',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).resetPwdWithToken(
                  tokenController.text, newPwdController.text);
            });
          },
          listenable: Listenable.merge([tokenController, newPwdController]),
          enabled: () {
            return !loading &&
                tokenController.text.isNotEmpty &&
                newPwdController.text.isEmpty;
          }),
    ];
  }
}

class ResetPwdWithCode extends MethodWrap {
  ResetPwdWithCode();

  final TextEditingController phoneController = TextEditingController();
  final TextEditingController codeController = TextEditingController();
  final TextEditingController newPwdController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan('Resets the password of the user using the SMS code provided '
            'through the `sendResetPwdCode` method.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Resets the password of the user using the SMS code provided '
                'through the `sendResetPwdCode` method.'),
            const Description('Example:'),
            vSpace,
            const DartCode("""
var errors = await altogic.auth.resetPwdWithCode(
  phoneNumber,
  code,
  newPwd
);

if (errors != null) {
  // success
}
        """)
          ];

  @override
  String get name => 'Reset Password With Code';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Phone', editingController: phoneController),
      AltogicInput(hint: 'Code', editingController: codeController),
      AltogicInput(hint: 'New Password', editingController: newPwdController),
      const PhoneNotAvailable(),
      AltogicButton(
          body: 'Change',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).resetPwdWithCode(
                  phoneController.text,
                  codeController.text,
                  newPwdController.text);
            });
          },
          listenable: Listenable.merge(
              [phoneController, codeController, newPwdController]),
          enabled: () {
            return !loading &&
                phoneController.text.isNotEmpty &&
                newPwdController.text.isEmpty &&
                codeController.text.isNotEmpty;
          }),
    ];
  }
}

class GetAllSessionsMethod extends MethodWrap {
  GetAllSessionsMethod();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan('Gets all active sessions of a user.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Gets all active sessions of a user.'),
            vSpace,
            const LeftSpace(
                'An active user session is required (e.g., user needs to be '
                'logged in) to call this method.'),
            vSpace,
            const Description('Example:'),
            vSpace,
            const DartCode("""
var res  = await altogic.auth.getAllSessions();

if (res.errors != null) {
  // success
}
""")
          ];

  @override
  String get name => 'Get All Sessions';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Get All Sessions',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).getAllSessions();
            });
          }),
    ];
  }
}

class GetAllUserFromDbMethod extends MethodWrap {
  GetAllUserFromDbMethod();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan('Retrieves the user associated with the active'
            ' session from the database.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Retrieves the user associated with the active '
                'session from the database.'),
            vSpace,
            const LeftSpace(
                'An active user session is required (e.g., user needs to be '
                'logged in) to call this method.'),
            vSpace,
            const Description('Example:'),
            vSpace,
            const DartCode("""
var res = await altogic.auth.getUserFromDb();

if (res.errors != null) {
  // success
}
""")
          ];

  @override
  String get name => 'Get User From Db';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
        body: 'Get User From Db',
        onPressed: () {
          asyncWrapper(() async {
            await AuthService.of(context).getUserFromDb();
          });
        },
      ),
    ];
  }
}

class GetAuthGrant extends MethodWrap {
  GetAuthGrant();

  final TextEditingController tokenController = TextEditingController();

  @override
  List<DocumentationObject> get description => const [
        AutoSpan(
            'Retrieves the authorization grants of a user using the specified input'
            ' `accessToken`.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Retrieves the authorization grants of a user using the specified input'
                ' `accessToken`. If no `accessToken` specified as input, tries to retrieve'
                ' the `accessToken` from the browser url query string parameter named'
                ' `access_token`. So on Flutter (if you don\'t use dart webdev),'
                ' `accessToken` cannot be null. Else, throws UnsupportedError.'
                '\n\n'
                'If successful this method also saves the user and session data to local'
                ' storage and sets the *Session* header in `Fetcher`'),
            const Description('Example:'),
            vSpace,
            const DartCode("""
var res = await altogic.auth.getAuthGrant(
  accessToken
);

if (res.errors != null) {
  // success
}
        """)
          ];

  @override
  String get name => 'Get Auth Grant';

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Access Token', editingController: tokenController),
      AltogicButton(
          body: 'Get Auth Grant',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context).getAuthGrant(tokenController.text);
            });
          },
          listenable: tokenController,
          enabled: () {
            return !loading && tokenController.text.isNotEmpty;
          }),
    ];
  }
}

class ChangeEmail extends MethodWrap {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  ChangeEmail();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'New Email', editingController: emailController),
      AltogicInput(hint: 'Password', editingController: passwordController),
      AltogicButton(
          body: 'Change',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context)
                  .changeEmail(passwordController.text, emailController.text);
            });
          },
          listenable: Listenable.merge([emailController, passwordController]),
          enabled: () {
            return !loading &&
                passwordController.text.isNotEmpty &&
                emailController.text.isNotEmpty;
          }),
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const Description('Change email address with current password.'),
        vSpace,
        const AutoSpan(
            'If *Confirm Email* is checked, `changeEmail` not returns `User`.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const Description('Change email address with current password.'),
            vSpace,
            const DartCode("""
var result = await altogic.auth.changeEmail(password,email);

if (result.errors == null) {
   // success
}
""")
          ];

  @override
  String get name => 'Change Email';
}

class ChangePhone extends MethodWrap {
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  ChangePhone();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'New Phone', editingController: phoneController),
      AltogicInput(hint: 'Password', editingController: passwordController),
      const PhoneNotAvailable(),
      AltogicButton(
          body: 'Change',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context)
                  .changePhone(passwordController.text, phoneController.text);
            });
          },
          listenable: Listenable.merge([phoneController, passwordController]),
          enabled: () {
            return !loading &&
                passwordController.text.isNotEmpty &&
                phoneController.text.isNotEmpty;
          }),
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Changes the phone number of the user to a new one.'
            '\n\n'
            'If phone number confirmation is *disabled* in your app authentication'
            ' settings, it immediately updates the user\'s phone number and returns back'
            ' the updated user data.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Changes the phone number of the user to a new one.'
                '\n\n'
                'If phone number confirmation is *disabled* in your app authentication'
                ' settings, it immediately updates the user\'s phone number and returns back'
                ' the updated user data.'
                '\n\n'
                'If phone number confirmation is *enabled* in your app authentication'
                ' settings, it sends a confirmation SMS code to the new phone number and'
                ' returns the current user\'s info. After sending the SMS code by calling'
                ' this method, you need to show a form to the user to enter this SMS code'
                ' and call `verifyPhone` method with the new phone number and the code to'
                ' change user\'s phone number to the new one.'),
            vSpace,
            const LeftSpace(
                'An active user session is required (e.g., user needs to be logged in)'
                ' to call this method.*'),
            vSpace,
            const DartCode("""
var result = await altogic.auth.changePhone(password,phone);

if (result.errors == null) {
   // success
}
""")
          ];

  @override
  String get name => 'Change Phone';
}

class VerifyPhone extends MethodWrap {
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController codeController = TextEditingController();

  VerifyPhone();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Phone', editingController: phoneController),
      AltogicInput(hint: 'Code', editingController: codeController),
      AltogicButton(
          body: 'Verify',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context)
                  .verifyPhone(phoneController.text, codeController.text);
            });
          },
          listenable: Listenable.merge([phoneController, codeController]),
          enabled: () {
            return !loading &&
                codeController.text.isNotEmpty &&
                phoneController.text.isNotEmpty;
          }),
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Verifies the phone number using code sent in SMS and if verified, returns'
            ' the auth grants (e.g., user and session data) of the user if the phone is'
            ' verified due to a new sign up.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Verifies the phone number using code sent in SMS and if verified, returns'
                ' the auth grants (e.g., user and session data) of the user if the phone is'
                ' verified due to a new sign up. If the phone is verified using the code'
                ' send as a result of calling the `changePhone` method, returns the updated'
                ' user data only.'
                '\n\n'
                'If the code is invalid or expired, it returns an error message.'),
            vSpace,
            const DartCode("""
var result = await altogic.auth.verifyPhone(phone,code);

if (result.errors == null) {
   // success
}
""")
          ];

  @override
  String get name => 'Verify Phone';
}

class ChangePassword extends MethodWrap {
  final TextEditingController newPassword = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  ChangePassword();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'New Password', editingController: newPassword),
      AltogicInput(hint: 'Password', editingController: passwordController),
      AltogicButton(
          body: 'Change',
          onPressed: () {
            asyncWrapper(() async {
              await AuthService.of(context)
                  .changePassword(passwordController.text, newPassword.text);
            });
          },
          listenable: Listenable.merge([newPassword, passwordController]),
          enabled: () {
            return !loading &&
                passwordController.text.isNotEmpty &&
                newPassword.text.isNotEmpty;
          }),
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const Description('Change password with current password.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const Description('Change password with current password.'),
            vSpace,
            const DartCode("""
var errors = await altogic.auth.changePassword(newPassword,currentPass);

if (errors == null) {
  // success
}
""")
          ];

  @override
  String get name => 'Change Password';
}
