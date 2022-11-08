import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/main.dart';
import 'package:altogic_flutter_example/src/controller/user_controller.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:flutter/material.dart';

class AuthService extends ServiceBase {
  AuthService();

  static AuthService of(BuildContext context) =>
      InheritedService.of<AuthService>(context);

  CurrentUserController currentUserController = CurrentUserController();

  Future<void> signUpWithEmail(
      String email, String password, String name) async {
    response.loading();
    var res = await altogic.auth.signUpWithEmail(email, password, name);
    if (res.errors != null) {
      response.error(res.errors);
      currentUserController.user = null;
      return;
    }

    response.response(APIResponse(data: {
      'user': res.user?.toJson(),
      'session': res.session?.toJson(),
    }));

    if (res.session != null && res.user != null) {
      await currentUserController.setUser();
    }
  }

  Future<void> signUpWithPhone(
      String phone, String password, String name) async {
    response.loading();
    var res = await altogic.auth.signUpWithPhone(phone, password, name);
    if (res.errors != null) {
      response.error(res.errors);
      currentUserController.user = null;
      return;
    }

    response.response(APIResponse(data: {
      'user': res.user?.toJson(),
      'session': res.session?.toJson(),
    }));

    if (res.session != null && res.user != null) {
      await currentUserController.setUser();
    }
  }

  Future<void> signInWithEmail(String email, String password) async {
    response.loading();
    var res = await altogic.auth.signInWithEmail(email, password);
    if (res.errors != null) {
      response.error(res.errors);
      currentUserController.user = null;
      return;
    }

    response.response(APIResponse(data: {
      'user': res.user?.toJson(),
      'session': res.session?.toJson(),
    }));

    if (res.session != null && res.user != null) {
      await currentUserController.setUser();
    }
  }

  Future<void> signInWithPhone(String phone, String password) async {
    response.loading();
    var res = await altogic.auth.signInWithPhone(phone, password);
    if (res.errors != null) {
      response.error(res.errors);
      currentUserController.user = null;
      return;
    }

    response.response(APIResponse(data: {
      'user': res.user?.toJson(),
      'session': res.session?.toJson(),
    }));

    if (res.session != null && res.user != null) {
      await currentUserController.setUser();
    }
  }

  Future<void> signInWithCode(String phone, String code) async {
    response.loading();
    var res = await altogic.auth.signInWithCode(phone, code);
    if (res.errors != null) {
      response.error(res.errors);
      currentUserController.user = null;
      return;
    }

    response.response(APIResponse(data: {
      'user': res.user?.toJson(),
      'session': res.session?.toJson(),
    }));

    if (res.session != null && res.user != null) {
      await currentUserController.setUser();
    }
  }

  Future<void> signInWithProvider(String provider) async {
    response.loading();
    var res = await altogic.auth.signInWithProviderFlutter(provider);
    response.success('$provider opened : $res');
  }

  Future<void> signOut([String? token]) async {
    response.loading();
    var errors = await altogic.auth.signOut(sessionToken: token);
    if (errors != null) {
      response.error(errors);
      return;
    }

    var user = await altogic.auth.getUser();
    if (user == null) {
      currentUserController.user = null;
      await altogic.auth.clearLocalData();
    }

    response.success();
  }

  Future<void> signOutAll() async {
    response.loading();
    var errors = await altogic.auth.signOutAll();
    if (errors != null) {
      response.error(errors);
      return;
    }
    currentUserController.user = null;
    await altogic.auth.clearLocalData();
    response.success();
  }

  Future<void> signOutAllExceptCurrent() async {
    response.loading();
    var errors = await altogic.auth.signOutAllExceptCurrent();
    if (errors != null) {
      response.error(errors);
      return;
    }
    response.success();
  }

  Future<void> getAllSessions() async {
    response.loading();
    var res = await altogic.auth.getAllSessions();
    if (res.errors != null) {
      response.error(res.errors);
      return;
    }

    response.response(APIResponse(data: {
      'sessions': res.sessions?.map((e) => e.toJson()).toList(),
    }));
  }

