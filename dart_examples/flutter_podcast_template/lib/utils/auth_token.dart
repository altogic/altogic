import 'package:shared_preferences/shared_preferences.dart';

class AuthToken {
  static final AuthToken _instance = AuthToken._internal();
  static const String _tokenKey = 'auth_token';

  factory AuthToken() => _instance;

  AuthToken._internal();

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<void> setToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString(_tokenKey, token);
  }

  Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.remove(_tokenKey);
  }

  Future<bool> hasToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey) != null;
  }
}
