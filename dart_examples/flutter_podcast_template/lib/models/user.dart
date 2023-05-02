import 'package:altogic/altogic.dart';

class FodcastUser extends User {
  FodcastUser.fromUser(super.user) : super.fromUser();

  String? get bio => this["bio"];
}
