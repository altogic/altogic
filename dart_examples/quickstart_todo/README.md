This is a simple todo list application for [Altogic Flutter Quickstart](https://www.altogic.com/client/quick-start/quick-start-flutter).

# Quickstart: Flutter

## Introduction

This article will cover how to code simple CRUD operations in a to-do app using [Flutter](https://reactjs.org/), and
Altogic. 
## What are the features of the to-do app?

1. Create a to-do

2. Update to-do status

3. Delete a to-do

4. List all to-do’s

## Set up the backend

## Create App

We can create an app with the [Altogic Designer](https://designer.altogic.com/) fast. To create an app via the **
Designer**:

1. Log in to **Altogic** with your credentials.

2. Select **New app**.

3. In the **App Name** field, enter a name for the app.

4. And click **Next**.

<img src="https://c1-europe.altogic.com/_storage/635910f7b6ffe70f3f772307/635910f7b6ffe70f3f772307/636cfef297ecdbb79d900dbe" width="700"/>


1. Select your domain.

2. And click **Next**.

<img src="https://c1-europe.altogic.com/_storage/635910f7b6ffe70f3f772307/635910f7b6ffe70f3f772307/636cfee908f3c5bf06514edb" width="700"/>

1. Choose your deployment region.

2. And click **Next**.

<img src="https://c1-europe.altogic.com/_storage/635910f7b6ffe70f3f772307/635910f7b6ffe70f3f772307/636cfef397ecdbb79d900dbf" width="700"/>

1. Choose your plan.
2. And click **Next**.

<img src="https://c1-europe.altogic.com/_storage/635910f7b6ffe70f3f772307/635910f7b6ffe70f3f772307/636cfef301e574a7e0ae056f" width="700"/>

1. Choose **Blank App** template, and click on **Next**.

2. And Click **Create**

<img src="https://c1-europe.altogic.com/_storage/635910f7b6ffe70f3f772307/635910f7b6ffe70f3f772307/636cfef39190dbe0376e73d1" width="600"/>

Here, you can customize your subdomain, but not necessarily to do, **Altogic automatically creates one for you,**
your `envUrl`. You don’t need to worry if you lost your `envUrl`; you can get it from the **Environments** view of **
Designer**.

![Getting the environment URL](https://cdn-images-1.medium.com/max/2800/0*rEGLYvRP7m2wVMW2.png)

After creating our app, we need `envUrl` and `clientKey` to access our app via **Altogic Client Library** to create a
web application.

To get the `clientKey` we need to enter the app which we have created before and;

1. Click on **App Settings** at the left-bottom of the Designer.

2. And click on the **Client library keys** section.

![Getting the client key](https://cdn-images-1.medium.com/max/2800/0*bY1Y-KsMwkVZ8Sbl.png)

We can create new `clientKey` from that page, but thanks to **Altogic** for creating one `clientKey` automatically for
us, so let’s copy the existing `clientKey` from the list.

## Create todo model

1. Click on **Models** on the left sidebar.

2. Click **New** on the right of the screen and select **model.**

3. Set model name as **todo**

4. Ensure that **Enable timestamps** are selected to store the creation date of the blog post.

5. Click **Next.**

<img src="https://cdn-images-1.medium.com/max/2384/0*rFbSDC-1W5agsD4n.png" width="600"/>

**Altogic** provides basic **CRUD** endpoints and services with the related model by default when you create a new
model. Since we use **Altogic Client Library,** we won’t use these endpoints. Unselect all endpoints and click **
Create**.

<img src="https://cdn-images-1.medium.com/max/2384/0*4hZWJQv5N54LcKvE.png" width="600"/>

We created our first model, ”todo”. We have to define the model properties `name`, `dateTime` for the due date,
and `status`. Since we created the **todo **model, we should define the **name** property as *Text,* `dateTime` as *
Date-time,* and the `status` as *Boolean.*

1. Click on the **todo** model on the *Models* page.

2. Click on **New Field** on the right-top of the page.

3. Select **Text Field→ Text.**

4. Set model name **name.**

5. Ensure that the **Required field** is selected.

6. Click **Create.**

<img src="https://cdn-images-1.medium.com/max/2388/0*TDN5D8FJ-MXuKRcJ.png" width="600"/>

1. Click on **New Field** on the right-top of the page.

2. Select **Boolean.**

3. Set model name **status.**

4. Ensure that the **Required field** is selected.

5. Set default value expression **false.**

<img src="https://cdn-images-1.medium.com/max/2384/0*CyVMfkrfJxAslLWy.png" width="600"/>

1. Click on **New Field** on the right-top of the page.

2. Select **Date-time.**

3. Set model name **dateTime.**

4. Ensure that the **Required field** is selected.

5. Set default value expression **DATEADD(NOW(),5).**

<img src="https://cdn-images-1.medium.com/max/2388/0*B5IanJ2TjmD6FDZn.png" width="600"/>

We completed the database design and the model definition on **Altogic**. Let’s move on to the front-end development.

## Set up the front-end

### Initialize a Flutter App

We can use `create` command to initialize a Flutter app:

    flutter create quickstart_todo

Then, install the Altogic package.

    cd quickstart_todo
    flutter pub add altogic

### Set up AltogicClient

Environment variables are used to secure your secret keys, reuse them in different places and reduce production
mistakes.

````shell
flutter run --dart-define=ALTOGIC_ENV_URL=YOUR_ENV_URL --dart-define=ALTOGIC_CLIENT_KEY=YOUR_CLIENT_KEY
#OR
flutter build apk --dart-define=ALTOGIC_ENV_URL=YOUR_ENV_URL --dart-define=ALTOGIC_CLIENT_KEY=YOUR_CLIENT_KEY
flutter build ipa --dart-define=ALTOGIC_ENV_URL=YOUR_ENV_URL --dart-define=ALTOGIC_CLIENT_KEY=YOUR_CLIENT_KEY
flutter build web --dart-define=ALTOGIC_ENV_URL=YOUR_ENV_URL --dart-define=ALTOGIC_CLIENT_KEY=YOUR_CLIENT_KEY
````

Replace `YOUR_ENV_URL` and `YOUR_CLIENT_KEY` with the `envUrl` and `clientKey` values you retrieved while setting up
your backend.

:::tip
You can use the package [flutter_dotenv](https://pub.dev/packages/flutter_dotenv) to load environment variables from
a `.env` file.
:::

Next, create the **Altogic Client** instance.

Create and open `altogic.dart` file in your editor and paste the following.

```dart
import 'package:altogic/altogic.dart';

const String envUrl = String.fromEnvironment("YOUR_ENV_URL");
const String clientKey = String.fromEnvironment("YOUR_CLIENT_KEY");

final altogic = createClient(envUrl, clientKey);

```

:::tip
You can use ``envUrl`` and ``clientKey`` variables in your code directly, but we recommend using environment variables
in production.
:::

## Development

Since Altogic reduces the complexity of the backend development process, we will code our to-do app with just one main
component: `App.js`

**Feature & Function Matching:**

* Create a to-do → `altogic.db.model("todo").create(todoInstance.toJson())`

* Update status of the to-do → `altogic.db.model("todo").object(todoId).update({FIELD_NAME:newValue})`

* List all to-do’s → `altogic.db.model("todo").get()`

* Delete a to-do → `altogic.db.model("todo").object(todoId).delete()`

We’ve covered all **Altogic Client Library Functions** that we used in our app. Let’s code it together!

### Create a to-do model

`````dart
class Todo {
  Todo({
    required this.id,
    required this.name,
    required this.status,
    required this.dateTime,
  });

  String id;
  String name;
  bool status;
  DateTime dateTime;
}
`````

add `toJson` method to the `Todo` class.

`````dart
Map<String, dynamic> toJson() =>
    {
      "name": name,
      "status": status,
      "dateTime": dateTime.toIso8601String(),
      // id field is not required for create operation
    };
`````

add ``fromJson`` constructor to the ``Todo`` class.

`````dart
class Todo {
  factory Todo.fromJson(Map<String, dynamic> json) =>
      Todo(
        id: json["_id"],
        name: json["name"],
        status: json["status"],
        dateTime: DateTime.parse(json["dateTime"]),
      );

///...
}
`````

### Create a to-do list page

Create a new file `todo_list.dart` and paste the following code.

The TodoList widget is StatefulWidget and the state get initialized with the `initState` method. In the `initState`
method, we call the `getTodos` method to get all the to-do’s from the database.


`````dart
import 'package:flutter/material.dart';
import 'package:quickstart_todo/altogic.dart';
import 'package:quickstart_todo/todo.dart';

class TodoList extends StatefulWidget {
  const TodoList({Key? key}) : super(key: key);

  @override
  _TodoListState createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {

  List<Todo> todos = [];

  Future<void> _loadTodos() async {
    final response = await altogic.db.model("todo").get();
    if (response.errors == null) {
      setState(() {
        todos = response.data!.map((e) => Todo.fromJson(e)).toList();
      });
    }
  }

  @override
  void initState() {
    _loadTodos();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Todo List"),
      ),
      body: ListView.builder(
        itemCount: todos.length,
        itemBuilder: (context, index) {
          final todo = todos[index];
          return ListTile(
            title: Text(todo.name),
            subtitle: Text(todo.dateTime.toString()),
          );
        },
      ),
    );
  }
}
`````

Now we can add the `TodoList` widget to the `main.dart` file.

`````dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Altogic Flutter Quickstart',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const TodoList(),
    );
  }
}
`````

Start the app, and you should see the list of to-do’s.

But, we don’t have any to-do’s in the database. Let’s add a new to-do.

### Create a to-do widget

````dart

final TextEditingController _todoNameController = TextEditingController();

Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: const Text("Todo List"),
    ),
    body: ListView.builder(
      itemCount: todos.length + 1, // Add to and of the todos
      itemBuilder: (context, index) {
        if (index == todos.length) {
          return ListTile(
            title: TextField(
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
        return ListTile(
          title: Text(todo.name),
          subtitle: Text(todo.dateTime.toString()),
        );
      },
    ),
  );
}
````

### Create a to-do

````dart
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
    setState(() {}); // It's not a good practice to call setState in this state.
  }
}
````

Ok, now we can create and see a new to-do. But, we can’t update the status of the to-do. Let’s add a checkbox to the list item.

### Update a to-do

Add the `_updateTodoStatus` method.

````dart
Future<void> _updateTodoStatus(Todo todo) async {
  final response = await altogic.db.model("todo").object(todo.id).update({
    "status": !todo.status,
  });
  if (response.errors == null) {
    todo.status = !todo.status;
    setState(() {}); // It's not a good practice to call setState in this state.
  }
}
````

And add method to the `ListTile` widget.

````dart
ListTile(
  title: Text(todo.name),
  subtitle: Text(todo.dateTime.toString()),
  trailing: Checkbox(
    value: todo.status,
    onChanged: (value) => _updateTodoStatus(todo),
  ),
)
````

Ok! Now we can update the status of the to-do.

### Delete a to-do

Add the `_deleteTodo` method.

````dart
Future<void> _deleteTodo(Todo todo) async {
  final response = await altogic.db.model("todo").object(todo.id).delete();
  if (response.errors == null) {
    todos.removeWhere((element) => element.id == todo.id);
    setState(() {}); // It's not a good practice to call setState in this state.
  }
}
````

Make dismissible the `ListTile` widget.

````dart
Dismissible(
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
)
````

Ok! Now we can delete the to-do

All the code is available on [GitHub](https://github.com/altogic/altogic/tree/main/dart_examples/quickstart_todo)

You can run the app on your device or emulator:

````bash

git clone \
  --depth 2  \
  --filter=blob:none  \
  --sparse \
  https://github.com/altogic/altogic \
;
cd altogic
git sparse-checkout set dart_examples/quickstart_todo
cd dart_examples
cd quickstart_todo

flutter run --dart-define=ALTOGIC_ENV_URL=YOUR_ENV_URL --dart-define=ALTOGIC_CLIENT_KEY=YOUR_CLIENT_KEY
````


