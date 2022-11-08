import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/service/file_manager.dart';
import 'package:altogic_flutter_example/src/service/suggestion_service.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/texts.dart';
import 'package:altogic_flutter_example/src/view/widgets/input.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import '../database/cases.dart';
import 'utils/upload.dart'
    if (dart.library.io) 'utils/io_upload.dart'
    if (dart.library.html) 'utils/web_upload.dart' show getUintList;

String _getFileManager(BuildContext context) {
  return """altogic
        .bucket("${FileManagerService.of(context).bucket}")
        .file("${FileManagerService.of(context).fileNameOrId}")""";
}

class FileExistsCase extends MethodWrap {
  FileExistsCase();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Get File Exists',
          onPressed: () {
            asyncWrapper(() async {
              FileManagerService.of(context).exists();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Check if the file exists. It returns false if file does not exist.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan('Returns true if file exists, false otherwise'),
            vSpace,
            DartCode("""
var res = await ${_getFileManager(context)}
        .exists();
    """)
          ];

  @override
  String get name => 'Get File Exists';
}

class GetFileInfoMethod extends MethodWrap {
  GetFileInfoMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Get File Info',
          onPressed: () {
            asyncWrapper(() async {
              FileManagerService.of(context).getInfo(true);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description =>
      [const AutoSpan('Gets information about the file.')];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan('Returns basic file metadata informaton.'),
            vSpace,
            DartCode("""
var res = await ${_getFileManager(context)}
        .getInfo();
    """)
          ];

  @override
  String get name => 'Get File Info';
}

class MakeFilePublic extends MethodWrap {
  MakeFilePublic();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Make File Public',
          onPressed: () {
            asyncWrapper(() async {
              FileManagerService.of(context).makePublic();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description =>
      [const AutoSpan('Sets the default privacy of the file to *true*.')];

  /// Sets the default privacy of the file to **true**.
  ///
  /// > *If the client library key is set to **enforce session**, an active
  /// user session is required (e.g., user needs to be logged in) to call
  /// this method.*
  ///
  /// Returns the updated file information

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan('Returns the updated file information.'),
            vSpace,
            DartCode("""
var res = await ${_getFileManager(context)}
        .makePublic();
    """)
          ];

  @override
  String get name => 'Make File Public';
}

class MakeFilePrivate extends MethodWrap {
  MakeFilePrivate();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Make File Private',
          onPressed: () {
            asyncWrapper(() async {
              FileManagerService.of(context).makePrivate();
            });
          })
    ];
  }

  /// Sets the default privacy of the file to **false**.
  ///
  /// > *If the client library key is set to **enforce session**, an active
  /// user session is required (e.g., user needs to be logged in) to call
  /// this method.*
  ///
  /// Returns the updated file information

  @override
  List<DocumentationObject> get description =>
      [const AutoSpan('Sets the default privacy of the file to *false*.')];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan('Returns the updated file information.'),
            vSpace,
            DartCode("""
var res = await ${_getFileManager(context)}
        .makePrivate();
    """)
          ];

  @override
  String get name => 'Make File Private';
}

class DownloadFileCase extends MethodWrap {
  DownloadFileCase();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Download File',
          onPressed: () {
            asyncWrapper(() async {
              FileManagerService.of(context).downloadFile();
            });
          })
    ];
  }

  /// Downloads the file.
  ///
  /// > *If the client library key is set to **enforce session**, an active
  /// user session is required (e.g., user needs to be logged in) to call
  /// this method.*
  ///
  /// Returns the contents of the file in a `Blob`

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Downloads the file.'),
        vSpace,
        const AutoSpan('Returns the contents of the file in a `Uint8List`'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan('Returns the contents of the file in a `Uint8List`'),
            vSpace,
            DartCode("""
var res = await ${_getFileManager(context)}
        .download();
    """)
          ];

  @override
  String get name => 'Download File';
}

class RenameFileCase extends MethodWrap {
  RenameFileCase();

