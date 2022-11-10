class Todo {
  Todo({
    required this.id,
    required this.name,
    required this.status,
    required this.dateTime,
  });

  factory Todo.fromJson(Map<String, dynamic> json) => Todo(
        id: json["_id"],
        name: json["name"],
        status: json["status"],
        dateTime: DateTime.parse(json["dateTime"]),
      );

  Map<String, dynamic> toJson() => {
        "name": name,
        "status": status,
        "dateTime": dateTime.toIso8601String(),
        // id field is not required for create operation
      };

  String id;
  String name;
  bool status;
  DateTime dateTime;
}
