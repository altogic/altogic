import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:flutter/cupertino.dart';

import '../../view/widgets/documentation/texts.dart';

mixin AuthDoc {
  static List<DocumentationObject> signUpWithEmail(BuildContext context) => [
        const AutoSpan('Creates a new user using the email and password '
            'authentication method in the database.'),
        vSpace,
        const AutoSpan(
            'If email confirmation is *enabled* in your app authentication'
            ' settings then a confirm sign up email will be sent to the user'
            ' with a link to click and this method will return the user data with'
            ' a `null` session. Until the user clicks this link, the email address'
            ' will not be verified and a session will not be created. If a user tries'
            ' to signIn to an account where email has not been confirmed yet, an error'
            ' message will be returned asking for email verification.'),
        vSpace,
        const DartCode("""
var response = altogic.auth.signUpWithEmail(
  emailAddress,
  password,
 );
 
 if (response.error == null) {
   // success
 }
        """),
        vSpace,
        const Description(
            "In addition, the user's information can be given during sign up."),
        vSpace,
        const DartCode("""
altogic.auth.signUpWithEmail(
  emailAddress,
  password,
  name
 );
"""),
        vSpace,
        const Description("Or ;"),
        vSpace,
        const DartCode("""
var response = await altogic.auth.signUpWithEmail(
  emailAddress,
  password,
  {'name' : 'John Doe' , 'age' : 20}
 );
"""),
      ];

  static List<DocumentationObject> signUpWithPhone(BuildContext context) => [
        const AutoSpan(
            'Creates a new user using the mobile phone number and password '
            'authentication method in the database.\n\n'
            'If phone number confirmation is *enabled* in your app authentication'
            'settings then a confirmation code SMS will be sent to the phone and this'
            'method will return the user data and a `null` session.'
            'Until the user validates this code by calling '
            '`verifyPhone`, the phone number will not be verified. If a'
            ' user tries to signIn to an account where phone number has'
            ' not been confirmed yet, an error message will be returned'
            ' asking for phone number verification.'),
        vSpace,
        const DartCode("""
var response = altogic.auth.signUpWithPhone(
  phoneNumber,
  password,
 );
 
 if (response.error == null) {
   // success
 }
        """),
        vSpace,
        const Description(
            "In addition, the user's information can be given during sign up."),
        vSpace,
        const DartCode("""
altogic.auth.signUpWithPhone(
  phoneNumber,
  password,
  name
 );
"""),
        vSpace,
        const Description("Or ;"),
        vSpace,
        const DartCode("""
var response = await altogic.auth.signUpWithPhone(
  phoneNumber,
  password,
  {'name' : 'John Doe' , 'age' : 20}
 );
"""),
      ];

  static List<DocumentationObject> signInWithEmail(BuildContext context) {
    return const [
      AutoSpan(
          'Log in an existing user using email and password. In order to use email'
          ' and password based log in, the authentication provider needs to be'
          ' Altogic, meaning a user with email and password credentials exists'
          ' in the app database.'
          '\n'
          'If email confirmation is *enabled* in your app authentication'
          ' settings and if the email of the user has not been verified yet,'
          ' this method will return an error message.'),
      vSpace,
      DartCode("""
var response = altogic.auth.signInWithEmail(
  emailAddress,
  password,
 );
  
 if (response.error == null) {
   // success
 }
        """),
    ];
  }

  static List<DocumentationObject> signInWithPhone(BuildContext context) {
    return const [
      AutoSpan(
          ' Log in an existing user using phone number and password. In order to'
          ' use phone and password based log in, the authentication provider'
          ' needs to be Altogic, meaning a user with phone and password credentials'
          ' exists in the app database.'
          '\n'
          'If phone number confirmation is *enabled* in your app authentication'
          ' settings and if the phone of the user has not been verified yet, this'
          ' method will return an error message.'),
      vSpace,
      DartCode("""
var response = altogic.auth.signInWithPhone(
  phoneNumber,
  password,
 );
 
 if (response.error == null) {
   // success
 }
        """),
    ];
  }

  static List<DocumentationObject> signInWithCode(BuildContext context) {
    return const [
      AutoSpan(
          "Log in an existing user using phone number and SMS code (OTP - one time"
          " password) that is sent to the phone. In order to use phone and password"
          " based log in, the authentication provider needs to be Altogic, meaning a"
          " user with phone and password credentials exists in the app database and"
          " *sign in using authorization codes* needs to be *enabled* in your app"
          " authentication settings. Before calling this method, you need to call the"
          " `sendSignInCode` method to get the SMS code delivered to the phone."),
      vSpace,
      DartCode("""
var response = altogic.auth.signInWithCode(
  phoneNumber,
  code,
 );
 
 if (response.error == null) {
   // success
 }
        """),
    ];
  }

  static List<DocumentationObject> signOut(BuildContext context) {
    return const [
      AutoSpan(
          'If an input token is *not* provided, signs out the user from the'
          ' current session, clears user and session data in local storage and'
          ' removes the *Session* header in `Fetcher`. Otherwise, signs out'
          ' the user from the session identified by the input token.'),
      vSpace,
      LeftSpace(
          'An active user session is required (e.g., user needs to be logged in)'
          ' to call this method.'),
      vSpace,
      DartCode("""
var errors = altogic.auth.signOut();
 
 if (errors == null) {
   // success
 }
        """),
    ];
  }

  static List<DocumentationObject> signOutAll(BuildContext context) {
    return const [
      AutoSpan(
          'A user can have multiple active sessions (e.g., logged in form multiple'
          ' different devices, browsers). This method signs out users from all their'
          ' active sessions. For the client that triggers this method, also clears'
          ' user and session data in local storage, and removes the *Session*'
          ' header in `Fetcher`.'),
      vSpace,
      LeftSpace(
          'An active user session is required (e.g., user needs to be logged in)'
          ' to call this method.'),
      vSpace,
      DartCode("""
var errors = altogic.auth.signOutAll();
 
 if (errors == null) {
   // success
 }
        """),
    ];
  }

  static List<DocumentationObject> signOutAllExceptCurrent(
      BuildContext context) {
    return const [
      AutoSpan('Signs out users from all their active sessions except'
          ' the current one which makes the api call.'),
      vSpace,
      LeftSpace(
          'An active user session is required (e.g., user needs to be logged in)'
          ' to call this method.'),
      vSpace,
      DartCode("""
var errors = altogic.auth.signOutAllExceptCurrent();
 
 if (errors == null) {
   // success
 }
        """),
    ];
  }
}
