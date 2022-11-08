import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/models/altogic_user.dart';

import 'contacts.dart';

class Market {
  Market(
      {required this.id,
      required this.name,
      this.owner,
      this.ownerId,
      required this.contacts,
      this.marketAddress});

  factory Market.fromJson(Map<String, dynamic> map) {
    return Market(
        id: map['_id'],
        name: map['name'],
        ownerId: map['user'] is String ? map['user'] : null,
        owner: map['user'] is Map
            ? AltogicUser.fromUser(User.fromJson(map['user']))
            : null,
        marketAddress: map['market_address'],
        contacts: map['contacts'] != null
            ? List<Contact>.from(map['contacts'].map(
                (x) => Contact.fromMap((x as Map).cast<String, dynamic>())))
            : []);
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'user': ownerId ?? owner!.id,
      'contacts': contacts.map((e) => e.toMap()).toList(),
      'market_address': marketAddress,
    };
  }

  final String id;

  final String name;

  String? ownerId;
  AltogicUser? owner;

  final List<Contact> contacts;

  String? marketAddress;
}
