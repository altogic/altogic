import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/service/suggestion_service.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/suggestion.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

import 'utils/upload.dart'
    if (dart.library.io) 'utils/io_upload.dart'
    if (dart.library.html) 'utils/web_upload.dart' show getUintList;

import '../../../service/storage_service.dart';
import '../../widgets/button.dart';
import '../../widgets/case.dart';
import '../../widgets/documentation/base.dart';
import '../../widgets/documentation/texts.dart';
import '../../widgets/input.dart';
import 'storage_page.dart';

class GetBucketExists extends MethodWrap {
  GetBucketExists();

  ///'Check if the bucket exists.'
  ///''

  ///''
  ///'Returns true if bucket exists, false otherwise'

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: "Get Bucket Exists",
          onPressed: () {
            asyncWrapper(() async {
              await BucketService.of(context).getBucketExists();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Check if the bucket exists.'),
        vSpace,
        const AutoSpan('Returns true if bucket exists, false otherwise'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Check if the bucket exists.'),
            vSpace,
            const LeftSpace(
                'If the client library key is set to *enforce session*, an active'
                ' user session is required (e.g., user needs to be logged in) to call'
                ' this method.'),
            vSpace,
            const AutoSpan('Returns true if bucket exists, false otherwise'),
            vSpace,
            DartCode("""
var res = await altogic
     .storage
     .bucket("${BucketService.of(context).bucket}")
     .exists();
     
print(res.data);     

""")
          ];

  @override
  String get name => "Get Bucket exists";
}

class GetBucketInfo extends MethodWrap {
  GetBucketInfo();

  final ValueNotifier<bool> detailed = ValueNotifier(false);

  @override
  List<Widget> children(BuildContext context) {
    return [
      ValueListenableBuilder(
          valueListenable: detailed,
          builder: (context, v, w) {
            return SizedBox(
              width: 300,
              child: CheckboxListTile(
                value: detailed.value,
                onChanged: (c) => detailed.value = c!,
                title: const Text("Detailed"),
              ),
            );
          }),
      const SizedBox(
        width: double.infinity,
      ),
      AltogicButton(
          body: "Get Bucket Info",
          onPressed: () {
            asyncWrapper(() async {
              await BucketService.of(context).getBucketInfo(detailed.value,true);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Gets information about the bucket. If `detailed=true`, it provides'
            ' additional information about the total number of files contained, their'
            ' overall total size in bytes, average, min and max file size in bytes etc.'),
        vSpace,
        const AutoSpan('`detailed` Specifies whether to get detailed bucket'
            ' statistics or not.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Gets information about the bucket. If `detailed=true`, it provides'
                ' additional information about the total number of files contained, their'
                ' overall total size in bytes, average, min and max file size in bytes etc.'),
            vSpace,
            const LeftSpace(
                'If the client library key is set to *enforce session*, an active'
                ' user session is required (e.g., user needs to be logged in) to call'
                ' this method.'),
            vSpace,
            const AutoSpan('`detailed` Specifies whether to get detailed bucket'
                ' statistics or not.'),
            vSpace,
            const AutoSpan(
                'Returns basic bucket metadata informaton. If `detailed=true`'
                ' provides additional information about contained files.'),
            vSpace,
            DartCode("""
var res = await altogic
      .storage
      .bucket("${BucketService.of(context).bucket}")
      .getInfo(${detailed.value});
""")
          ];

  @override
  String get name => "Get Bucket Info";
}

class EmptyBucket extends MethodWrap {
  EmptyBucket();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: "Empty Bucket (clear bucket)",
          onPressed: () {
            asyncWrapper(() async {
              await BucketService.of(context).emptyBucket();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Removes all objects (e.g., files) inside the bucket. This method does not'
            ' delete the bucket itself. If you also want to delete the bucket,'
            ' including all its contained objects, you can use `delete` method.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Removes all objects (e.g., files) inside the bucket. This method does not'
                ' delete the bucket itself. If you also want to delete the bucket,'
                ' including all its contained objects, you can use `delete` method.'),
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            DartCode("""
var res = await altogic
      .storage
      .bucket("${BucketService.of(context).bucket}")
      .empty();
""")
          ];

  @override
  String get name => "Empty Bucket";
}

class RenameBucket extends MethodWrap {
  RenameBucket();

  final TextEditingController controller = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "New Name", editingController: controller),
      AltogicButton(
          body: "Rename Bucket",
          enabled: () => controller.text.isNotEmpty,
          listenable: controller,
          onPressed: () {
            asyncWrapper(() async {
              await BucketService.of(context).renameBucket(controller.text);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Renames the bucket.'),
        vSpace,
        const AutoSpan(
            '`newName` The new name of the bucket. `root` is a reserved name and'
            ' cannot be used.'),
        vSpace,
        const AutoSpan('Returns the updated bucket information'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Renames the bucket.'),
            vSpace,
            const AutoSpan(
                '`newName` The new name of the bucket. `root` is a reserved name and'
                ' cannot be used.'),
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan('Returns the updated bucket information'),
            DartCode("""
var res = await altogic
      .storage
      .bucket("${BucketService.of(context).bucket}")
      .rename("${controller.text}");
 """)
          ];

  @override
  String get name => "Rename Bucket";
}

class DeleteBucket extends MethodWrap {
  DeleteBucket();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: "Delete Bucket",
          onPressed: () {
            asyncWrapper(() async {
              await BucketService.of(context).deleteBucket();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Deletes the bucket and all objects (e.g., files) inside the bucket.'
            ' Returns an error if `root` bucket is tried to be deleted.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            DartCode("""
var res = await altogic
      .storage
      .bucket("${BucketService.of(context).bucket}")
      .delete();
""")
          ];

  @override
  String get name => "Delete Bucket";
}

class MakePublicBucket extends MethodWrap {
  MakePublicBucket();

  final ValueNotifier<bool> includeFiles = ValueNotifier(false);

  @override
  List<Widget> children(BuildContext context) {
    return [
      SizedBox(
        width: 250,
        child: ValueListenableBuilder<bool>(
          valueListenable: includeFiles,
          builder: (context, value, child) => Row(
            children: [
              const Expanded(child: Text("Include Files")),
              Switch(
                value: value,
                onChanged: (value) => includeFiles.value = value,
              ),
            ],
          ),
        ),
      ),
      vSpace.doc(context),
      AltogicButton(
          body: "Make Public",
          onPressed: () {
            asyncWrapper(() async {
              await BucketService.of(context).makePublic(includeFiles.value);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Sets the default privacy of the bucket to *true*. You may also choose'
            ' to make the contents of the bucket publicly readable by specifying'
            ' `includeFiles=true`. This will automatically set `isPublic=true` for'
            ' every file in the bucket.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            const AutoSpan(
                '`includeFiles` Specifies whether to make each file in the bucket public.'),
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                '`includeFiles` Specifies whether to make each file in '
                'the bucket public.'),
            vSpace,
            const AutoSpan('Returns the updated bucket information'),
            vSpace,
            DartCode("""
var res = await altogic
      .storage
      .bucket("${BucketService.of(context).bucket}")
      .makePublic(${includeFiles.value});
        """)
          ];

  @override
  String get name => "Make Public";
}

class MakePrivateBucket extends MethodWrap {
  MakePrivateBucket();

  final ValueNotifier<bool> includeFiles = ValueNotifier(false);

  @override
  List<Widget> children(BuildContext context) {
    return [
      SizedBox(
        width: 250,
        child: ValueListenableBuilder<bool>(
          valueListenable: includeFiles,
          builder: (context, value, child) => Row(
            children: [
              const Expanded(child: Text("Include Files")),
              Switch(
                value: value,
                onChanged: (value) => includeFiles.value = value,
              ),
            ],
          ),
        ),
      ),
      vSpace.doc(context),
      AltogicButton(
          body: "Make Private",
          onPressed: () {
            asyncWrapper(() async {
              await BucketService.of(context).makePrivate(includeFiles.value);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Sets the default privacy of the bucket to *false*. You may also choose'
            ' to make the contents of the bucket publicly readable by specifying'
            ' `includeFiles=true`. This will automatically set `isPublic=false` for'
            ' every file in the bucket.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            const AutoSpan(
                '`includeFiles` Specifies whether to make each file in the'
                ' bucket public.'),
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                '`includeFiles` Specifies whether to make each file in '
                'the bucket private.'),
            vSpace,
            const AutoSpan('Returns the updated bucket information'),
            vSpace,
            DartCode("""
var res = await altogic
      .storage
      .bucket("${BucketService.of(context).bucket}")
      .makePrivate(${includeFiles.value});
        """)
          ];

  @override
  String get name => "Make Private";
}

class ListFilesBucket extends MethodWrap {
  final TextEditingController limitController = TextEditingController(
    text: '10',
  );
  final TextEditingController pageController = TextEditingController(
    text: '1',
  );

  final SearchFileStorageService filter = SearchFileStorageService();

  ListFilesBucket();

  final TextEditingController expressionController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    var sorting = Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Sorting With:'),
        ValueListenableBuilder(
            valueListenable: filter.currentField,
            builder: (context, value, child) {
              return DropdownButton<FileSortField>(
                  value: filter.currentField.value,
                  items: filter.fields
                      .map((e) =>
                          DropdownMenuItem(value: e, child: Text(e.name)))
                      .toList(),
                  onChanged: (v) {
                    setState(() {
                      filter.currentField.value = v!;
                    });
                  });
            }),
        const SizedBox(
          width: 20,
        ),
        ValueListenableBuilder(
            valueListenable: filter.asc,
            builder: (context, val, w) {
              return SizedBox(
                width: 100,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Text('Ascending'),
                    Switch(
                        value: val,
                        onChanged: (v) {
                          setState(() {
                            filter.asc.value = v;
                          });
                        }),
                  ],
                ),
              );
            }),
      ],
    );
    var size = MediaQuery.of(context).size;
    return [
      // Sort with
      Container(
        width: MediaQuery.of(context).size.width,
        alignment: Alignment.center,
        child: SizedBox(
            width: MediaQuery.of(context).size.width.clamp(0, 500),
            child: size.width < 350
                ? SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: sorting,
                  )
                : sorting),
      ),
      ValueListenableBuilder(
          valueListenable: filter.returnCount,
          builder: (context, value, child) {
            return Container(
              width: double.infinity,
              alignment: Alignment.center,
              child: SizedBox(
                width: 250,
                child: CheckboxListTile(
                  title: const Text('Return Count Info'),
                  value: value,
                  onChanged: (value) {
                    filter.returnCount.value = value!;
                  },
                ),
              ),
            );
          }),
      vSpace.doc(context),

      AltogicInput(
        hint: 'Filter Expression',
        editingController: expressionController,
        vertical: true,
        suffixIcon: (c) => IconButton(
          icon: const Icon(Icons.clear),
          onPressed: () {
            expressionController.clear();
          },
        ),
      ),

      BasicSuggestions(
          values: [
            ...BasicSuggestions.logicalOperators,
            ...() {
              var d = DateTime.now();
              return BasicSuggestions.comparisonSuggestions('uploadedAt',
                  valueName:
                      'DATE(${d.year}, ${d.month}, ${d.day}, ${d.hour}, ${d.minute}, ${d.second})',
                  string: false,
                  includeEqual: false);
            }(),
            ...BasicSuggestions.stringMethodsSuggestions('fileName',
                valueName: 'value')
          ],
          onSelected: (v) {
            expressionController.text = expressionController.text + v;
          }),

      // Limit
      AltogicInput(
        editingController: limitController,
        hint: 'Limit',
        info: const [
          AutoSpan('Limit is used to limit the number of results.'),
          vSpace,
          AutoSpan('Default value is 10.'),
        ],
      ),

      // Page
      AltogicInput(
        editingController: pageController,
        hint: 'Page',
        info: const [
          AutoSpan('Page is used to get the next page of results.'),
          vSpace,
          AutoSpan('Default value is 1.'),
        ],
      ),

      AltogicButton(
          body: 'List Files',
          listenable: Listenable.merge([limitController, pageController]),
          enabled: () =>
              !loading &&
              int.tryParse(limitController.text) != null &&
              int.tryParse(pageController.text) != null,
          onPressed: () {
            asyncWrapper(() async {
              await BucketService.of(context).listFiles(
                expression: expressionController.text,
                limit: int.parse(limitController.text),
                page: int.parse(pageController.text),
                returnCountInfo: filter.returnCount.value,
                sort: filter.currentField.value,
                asc: filter.asc.value,
              );
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Gets the list of files stored in the bucket. If query `expression`'
            ' is specified, it runs the specified filter query to narrow down returned'
            ' results, otherwise, returns all files contained in the bucket. You can'
            ' use the following file fields in your query expressions.'),
        vSpace,
        const AutoSpan(
            'You can paginate through your files and sort them using the input'
            ' `options` parameter.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                '`expression` The query expression string that will be used'
                ' to filter file objects'),
            vSpace,
            const AutoSpan('`options` Pagination and sorting options'),
            vSpace,
            const AutoSpan(
                'Returns the array of files. If `returnCountInfo=true` in'),
            vSpace,
            const AutoSpan(
                '`FileListOptions`, returns an object which includes count'
                ' information and array of files.'),
            vSpace,
            DartCode("""
final res = await altogic.storage.bucket(bucket).listFiles(
       expression: "${expressionController.text}",
       options: FileListOptions(
           limit: ${limitController.text},
           page: ${pageController.text},
           returnCountInfo: ${filter.returnCount.value},
           sort: FileSort(
               field: ${filter.currentField.value},
               direction: ${(filter.asc.value ? Direction.asc : Direction.desc)}
           )
       )
);
    """)
          ];

  @override
  String get name => "List Files";
}

class UploadFileFromBucket extends MethodWrap {
  UploadFileFromBucket();

  final ValueNotifier<PlatformFile?> bytes = ValueNotifier<PlatformFile?>(null);
  final TextEditingController nameController = TextEditingController();
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
                          child: AltogicInput(
                              hint: "File Name",
                              editingController: nameController),
                        ),
                        const SizedBox(
                          width: 20,
                        ),
                        IconButton(
                            onPressed: () {
                              nameController.clear();
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
                    nameController.text = file.files.first.name;
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
      AltogicButton(
          enabled: () =>
              !loading && bytes.value != null && nameController.text.isNotEmpty,
          body: 'Upload File',
          listenable: Listenable.merge([bytes, nameController]),
          onPressed: () {
            asyncWrapper(() async {
              await BucketService.of(context)
                  .uploadFile(nameController.text, getUintList(bytes.value!),
                      (l, t, percent) {
                process.value = t / l;
              },
                      bytes.value!.extension != null
                          ? contentTypes[bytes.value!.extension]!
                          : 'text/plain');

              process.value = null;
              bytes.value = null;
              nameController.clear();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Uploads a file to an existing bucket. If there already exists a file with'
            ' the same name in destination bucket, it ensures the uploaded file name'
            ' to be unique in its bucket.'),
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
                '`fileName` The name of the file e.g., *filename.jpg*'
                '\n\n\n'
                '`fileBody` The body of the file that will be stored in the bucket'
                '\n\n\n'
                '`options` Content type of the file, privacy setting of the file and'
                ' whether to create the bucket if not exists. `contentType` is ignored,'
                ' `contentType` option needs to be specified. If not specified, `contentType` will'
                ' default to `text/plain;charset=UTF-8`. If `isPublic` is not specified,'
                ' defaults to the bucket\'s privacy setting. If `createBucket` is set to'
                ' true (defaults to false), then creates a new bucket if the bucket does'
                ' not exist.'
                '\n\n\n'
                'Returns the metadata of the uploaded file'),
            vSpace,
            const LeftSpace("In this example, `contentType` auto defined. "
                "Auto defined content type available for following extensions: "
                "'png', 'jpg', 'jpeg', 'webp', 'gif', 'mp4', 'mp3', 'mov',"
                " 'wav', 'json', 'txt', 'html', 'css','js' "),
            vSpace,
            DartCode("""
var res = await altogic
      .storage
      .bucket("${BucketService.of(context).bucket}")
      .upload(
          "${nameController.text}",
          bytes,
          FileUploadOptions(
              onProgress: (loaded, total, percent) {
                print(percent);
              },
              contentType: "${bytes.value?.extension != null ? contentTypes[bytes.value!.extension]! : 'text/plain'}"
          )
      );
    """)
          ];

  @override
  String get name => "Upload File";
}

class _Deleting {
  final List<String> deleting = [];
  int page = 0;
}

class DeleteFilesMethod extends MethodWrap {
  DeleteFilesMethod();

  final SuggestionService suggestionService = SuggestionService();

  final TextEditingController nameOrIdController = TextEditingController();

  final _Deleting _deleting = _Deleting();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        hint: "File Name Or ID",
        editingController: nameOrIdController,
        suffixIcon: (c) => IconButton(
            onPressed: () {
              suggestionService.values.removeWhere((element) =>
                  element["_id"] == nameOrIdController.text ||
                  element["fileName"] == nameOrIdController.text);
              _deleting.deleting.add(nameOrIdController.text);
              nameOrIdController.clear();
              setState(() {});
            },
            icon: const Icon(Icons.add)),
      ),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      if (_deleting.deleting.isNotEmpty)
        Container(
          width: MediaQuery.of(context).size.width,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: Column(
            children: [
              const Header('Files to delete', level: 2).doc(context),
              Wrap(
                runSpacing: 10,
                spacing: 10,
                crossAxisAlignment: WrapCrossAlignment.start,
                runAlignment: WrapAlignment.start,
                alignment: WrapAlignment.start,
                children: [
                  for (var value in _deleting.deleting)
                    ActionChip(
                      label: Text((value)),
                      onPressed: () {
                        _deleting.deleting
                            .removeWhere((element) => element == value);
                        suggestionService.values.removeWhere((element) =>
                            element["_id"] == value ||
                            element["fileName"] == value);
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
      ...suggestionService.getWidget(
          context,
          (limit, page) async {
            var res = await BucketService.of(context).listFiles(
                limit: limit,
                page: page,
                returnCountInfo: false,
                sort: FileSortField.fileName,
                asc: true,
                expression: '');
            return (res as List)
                .map((e) => (e as Map).cast<String, dynamic>())
                .toList();
          },
          (map) => map['fileName'],
          setState,
          (id) {
            var w = suggestionService.values
                .indexWhere((element) => element["_id"] == id);
            if (w != -1) {
              _deleting.deleting.add(suggestionService.values[w]["fileName"]);
              suggestionService.values.removeAt(w);
            }
          }),
      const SizedBox(
        width: double.infinity,
        height: 4,
      ),
      AltogicButton(
          body: 'Get Suggestions',
          onPressed: () {
            suggestionService.getSuggestions((limit, page) async {
              var res = await BucketService.of(context).listFiles(
                  limit: limit,
                  page: page,
                  returnCountInfo: false,
                  sort: FileSortField.fileName,
                  asc: true,
                  expression: '');
              return (res as List)
                  .map((e) => (e as Map).cast<String, dynamic>())
                  .toList();
            }, setState);
          }),
      AltogicButton(
          body: 'Delete Files',
          listenable: nameOrIdController,
          enabled: () => !loading && _deleting.deleting.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              await BucketService.of(context).deleteFiles(_deleting.deleting);
              _deleting.deleting.clear();
            });
          })
    ];
  }

  ///' Deletes multiple files identified either by their names or ids.'
  ///''
  ///' [fileNamesOrIds] Array of name or ids of the files to delete.'

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Deletes multiple files identified either by their names or ids.'),
        vSpace,
        const AutoSpan(
            '`fileNamesOrIds` Array of name or ids of the files to delete.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Deletes multiple files identified either by their names or ids.'),
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                '`fileNamesOrIds` Array of name or ids of the files to delete.'),
            vSpace,
            DartCode("""
var res = await altogic
       .storage
       .bucket("${BucketService.of(context).bucket}")
       .deleteFiles([
          "${_deleting.deleting.join('",\n          "')}"
       ]);
    """)
          ];

  @override
  String get name => "Delete Files";
}

class AddTagsBucketManager extends MethodWrap {
  AddTagsBucketManager();

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
              await BucketService.of(context).addTags(tagging);
              tagsController.clear();
              //TODO: ON
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const Description('Adds the specified tags to bucket\'s metadata.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Adds the specified tags to bucket\'s metadata.'),
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                '`tags` A single tag or an array of tags to add to bucket\'s metadata.'),
            vSpace,
            const AutoSpan('`tags` can be `String` or `List<String>`'),
            vSpace,
            const AutoSpan('Returns the updated bucket information'),
            vSpace,
            DartCode("""
var res = await altogic
       .storage
       .bucket("${BucketService.of(context).bucket}")
       .addTags([
          "${tagging.join('",\n          "')}"
       ]);
    """)
          ];

  @override
  String get name => "Add Tags";
}

class RemoveTagsBucketManager extends MethodWrap {
  RemoveTagsBucketManager();

  List<String> get tags =>
      ((BucketService.of(context).bucketInfo.value!['tags'] as List?)
              ?.cast<String>() ??
          <String>[]);

  final List<String> tagsToRemove = [];

  @override
  List<Widget> children(BuildContext context) {
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
              await BucketService.of(context).removeTags(tagsToRemove);
              tagsToRemove.clear();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const Description('Removes the specified tags to bucket\'s metadata.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Removes the specified tags to bucket\'s metadata.'),
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                '`tags` A single tag or an array of tags to remove from bucket\'s metadata.'),
            vSpace,
            const AutoSpan('`tags` can be `String` or `List<String>`'),
            vSpace,
            const AutoSpan('Returns the updated bucket information'),
            vSpace,
            DartCode("""
var res = await altogic
       .storage
       .bucket("${BucketService.of(context).bucket}")
       .removeTags([
          "${tagsToRemove.join('",\n          "')}"
       ]);
    """)
          ];

  @override
  String get name => "Remove Tags";
}

class UpdateInfoBucketManager extends MethodWrap {
  UpdateInfoBucketManager();

  Map<String, dynamic> get bucket =>
      BucketService.of(context).bucketInfo.value!;

  final TextEditingController tagsController = TextEditingController();
  late final TextEditingController newName = TextEditingController(
    text: bucket['name'],
  );
  late final ValueNotifier<bool> isPublic =
      ValueNotifier(bucket['isPublic'] as bool);
  final ValueNotifier<bool> includeFiles = ValueNotifier(false);

  List<String> get tagging =>
      ((BucketService.of(context).bucketInfo.value!['tags'] as List?)
              ?.cast<String>() ??
          <String>[]);

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
      ValueListenableBuilder(
          valueListenable: includeFiles,
          builder: (c, v, w) {
            return SizedBox(
              width: 300,
              child: CheckboxListTile(
                value: v,
                onChanged: (value) {
                  includeFiles.value = value ?? false;
                },
                title: const Text('Include Files'),
              ),
            );
          }),
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
              await BucketService.of(context).updateInfo(
                tags: tagging,
                includeFiles: includeFiles.value,
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
            'Updates the overall bucket metadata (name, isPublic and tags) in a single'
            ' method call.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const AutoSpan(
                '`newName` The new name of the bucket. `root` is a reserved name and cannot be used.'),
            vSpace,
            const AutoSpan(
                '`isPublic` The default privacy setting that will be applied to the files uploaded to this bucket.'),
            vSpace,
            const AutoSpan(
                '`tags` Array of string values that will be added to the bucket metadata. `tags` can be `String` or `List<String>`'),
            vSpace,
            const AutoSpan(
                '`includeFiles` Specifies whether to make each file in the bucket to have the same privacy setting of the bucket.'),
            vSpace,
            const AutoSpan('Returns the updated bucket information'),
            vSpace,
            DartCode("""
var res = await altogic
        .storage
        .bucket("${BucketService.of(context).bucket}")
        .updateInfo(
          newName: "${newName.text}",
          isPublic: ${isPublic.value},
          includeFiles: ${includeFiles.value},
          tags: [
            "${tagging.join('",\n            "')}"
          ]
        );
    """)
          ];

  @override
  String get name => "Update Info";
}

class CreateFileManager extends MethodWrap {
  CreateFileManager();

  final SuggestionService suggestionService = SuggestionService();
  final TextEditingController fileNameOrID = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "File Name or ID", editingController: fileNameOrID),
      ...suggestionService.getWidget(
          context,
          (limit, page) async {
            var res = await BucketService.of(context).listFiles(
                limit: limit,
                page: page,
                returnCountInfo: false,
                sort: FileSortField.fileName,
                asc: true,
                expression: '');
            return (res as List)
                .map((e) => (e as Map).cast<String, dynamic>())
                .toList();
          },
          (map) => map['fileName'],
          setState,
          (id) {
            fileNameOrID.text = id;
          }),
      const SizedBox(
        height: 2,
        width: double.infinity,
      ),
      AltogicButton(
          body: 'Get Suggestions',
          onPressed: () async {
            var res = await BucketService.of(context).listFiles(
                limit: 10,
                page: 1,
                returnCountInfo: false,
                sort: FileSortField.fileName,
                asc: true,
                expression: '');
            suggestionService.values = (res as List)
                .map((e) => (e as Map).cast<String, dynamic>())
                .toList();
            setState(() {});
          }),
      AltogicButton(
          body: 'Create File Manager',
          onPressed: () {
            Navigator.of(context).pushNamed('/file',
                arguments: <String, dynamic>{
                  'file': fileNameOrID.text,
                  'bucket': BucketService.of(context).bucket
                });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Creates an instance of FileManager to manage a specific'
            ' file of your cloud storage'
            '\n\n'
            '`fileNameOrId` The name or id of the file that this'
            ' file manager will be operating on.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Creates an instance of FileManager to manage a specific'
                ' file of your cloud storage'
                '\n\n'
                '`fileNameOrId` The name or id of the file that this'
                ' file manager will be operating on.'),
            vSpace,
            DartCode("""
final fileManager = altogic
        .storage
        .bucket('${BucketService.of(context).bucket}')
        .file('${fileNameOrID.text}');
    """)
          ];

  @override
  String get name => "Create File Manager";
}
