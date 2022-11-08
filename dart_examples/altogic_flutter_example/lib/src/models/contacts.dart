class Contact {
  String name;
  String email;
  String id;

  Contact({required this.name, required this.email, required this.id});

  factory Contact.fromMap(Map<String, dynamic> map) {
    return Contact(name: map['name'], email: map['email'], id: map['_id']);
  }

  Map<String, dynamic> toMap() {
    return {'_id': id, 'name': name, 'email': email};
  }
}
