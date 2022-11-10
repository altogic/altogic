
import 'package:altogic/altogic.dart';
import 'package:flutter/material.dart';
import 'package:flutter_auth_example/widgets/with_max_width.dart';
import 'package:image_picker/image_picker.dart';

import '../altogic.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late TextEditingController nameController;

  _listen(AuthState sta) {
    setState(() {});
  }

  @override
  void initState() {
    altogic.auth.authStateChanges.listen(_listen);

    nameController =
        TextEditingController(text: altogic.auth.currentState.user?.name);
    super.initState();
  }

  Future<void> setUserName() async {
    var res = await altogic.db
        .model('users')
        .object(
          altogic.auth.currentState.user?.id,
        )
        .update({
      'name': nameController.text,
    });

    if (res.errors == null) {
      altogic.auth.setUser(User.fromJson(res.data!));
      setState(() {});
    }

    if (mounted) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('User updated')));
    }
  }

  User get user => altogic.auth.currentState.user!;

  Future<void> updateProfilePhoto() async {
    var pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (pickedFile == null) {
      return;
    }

    var imageBytes = await pickedFile.readAsBytes();

    var upload = await altogic.storage.bucket("profile_pictures").upload(
        '${user.id}.jpg',
        imageBytes,
        FileUploadOptions(
            contentType: pickedFile.mimeType ?? "image/jpeg",
            isPublic: true,
            onProgress: (uploaded, total, percent) {
              progress.value = percent;
            }));

    if (upload.errors != null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Error uploading image')));
      }
      return;
    }
    var res = await altogic.db
        .model('users')
        .object(
          altogic.auth.currentState.user?.id,
        )
        .update({
      'profilePicture': upload.data!['publicPath'],
    });

    if (res.errors == null) {
      altogic.auth.setUser(User.fromJson(res.data!));
      setState(() {});
    }
  }

  ValueNotifier<double> progress = ValueNotifier(0);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Home Page'),
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
          child: !altogic.auth.currentState.isLoggedIn
              ? const Text("User Not Logged")
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    WithMaxWidth(
                      maxWidth: 500,
                      child: Column(
                        children: [
                          CircleAvatar(
                            radius: 80,
                            backgroundImage: user.profilePicture != null
                                ? NetworkImage(
                                    user.profilePicture!,
                                  )
                                : null,
                          ),
                          const SizedBox(
                            height: 20,
                          ),
                          TextButton(
                              onPressed: updateProfilePhoto,
                              child: const Text("Edit Profile Photo")),
                          ValueListenableBuilder(
                              valueListenable: progress,
                              builder: (c, v, w) {
                                if (progress.value == 0 ||
                                    progress.value == 100) {
                                  return const SizedBox();
                                }
                                return WithMaxWidth(
                                    maxWidth: 500,
                                    child: Column(
                                      children: [
                                        LinearProgressIndicator(
                                          value: progress.value,
                                          color: Colors.blue,
                                          backgroundColor: Colors.grey,
                                        ),
                                        Text("Progress: ${progress.value}"),
                                      ],
                                    ));
                              }),
                          const SizedBox(
                            height: 20,
                          ),
                          Row(
                            children: [
                              Expanded(
                                  child: Container(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 20),
                                child: TextField(
                                  controller: nameController,
                                  onChanged: (value) {
                                    setState(() {});
                                  },
                                  decoration: const InputDecoration(
                                    border: OutlineInputBorder(),
                                    label: Text('Name'),
                                  ),
                                ),
                              )),
                              IconButton(
                                icon: const Icon(Icons.save),
                                onPressed: nameController.text !=
                                        altogic.auth.currentState.user?.name
                                    ? setUserName
                                    : null,
                              )
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }
}