  String get fileName =>
      FileManagerService.of(context).fileInfo.value!['fileName'];
  late final TextEditingController controller =
      TextEditingController(text: fileName);

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "New Name", editingController: controller),
      AltogicButton(
          body: 'Rename File',
          enabled: () {
            return controller.text.isNotEmpty && controller.text != fileName;
          },
          listenable: controller,
          onPressed: () {
            asyncWrapper(() async {
              await FileManagerService.of(context).rename(controller.text);
            });
          })
    ];
  }

  /// Renames the file.
  ///
  /// > *If the client library key is set to **enforce session**, an active
  /// user session is required (e.g., user needs to be logged in) to call
  /// this method.*
  ///
  /// [newName] The new name of the file.
  ///
  /// Returns the updated file information

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Renames the file.'),
        vSpace,
        const AutoSpan('Returns the updated file information. '),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan('Returns the updated file information.'),
            vSpace,
            DartCode("""
var res = await ${_getFileManager(context)}
        .rename('${controller.text}');
    """)
          ];

  @override
  String get name => 'Rename File';
}

class DuplicateFileCase extends MethodWrap {
  DuplicateFileCase();

  String get fileName =>
      FileManagerService.of(context).fileInfo.value!['fileName'];
  late final TextEditingController controller =
      TextEditingController(text: fileName);

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "New Name", editingController: controller),
      AltogicButton(
          body: 'Duplicate File',
          enabled: () =>
              controller.text.isNotEmpty && controller.text != fileName,
          listenable: controller,
          onPressed: () {
            asyncWrapper(() async {
              FileManagerService.of(context).duplicate(controller.text);
            });
          })
    ];
  }

  /// Duplicates an existing file within the same bucket.
  ///
  /// > *If the client library key is set to **enforce session**, an active
  /// user session is required (e.g., user needs to be logged in) to call
  /// this method.*
  ///
  /// [duplicateName] The new duplicate file name. If not specified, uses the
  /// `fileName` as template and ensures the duplicated file name to be unique
  /// in its bucket.
  /// Returns the new duplicate file information

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Duplicates an existing file within the same bucket.'),
        vSpace,
        const AutoSpan('Returns the new duplicate file information.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan('Returns the new duplicate file information.'),
            vSpace,
            DartCode("""
var res = await ${_getFileManager(context)}
        .duplicate('${controller.text}');
    """)
          ];

  @override
  String get name => 'Duplicate File';
}

class DeleteFileMethod extends MethodWrap {
  DeleteFileMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Delete File',
          onPressed: () {
            asyncWrapper(() async {
              await FileManagerService.of(context).delete();
            });
          })
    ];
  }

  /// Deletes the file from the bucket.
  ///
  /// > *If the client library key is set to **enforce session**, an active
  /// user session is required (e.g., user needs to be logged in) to call
  /// this method.*

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Deletes the file from the bucket.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            DartCode("""
var errors = await ${_getFileManager(context)}
        .delete();
    """)
          ];

  @override
  String get name => 'Delete File';
}

class ReplaceFileMethod extends MethodWrap {
  ReplaceFileMethod();

  final ValueNotifier<PlatformFile?> bytes = ValueNotifier<PlatformFile?>(null);
  final ValueNotifier<double?> process = ValueNotifier<double?>(null);

