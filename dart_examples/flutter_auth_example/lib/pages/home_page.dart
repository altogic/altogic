import 'package:flutter/material.dart';

import '../altogic.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Home'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await altogic.auth.signOut();
              if (mounted) Navigator.pushReplacementNamed(context, '/sign-in');
            },
          )
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            children: [
              Text(altogic.auth.currentState.user?.toJson().toString() ??
                  "Not Logged")
            ],
          ),
        ),
      ),
    );
  }
}
