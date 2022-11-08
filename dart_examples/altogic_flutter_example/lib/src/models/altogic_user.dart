import 'package:altogic/altogic.dart';

class AltogicUser extends User {
  AltogicUser(String id,
      {required String lastLoginAt,
      required String mailOrPhone,
      required String provider,
      required String providerId,
      required String signUpAt,
      required this.addresses,
      this.market,
      String? name,
      String? profilePicture,
      String? password})
      : super(id,
            lastLoginAt: lastLoginAt,
            otherFields: {
              'addresses': addresses,
              'market': market,
            },
            mailOrPhone: mailOrPhone,
            provider: provider,
            providerUserId: providerId,
            signUpAt: signUpAt,
            name: name,
            password: password,
            profilePicture: profilePicture);

  factory AltogicUser.fromUser(User user) {
    return AltogicUser(
      user.id,
      lastLoginAt: user.lastLoginAt,
      mailOrPhone: user.mailOrPhone,
      provider: user.provider,
      providerId: user.providerUserId,
      signUpAt: user.signUpAt,
      addresses:
          ((user.otherFields['addresses'] as List?) ?? []).cast<String>(),
      market: user.otherFields['market'] as String?,
      name: user.name,
      password: user.password,
      profilePicture: user.profilePicture,
    );
  }

  String? market;

  List<String> addresses;
}