  static final Map<String, String> contentTypes = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'mp4': 'video/mp4',
    'mp3': 'audio/mpeg',
    'mov': 'video/quicktime',
    'wav': 'audio/wav',
    'json': 'application/json',
    'txt': 'text/plain',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
  };

  @override
  List<Widget> children(BuildContext context) {
    return [
      ValueListenableBuilder<PlatformFile?>(
        valueListenable: bytes,
        builder: (context, value, child) {
          if (value != null) {
            return Column(
              children: [
                Container(
                  width: double.infinity,
                  alignment: Alignment.center,
                  child: SizedBox(
                    width: 300,
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            "File Selected : ${value.name}",
                          ),
                        ),
                        const SizedBox(
                          width: 20,
                        ),
                        IconButton(
                            onPressed: () {
                              bytes.value = null;
                              setState(() {});
                            },
                            icon: const Icon(Icons.delete_forever))
                      ],
                    ),
                  ),
                ),
                vSpace.doc(context),
                Text(
                    "content type: ${value.extension != null ? contentTypes[value.extension] : 'text/plain'}"),
              ],
            );
          }
          return AltogicButton(
              enabled: () => !loading,
              body: 'Select File',
              onPressed: () async {
                asyncWrapper(() async {
                  var file = await FilePicker.platform.pickFiles(
                      allowMultiple: false,
                      type: FileType.custom,
                      allowedExtensions: contentTypes.keys.toList());
                  if (file != null) {
                    bytes.value = file.files.first;
                  }
                });
              });
        },
      ),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      ValueListenableBuilder(
          valueListenable: process,
          builder: (c, v, w) {
            if (process.value != null) {
              return Container(
                width: double.infinity,
                alignment: Alignment.center,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    SizedBox(
                      width: 300,
                      child: LinearProgressIndicator(
                        value: process.value,
                        color: Colors.blue,
                        backgroundColor: Colors.grey,
                      ),
                    ),
                    Text("% ${(process.value! * 100).toStringAsFixed(2)}")
                  ],
                ),
              );
            }
            return const SizedBox();
          }),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      ValueListenableBuilder(
          valueListenable: bytes,
          builder: (c, v, w) {
            return AltogicButton(
                enabled: () {
                  if (kDebugMode) {
                    print(bytes.value != null);
                  }
                  return !loading && bytes.value != null;
                },
                listenable: Listenable.merge([bytes]),
                body: 'Replace File',
                onPressed: () {
                  asyncWrapper(() async {
                    await FileManagerService.of(context)
                        .replace(getUintList(bytes.value!), (l, t, percent) {
                      process.value = t / l;
                    },
                            bytes.value!.extension != null
                                ? contentTypes[bytes.value!.extension]!
                                : 'text/plain');

                    process.value = null;
                    bytes.value = null;
                  });
                });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Replaces an existing file with another. It keeps the name of the file but'
            ' replaces file contents, size, encoding and mime-type with the newly'
            ' uploaded file info.'),
        vSpace,
        const AutoSpan(
            'If `onProgress` callback function is defined in `FileUploadOptions`, it'
            ' periodically calls this function to inform about upload progress.'
            ' (in this example `onProgress` is defined)'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                ' [fileBody] The body of the new file that will be used to replace the'
                ' existing file.'
                '\n\n\n'
                '`options` Content type of the file, privacy setting of the file and'
                ' whether to create the bucket if not exists. `contentType` is ignored,'
                ' `contentType` option needs to be specified. If not specified, `contentType` will'
                ' default to `text/plain;charset=UTF-8`. If `isPublic` is not specified,'
                ' defaults to the bucket\'s privacy setting. If `createBucket` is set to'
                ' true (defaults to false), then creates a new bucket if the bucket does'
                ' not exist.'
                '\n\n\n'
                'Returns the metadata of the file after replacement'),
            vSpace,
            const LeftSpace("In this example, `contentType` auto defined. "
                "Auto defined content type available for following extensions: "
                "'png', 'jpg', 'jpeg', 'webp', 'gif', 'mp4', 'mp3', 'mov',"
                " 'wav', 'json', 'txt', 'html', 'css','js' "),
            vSpace,
            DartCode("""
var res = ${_getFileManager(context)}
        .replace(
          bytes,
          options: FileUploadOptions(
            contentType: "${bytes.value?.extension != null ? contentTypes[bytes.value!.extension]! : 'text/plain'}",
            onProgress: (loaded, total, percent) {
                print(percent);
            },
          )
        );
    """)
          ];

  @override
  String get name => "Replace File";
}

class MoveToBucketFileMethod extends MethodWrap {
  final TextEditingController bucketName = TextEditingController();
  final SuggestionService suggestionService = SuggestionService();

  MoveToBucketFileMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Bucket Name Or ID", editingController: bucketName),
      vSpace.doc(context),
      ...suggestionService.getWidget(
          context,
          (limit, page) async {
            var res = await FileManagerService.of(context).listBucket(
                expression: 'userId == "${currentUser.user.id}"',
                sort: BucketSortField.createdAt,
                returnCountInfo: false,
                page: page,
                limit: limit,
                asc: false);
            return (res as List?)
                ?.map((e) => (e as Map).cast<String, dynamic>())
                .toList();
          },
          (map) => map['name'],
          setState,
          (id) {
            bucketName.text = id;
          }),
      vSpace.doc(context),
      AltogicButton(
          body: "Get Suggestions",
          onPressed: () {
            asyncWrapper(() async {
              suggestionService.page = 1;
              var res = await FileManagerService.of(context).listBucket(
                  expression: 'userId == "${currentUser.user.id}"',
                  limit: suggestionService.limit,
                  page: suggestionService.page,
                  returnCountInfo: false,
                  sort: BucketSortField.createdAt,
                  asc: false);
              suggestionService.values = (res as List?)
                      ?.map((e) => (e as Map).cast<String, dynamic>())
                      .toList() ??
                  [];
              setState(() {});
            });
          }),
      AltogicButton(
        body: "Move To Bucket",
        onPressed: () {
          asyncWrapper(() async {
            await FileManagerService.of(context).moveTo(bucketName.text);
          });
          return;
        },
        enabled: () => bucketName.text.isNotEmpty,
        listenable: bucketName,
      )
    ];
  }

  /// Moves the file to another bucket. The file will be removed from its
  /// current bucket and will be moved to its new bucket. If there already
  /// exists a file with the same name in destination bucket, it ensures
  /// the moved file name to be unique in its new destination.
  ///
  /// > *If the client library key is set to **enforce session**, an active
  /// user session is required (e.g., user needs to be logged in) to call
  /// this method.*
  ///
  /// [bucketNameOrId] The name or id of the bucket to move the file into.
  ///
  /// Returns the moved file information

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Moves the file to another bucket. The file will be removed from its'
            ' current bucket and will be moved to its new bucket. If there already'
            ' exists a file with the same name in destination bucket, it ensures'
            ' the moved file name to be unique in its new destination.'),
        vSpace,
        const AutoSpan('Returns the moved file information'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                ' [bucketNameOrId] The name or id of the bucket to move the file into.'),
            vSpace,
            DartCode("""
var res = ${_getFileManager(context)}
        .moveTo(
          ${bucketName.text},
        );
    """)
          ];

  @override
  String get name => "Move To Bucket";
}

class CopyToBucketFileMethod extends MethodWrap {
  final TextEditingController bucketName = TextEditingController();
  final SuggestionService suggestionService = SuggestionService();

  CopyToBucketFileMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Bucket Name Or ID", editingController: bucketName),
      vSpace.doc(context),
      ...suggestionService.getWidget(
          context,
          (limit, page) async {
            var res = await FileManagerService.of(context).listBucket(
                expression: 'userId == "${currentUser.user.id}"',
                sort: BucketSortField.createdAt,
                returnCountInfo: false,
                page: page,
                limit: limit,
                asc: false);
            return (res as List?)
                ?.map((e) => (e as Map).cast<String, dynamic>())
                .toList();
          },
          (map) => map['name'],
          setState,
          (id) {
            bucketName.text = id;
          }),
      vSpace.doc(context),
      AltogicButton(
          body: "Get Suggestions",
          onPressed: () {
            asyncWrapper(() async {
              suggestionService.page = 1;
              var res = await FileManagerService.of(context).listBucket(
                  expression: 'userId == "${currentUser.user.id}"',
                  limit: suggestionService.limit,
                  page: suggestionService.page,
                  returnCountInfo: false,
                  sort: BucketSortField.createdAt,
                  asc: false);
              suggestionService.values = (res as List?)
                      ?.map((e) => (e as Map).cast<String, dynamic>())
                      .toList() ??
                  [];
              setState(() {});
            });
          }),
      AltogicButton(
        body: "Copy To Bucket",
        onPressed: () {
          asyncWrapper(() async {
            await FileManagerService.of(context).copyTo(bucketName.text);
          });
          return;
        },
        enabled: () => bucketName.text.isNotEmpty,
        listenable: bucketName,
      )
    ];
  }

  /// Copies the file to another bucket. If there already exists a file with
  /// the same name in destination bucket, it ensures the copied file name
  /// to be unique in its new destination.
  ///
  /// > *If the client library key is set to **enforce session**, an active
  /// user session is required (e.g., user needs to be logged in) to call
  /// this method.*
  ///
  /// [bucketNameOrId] The name or id of the bucket to copy the file into.
  ///
  /// Returns the copied file information

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Copies the file to another bucket. If there already exists a file with'
            ' the same name in destination bucket, it ensures the copied file name'
            ' to be unique in its new destination.'),
        vSpace,
        const AutoSpan('Returns the copied file information'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                ' [bucketNameOrId] The name or id of the bucket to copy the file into.'),
            vSpace,
            DartCode("""
var res = ${_getFileManager(context)}
        .copyTo(
          ${bucketName.text},
        );
    """)
          ];

  @override
  String get name => "Copy To Bucket";
}

