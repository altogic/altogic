import 'dart:async';

import 'package:altogic/altogic.dart';
import 'package:fodcast_app/models/user.dart';
import 'package:fodcast_app/utils/altogic_service.dart';
import 'package:fodcast_app/utils/constants.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  final String apiUrl = Constants.apiUrl;

  factory AuthService() => _instance;

  AuthService._internal() {
    listenToAuthState();
  }

  AuthState _state = altogic.auth.currentState;

  final StreamController<AuthState> _authStateController =
      StreamController<AuthState>.broadcast();

  Stream<AuthState> get authStateChanges => _authStateController.stream;

  void listenToAuthState() {
    altogic.auth.authStateChanges.listen((AuthState state) {
      _state = state;
      _authStateController.add(state);
    });
  }

  Future<APIError?> login(String email, String password) async {
    final response = await altogic.auth.signInWithEmail(email, password);
    return response.errors;
  }

  Future<APIError?> signup(String name, String email, String password) async {
    final response = await altogic.auth.signUpWithEmail(email, password, name);
    return response.errors;
  }

  Future<void> logout() async {
    await altogic.auth.signOut();
  }

  Future<APIError?> updateUser({String? displayName, String? bio}) async {
    if (displayName == null && bio == null) return null;
    final response = await altogic.db.model("users").object(user.id).update({
      if (displayName != null) "name": displayName,
      if (bio != null) "bio": bio,
    });
    if (response.errors == null) {
      altogic.auth.setUser(FodcastUser.fromUser(User.fromJson(response.data!)));
    }
    return response.errors;
  }

  FodcastUser get user => FodcastUser.fromUser(_state.user!);

  bool get isLoggedIn {
    return _state.isLoggedIn;
  }
}
