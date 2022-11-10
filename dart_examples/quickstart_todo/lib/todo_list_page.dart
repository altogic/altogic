import 'package:flutter/material.dart';
import 'package:quickstart_todo/altogic.dart';
import 'package:quickstart_todo/todo.dart';

class TodoList extends StatefulWidget {
  const TodoList({Key? key}) : super(key: key);

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  List<Todo> todos = [];

  @override
  void initState() {
    super.initState();
    _loadTodos();
  }

  Future<void> _loadTodos() async {
    final response = await altogic.db.model("todo").get();

    if (response.errors == null) {
      setState(() {
        todos = response.data!.map<Todo>((e) => Todo.fromJson(e)).toList();
      });
    } else {
      debugPrint("ERROR: ${response.errors}");
    }
  }

  Future<void> _updateTodoStatus(Todo todo) async {
    final response = await altogic.db.model("todo").object(todo.id).update({
      "status": !todo.status,
    });
    if (response.errors == null) {
      todo.status = !todo.status;
      setState(() {});
    } else {
      debugPrint("ERROR: ${response.errors}");
    }
  }

  final TextEditingController _todoNameController = TextEditingController();

  Future<void> _createTodo() async {
    if (_todoNameController.text.isEmpty) {
      return;
    }
    final response = await altogic.db.model("todo").create({
      "name": _todoNameController.text,
    });
    if (response.errors == null) {
      todos.add(Todo.fromJson(response.data!));
      _todoNameController.clear();
      setState(() {});
    } else {
      debugPrint("ERROR: ${response.errors}");
    }
  }

  Future<void> _deleteTodo(Todo todo) async {
    final response = await altogic.db.model("todo").object(todo.id).delete();
    if (response.errors == null) {
      todos.removeWhere((element) => element.id == todo.id);
      setState(
          () {}); // It's not a good practice to call setState in this state.
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Todo List"),
      ),
      body: ListView.builder(
        itemCount: todos.length + 1,
        itemBuilder: (context, index) {
          if (index == todos.length) {
            return ListTile(
              title: TextField(
                autocorrect: false,
                controller: _todoNameController,
                decoration: const InputDecoration(
                  hintText: "Create new todo",
                ),
              ),
              trailing: IconButton(
                icon: const Icon(Icons.add),
                onPressed: _createTodo,
              ),
            );
          }
          final todo = todos[index];
          return Dismissible(
            key: Key(todo.id),
            background: Container(
              color: Colors.red,
            ),
            onDismissed: (direction) => _deleteTodo(todo),
            child: ListTile(
              title: Text(todo.name),
              subtitle: Text(todo.dateTime.toString()),
              trailing: Checkbox(
                value: todo.status,
                onChanged: (value) => _updateTodoStatus(todo),
              ),
            ),
          );
        },
      ),
    );
  }
}