class AddTagsFileManager extends MethodWrap {
  AddTagsFileManager();

  final TextEditingController tagsController = TextEditingController();

  final List<String> tagging = [];

  void _submitTags(String? submitted) {
    if (submitted != null && submitted.isNotEmpty) {
      tagging.add(submitted);
      tagsController.clear();
      setState(() {});
    }
  }

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        hint: "Tags",
        onSubmitted: _submitTags,
        editingController: tagsController,
        suffixIcon: (c) => IconButton(
            onPressed: () {
              _submitTags(tagsController.text);
            },
            icon: const Icon(Icons.add)),
      ),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      if (tagging.isNotEmpty)
        Container(
          width: MediaQuery.of(context).size.width,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Column(
            children: [
              const Header('Tags to add', level: 2).doc(context),
              Wrap(
                runSpacing: 10,
                spacing: 10,
                crossAxisAlignment: WrapCrossAlignment.start,
                runAlignment: WrapAlignment.start,
                alignment: WrapAlignment.start,
                children: [
                  for (var value in tagging)
                    ActionChip(
                      label: Text((value)),
                      onPressed: () {
                        tagging.removeWhere((element) => element == value);
                        setState(() {});
                      },
                    )
                ],
              ),
            ],
          ),
        ),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      AltogicButton(
          body: 'Add Tags',
          listenable: tagsController,
          enabled: () => !loading && tagging.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              await FileManagerService.of(context).addTags(tagging);
              tagsController.clear();
            });
          })
    ];
  }

  /// Adds the specified tags to file's metadata.
  ///
  /// > *If the client library key is set to **enforce session**, an active
  /// user session is required (e.g., user needs to be logged in) to call
  /// this method.*
  ///
  /// [tags] A single tag or an array of tags to add to file's metadata.
  /// [tags] can be ``String`` or ``List<String>``
  ///
  /// Returns the updated file information

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Adds the specified tags to file\'s metadata.'),
        vSpace,
        const AutoSpan('Returns the updated file information'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                '`tags` A single tag or an array of tags to add to file\'s metadata.\n'
                '`tags` can be `String` or `List<String>`'),
            vSpace,
            DartCode("""
var res = ${_getFileManager(context)}
        .addTags([
          ${tagging.map((e) => '"$e"').join(',\n          ')},
        ]);
    """)
          ];

  @override
  String get name => "Add Tags";
}

class RemoveTagsFileManager extends MethodWrap {
  RemoveTagsFileManager();

  Map<String, dynamic> get file =>
      FileManagerService.of(context).fileInfo.value!;

  late List<String> tags;

  final List<String> tagsToRemove = [];

  @override
  List<Widget> children(BuildContext context) {
    tags = (file['tags'] as List).cast<String>()
      ..removeWhere((element) => tagsToRemove.contains(element));
    return [
      if (tagsToRemove.isNotEmpty)
        Container(
          width: MediaQuery.of(context).size.width,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Column(
            children: [
              const Header('Tags to remove', level: 2).doc(context),
              Wrap(
                runSpacing: 10,
                spacing: 10,
                crossAxisAlignment: WrapCrossAlignment.start,
                runAlignment: WrapAlignment.start,
                alignment: WrapAlignment.start,
                children: [
                  for (var value in tagsToRemove)
                    ActionChip(
                      label: Text((value)),
                      onPressed: () {
                        tagsToRemove.removeWhere((element) => element == value);
                        tags.add(value);
                        setState(() {});
                      },
                    )
                ],
              ),
            ],
          ),
        ),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      if (tags.isNotEmpty)
        Container(
          width: MediaQuery.of(context).size.width,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Column(
            children: [
              const Header('Current tags', level: 2).doc(context),
              const SizedBox(
                height: 10,
              ),
              Wrap(
                runSpacing: 10,
                spacing: 10,
                crossAxisAlignment: WrapCrossAlignment.start,
                runAlignment: WrapAlignment.start,
                alignment: WrapAlignment.start,
                children: [
                  for (var value in tags)
                    ActionChip(
                      label: Text((value)),
                      onPressed: () {
                        tags.removeWhere((element) => element == value);
                        tagsToRemove.add(value);
                        setState(() {});
                      },
                    )
                ],
              ),
            ],
          ),
        ),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      AltogicButton(
          body: 'Remove Tags',
          enabled: () => !loading && tagsToRemove.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              await FileManagerService.of(context).removeTags(tagsToRemove);
              tagsToRemove.clear();
            });
          })
    ];
  }

  /// Removes the specified tags from file's metadata.
  ///
  /// > *If the client library key is set to **enforce session**, an active
  /// user session is required (e.g., user needs to be logged in) to call
  /// this method.*
  ///
  /// [tags] A single tag or an array of tags to remove from file's metadata.
  /// [tags] can be ``String`` or ``List<String>``
  ///
  /// Returns the updated file information

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Removes the specified tags from file\'s metadata.'),
        vSpace,
        const AutoSpan('Returns the updated file information'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                '`tags` A single tag or an array of tags to remove from file\'s metadata.\n'
                '`tags` can be `String` or `List<String>` '),
            vSpace,
            DartCode("""'
var res = ${_getFileManager(context)}'
        .removeTags([
          ${tagsToRemove.map((e) => '"$e"').join(',\n          ')},
        ]);
    """)
          ];

  @override
  String get name => "Remove Tags";
}