  Future<void> getUserFromDb() async {
    response.loading();
    var res = await altogic.auth.getUserFromDB();
    if (res.errors != null) {
      response.error(res.errors);
      return;
    }

    response.response(APIResponse(data: {
      'user': res.user?.toJson(),
    }));
  }

  Future<void> changePassword(String currentPass, String newPassword) async {
    response.loading();
    var errors = await altogic.auth.changePassword(newPassword, currentPass);

    if (errors != null) {
      response.error(errors);
      return;
    }
    response.success();
  }

  Future<void> getAuthGrant(String token) async {
    response.loading();
    var res = await altogic.auth.getAuthGrant(token);
    if (res.errors != null) {
      response.error(res.errors);
      currentUserController.user = null;
      return;
    }

    response.response(APIResponse(data: {
      'user': res.user?.toJson(),
      'session': res.session?.toJson(),
    }));

    if (res.session != null && res.user != null) {
      await currentUserController.setUser();
    }
  }

  Future<void> resendVerificationEmail(String email) async {
    response.loading();
    var errors = await altogic.auth.resendVerificationEmail(email);

    if (errors != null) {
      response.error(errors);
      return;
    }
    response.success();
  }

  Future<void> resendVerificationCode(String phone) async {
    response.loading();
    var errors = await altogic.auth.resendVerificationCode(phone);

    if (errors != null) {
      response.error(errors);
      return;
    }
    response.success();
  }

  Future<void> sendMagicLink(String email) async {
    response.loading();
    var errors = await altogic.auth.sendMagicLinkEmail(email);
    if (errors != null) {
      response.error(errors);
      return;
    }

    response.success();
  }

  Future<void> sendResetPwdEmail(String email) async {
    response.loading();
    var res = await altogic.auth.sendResetPwdEmail(email);

    if (res != null) {
      response.error(res);
      return;
    }
    response.success();
  }

  Future<void> sendResetPwdCode(String phone) async {
    response.loading();
    var errors = await altogic.auth.sendResetPwdCode(phone);

    if (errors != null) {
      response.error(errors);
      return;
    }
    response.success();
  }

  Future<void> sendSignInCode(String phone) async {
    response.loading();
    var errors = await altogic.auth.sendSignInCode(phone);

    if (errors != null) {
      response.error(errors);
      return;
    }

    response.success();
  }

  Future<void> resetPwdWithToken(String token, String newPwd) async {
    response.loading();
    var errors = await altogic.auth.resetPwdWithToken(token, newPwd);
    if (errors != null) {
      response.error(errors);
      return;
    }
    response.success();
  }

  Future<void> resetPwdWithCode(
      String phone, String code, String newPwd) async {
    response.loading();
    var errors = await altogic.auth.resetPwdWithCode(phone, code, newPwd);
    if (errors != null) {
      response.error(errors);
      return;
    }
    response.success();
  }

  Future<void> changeEmail(String password, String email) async {
    response.loading();
    var result = await altogic.auth.changeEmail(password, email);

    if (result.errors != null) {
      response.error(result.errors);
      return;
    }
    response.response(APIResponse(data: {
      'user': result.user?.toJson(),
    }));
  }

  Future<void> changePhone(String password, String phone) async {
    response.loading();
    var result = await altogic.auth.changePhone(password, phone);

    if (result.errors != null) {
      response.error(result.errors);
      return;
    }
    response.response(APIResponse(data: {
      'user': result.user?.toJson(),
    }));
  }

  Future<void> verifyPhone(String phone, String code) async {
    response.loading();
    var res = await altogic.auth.verifyPhone(phone, code);
    if (res.errors != null) {
      response.error(res.errors);
      currentUserController.user = null;
      return;
    }

    response.response(APIResponse(data: {
      'user': res.user?.toJson(),
      'session': res.session?.toJson(),
    }));

    if (res.session != null && res.user != null) {
      await currentUserController.setUser();
    }
  }
}
