import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/models/market.dart';
import 'package:flutter/cupertino.dart';

import '../../main.dart';

class CurrentUserController with ChangeNotifier {
  CurrentUserController._();

  static final CurrentUserController _instance = CurrentUserController._();

  factory CurrentUserController() => _instance;

  User get user => altogic.auth.currentState.user!;

  bool get isLogged => altogic.auth.currentState.user != null;

  void listenUser() {
    altogic.auth.authStateChanges.listen((event) async {
      if (isLogged) {
        var u = await altogic.auth.getUserFromDB();
        if (u.user != null) {
          if (user['market'] != null) {
            var res =
                await altogic.db.model('market').object(user['market']!).get();
            if (res.errors == null) {
              _market = Market.fromJson(res.data!);
            }
          }
        }
      } else {
        _market = null;
      }

      notifyListeners();
    });
  }

  void stopListenUser() {
    altogic.realtime.close();
  }

  bool get hasMarket => _market != null;

  Market? _market;

  Market get market => _market!;

  set market(Market? market) {
    _market = market;
    notifyListeners();
  }
}