class UpdateInfoFileManager extends MethodWrap {
  UpdateInfoFileManager();

  Map<String, dynamic> get file =>
      FileManagerService.of(context).fileInfo.value!;
  final TextEditingController tagsController = TextEditingController();

  late final TextEditingController newName = TextEditingController(
    text: file['fileName'],
  );
  late final ValueNotifier<bool> isPublic =
      ValueNotifier(file['isPublic'] as bool);

  late List<String> tagging;

  void _submitTags(String? submitted) {
    if (submitted != null && submitted.isNotEmpty) {
      tagging.add(submitted);
      tagsController.clear();
      setState(() {});
    }
  }

  @override
  List<Widget> children(BuildContext context) {
    tagging = (file['tags'] as List).cast<String>();
    return [
      AltogicInput(
        hint: "New Name",
        editingController: newName,
      ),
      AltogicInput(
        hint: "Tags",
        onSubmitted: _submitTags,
        editingController: tagsController,
        suffixIcon: (c) => IconButton(
            onPressed: () {
              _submitTags(tagsController.text);
            },
            icon: const Icon(Icons.add)),
      ),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      if (tagging.isNotEmpty)
        Container(
          width: MediaQuery.of(context).size.width,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Column(
            children: [
              const Header('Tags', level: 2).doc(context),
              Wrap(
                runSpacing: 10,
                spacing: 10,
                crossAxisAlignment: WrapCrossAlignment.start,
                runAlignment: WrapAlignment.start,
                alignment: WrapAlignment.start,
                children: [
                  for (var value in tagging)
                    ActionChip(
                      label: Text((value)),
                      onPressed: () {
                        tagging.removeWhere((element) => element == value);
                        setState(() {});
                      },
                    )
                ],
              ),
            ],
          ),
        ),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      ValueListenableBuilder(
          valueListenable: isPublic,
          builder: (c, v, w) {
            return SizedBox(
              width: 300,
              child: CheckboxListTile(
                value: v,
                onChanged: (value) {
                  isPublic.value = value ?? false;
                },
                title: const Text('Is Public'),
              ),
            );
          }),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      AltogicButton(
          body: 'Update Info',
          listenable: tagsController,
          enabled: () => !loading,
          onPressed: () {
            asyncWrapper(() async {
              await FileManagerService.of(context).updateInfo(
                tags: tagging,
                isPublic: isPublic.value,
                newName: newName.text.isEmpty ? null : newName.text,
              );
              tagsController.clear();
              newName.clear();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Updates the overall file metadata (name, isPublic and tags) in a single\n'
            'method call.'),
        vSpace,
        const AutoSpan('Returns the updated file information'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan('`newName` The new name of the file.\n\n\n'
                '`isPublic` The privacy setting of the file.\n\n\n'
                '`tags` Array of string values that will be added to the file metadata.'),
            vSpace,
            DartCode("""
var res = ${_getFileManager(context)}
        .updateInfo(
          newName: '${newName.text}',
          isPublic: ${isPublic.value},
          tags: [
            ${tagging.map((e) => '"$e"').join(',\n            ')}
          ],
        );
    """)
          ];

  @override
  String get name => "Update Info";
}
