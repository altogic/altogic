
import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/models/altogic_user.dart';
import 'package:altogic_flutter_example/src/models/market.dart';
import 'package:flutter/cupertino.dart';

import '../../main.dart';

void _listenUser(UserEvent eventName, Session? session) {
  debugPrint("ON USER EVENT: $eventName : \n"
      "${session?.toJson()}");
  CurrentUserController().setUser();
}

class CurrentUserController with ChangeNotifier {
  CurrentUserController._();

  static final CurrentUserController _instance = CurrentUserController._();

  factory CurrentUserController() => _instance;

  AltogicUser? _user;

  AltogicUser get user => _user!;

  bool get isLogged => _user != null;

  set user(AltogicUser? user) {
    _user = user;
    notifyListeners();
  }

  Future<void> setUser() async {
    await altogic.restoreLocalAuthSession();
    var s = await altogic.auth.getSession();
    if (s != null) {
      var u = await altogic.auth.getUserFromDB();
      if (u.user != null) {
        _user = AltogicUser.fromUser(u.user!);
        if (user.market != null) {
          var res = await altogic.db.model('market').object(user.market!).get();
          if (res.errors == null) {
            _market = Market.fromJson(res.data!);
          }
        }
      }
    }

    notifyListeners();
  }

  void listenUser() {
    altogic.realtime.onUserEvent(_listenUser);
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
