import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/service/storage_service.dart';
import 'package:altogic_flutter_example/src/service/suggestion_service.dart';
import 'package:altogic_flutter_example/src/view/pages/database/cases.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/input.dart';
import 'package:altogic_flutter_example/src/view/widgets/suggestion.dart';
import 'package:flutter/material.dart';

import '../../widgets/documentation/code.dart';
import '../../widgets/documentation/texts.dart';

class StoragePage extends StatefulWidget {
  const StoragePage({Key? key}) : super(key: key);

  @override
  State<StoragePage> createState() => _StoragePageState();
}

class _StoragePageState extends State<StoragePage> {
  final StorageService service = StorageService();

  final widgets = [
    CreateBucket.new,
    ListBuckets.new,
    GetStorageStats.new,
    SearchFilesStorage.new,
    DeleteFileStorage.new,
    CreateBucketManager.new
  ];

  @override
  Widget build(BuildContext context) {
    return InheritedService(
        service: service,
        child: BaseViewer(
          leadingHome: true,
          body: ListView.builder(
              itemCount: widgets.length + 1,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 30),
              itemBuilder: (c, i) {
                if (i == 0) {
                  return const Documentation(children: [
                    Header('Storage\n'),
                    Description(
                        'You can store and manage files in Altogic\'s cloud '
                        'infrastructure.'),
                    vSpace,
                    Description(
                        'Everything that you store in your app storage must '
                        'be contained in a bucket. Buckets are the basic '
                        'containers that hold your application data '
                        '(i.e., files).'),
                    vSpace,
                    AutoSpan('Altogic automatically provides a default *root '
                        'bucket* where you can store your files. \nYou can pretty '
                        'much do everything with the *root bucket* that you can'
                        ' do with a normal bucket except you cannot delete or '
                        'rename it.'),
                    vSpace,
                    ImageDoc(
                        'https://c4-na.altogic.com/_storage/633bd89b98cd8243629533e3/633bd89b98cd8243629533e3/634e8790801cdbe89e377e72',
                        maxWidth: 600),
                    vSpace,
                    Header('There are three type of managers :', level: 2),
                    vSpace,
                    Header('1. Storage Manager', level: 3),
                    vSpace,
                    AutoSpan('This manager is used to manage the storage. '
                        'You can use it to create buckets, list buckets, '
                        'getting storage stats, search files etc.'),
                    vSpace,
                    AutoSpan('Creating StorageManager :\n`altogic.storage`'),
                    vSpace,
                    Header('2. Bucket Manager', level: 3),
                    vSpace,
                    AutoSpan('This manager is used to manage a bucket. '
                        'You can use it to manage bucket info (name, tags etc.),'
                        ' and uploading files to the bucket etc.'),
                    vSpace,
                    AutoSpan('Creating BucketManager :\n'
                        '`altogic.storage.bucket(<bucketName>)`'),
                    vSpace,
                    Header('3. FileManager', level: 3),
                    vSpace,
                    AutoSpan(
                        'This manager is used to manage a file. You can use it'
                        ' to manage file info (name, tags etc.), and downloading'
                        ' file etc.'),
                    vSpace,
                    AutoSpan('Creating FileManager :\n'
                        '`altogic.storage.bucket(<bucketName>).file(<fileName>)`'),
                    vSpace,
                  ]);
                }
                return MethodWidget(
                    create: widgets[i - 1], response: service.response);
              }),
        ));
  }
}

class BucketCreatingManager {
  List<String> tags = [];
  ValueNotifier<bool> isPublic = ValueNotifier(false);
}

class CreateBucket extends MethodWrap {
  CreateBucket();

  final TextEditingController nameController = TextEditingController();
  final TextEditingController tagController = TextEditingController();
  final BucketCreatingManager manager = BucketCreatingManager();

  void _submitTags(String? submitted) {
    if (submitted != null && submitted.isNotEmpty) {
      manager.tags.add(submitted);
      tagController.clear();
      setState(() {});
    }
  }

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Bucket Name', editingController: nameController),
      AltogicInput(
        editingController: tagController,
        hint: "Tags",
        onSubmitted: _submitTags,
        suffixIcon: (c) => IconButton(
            onPressed: tagController.text.isEmpty
                ? null
                : () {
                    _submitTags(tagController.text);
                  },
            icon: const Icon(Icons.add)),
      ),
      ValueListenableBuilder(
          valueListenable: manager.isPublic,
          builder: (context, value, child) {
            return Container(
              width: double.infinity,
              alignment: Alignment.center,
              child: SizedBox(
                width: 200,
                child: CheckboxListTile(
                  title: const Text('Is Public'),
                  value: value,
                  onChanged: (value) {
                    manager.isPublic.value = value!;
                  },
                ),
              ),
            );
          }),
      Container(
        alignment: Alignment.center,
        width: double.infinity,
        child: Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [...manager.tags.map((e) => Chip(label: Text(e)))],
        ),
      ),
      AltogicButton(
        listenable: nameController,
        enabled: () => nameController.text.isNotEmpty,
        onPressed: () {
          asyncWrapper(() async {
            await StorageService.of(context).createBucket(
                nameController.text, manager.tags, manager.isPublic.value);
          });
        },
        body: 'Create Bucket',
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const Description('Create a new bucket'),
        vSpace,
        const AutoSpan(
            'You can create a bucket by calling the `createBucket` method. It '
            'creates a new bucket with the specified name. By default if '
            'this method is called within the context of a user session, '
            'it also assigns the `userId` of the session to the bucket '
            'metadata.'),
        vSpace,
        const LeftSpace(
            'In this application, you are only allowed to test with buckets '
            'that you have created. Therefore, create a bucket to test it.'),
        vSpace
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Creates a new bucket. If there already exists a bucket with the specified'
                ' name, it returns an error.'
                '\n\n'
                'Files can be specified as *public* or *private*, which defines how the'
                ' public URL of the file will behave. If a file is marked as private then'
                ' external apps-parties will not be able to access it through its public'
                ' URL. With [isPublic] parameter of a bucket, you can specify default'
                ' privacy setting of the files contained in this bucket, meaning that when'
                ' you add a file to a bucket and if the file did not specify public-private'
                ' setting, then the the bucket\'s privacy setting will be applied. You can'
                ' always override the default privacy setting of a bucket at the individual'
                ' file level.'),
            vSpace,
            const LeftSpace(
                'If the client library key is set to **enforce session**, an active'
                ' user session is required (e.g., user needs to be logged in) to call'
                ' this method.'),
            vSpace,
            DartCode('''
final res = await altogic.storage.createBucket(
  "${nameController.text}",
  isPublic: ${manager.isPublic.value},
  tags: [${manager.tags.map((e) => '"$e"').join(', ')}]
);
'''),
          ];

  @override
  String get name => "Create Bucket";
}

class FilterBucketService {
  List<BucketSortField> fields = BucketSortField.values;

  ValueNotifier<BucketSortField> currentField =
      ValueNotifier(BucketSortField.createdAt);

  ValueNotifier<bool> asc = ValueNotifier(true);

  ValueNotifier<bool> returnCount = ValueNotifier(false);
}

class ListBuckets extends MethodWrap {
  final TextEditingController limitController = TextEditingController(
    text: '10',
  );
  final TextEditingController pageController = TextEditingController(
    text: '1',
  );

  final FilterBucketService filter = FilterBucketService();

  ListBuckets();

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
              return DropdownButton<BucketSortField>(
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
        hint: 'Filter Expression (optional)',
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
            BasicSuggestions.arrayIn('tags', valueName: 'tag'),
            ...() {
              var d = DateTime.now();
              return BasicSuggestions.comparisonSuggestions('createdAt',
                  valueName:
                      'DATE(${d.year}, ${d.month}, ${d.day}, ${d.hour}, ${d.minute}, ${d.second})',
                  string: false,
                  includeEqual: false);
            }(),
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
          body: 'List Buckets',
          listenable: Listenable.merge([
            limitController,
            pageController,
          ]),
          enabled: () =>
              !loading &&
              int.tryParse(limitController.text) != null &&
              int.tryParse(pageController.text) != null,
          onPressed: () {
            asyncWrapper(() async {
              await StorageService.of(context).listBucket(
                expression: expressionController.text.isNotEmpty
                    ? expressionController.text
                    : null,
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
            'Gets the list of buckets in your app cloud storage. If query `expression`'
            ' is specified, it runs the specified filter query to narrow down returned'
            ' results, otherwise, returns all buckets contained in your app\'s'
            ' cloud storage.'),
        const LinkText('See Filter Expressions',
            'https://pub.dev/documentation/altogic_dart/latest/altogic_dart/StorageManager/listBuckets.html')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Gets the list of buckets in your app cloud storage. If query `expression`'
                ' is specified, it runs the specified filter query to narrow down returned'
                ' results, otherwise, returns all buckets contained in your app\'s'
                ' cloud storage. (TODO: Add link)'),
            vSpace,
            const AutoSpan(
                'You can paginate through your buckets and sort them using the input'
                ' `BucketListOptions` parameter.'),
            vSpace,
            const LeftSpace(
                'If the client library key is set to *enforce session*, an active'
                ' user session is required (e.g., user needs to be logged in) to call'
                ' this method.'),
            vSpace,
            DartCode("""
final res = await altogic.storage.listBuckets(
    expression: '${expressionController.text}',
    options: BucketListOptions(
        limit: ${limitController.text},
        page: ${pageController.text},
        returnCountInfo: ${filter.returnCount.value},
        sort: BucketSortEntry(
            direction: ${filter.asc.value ? Direction.asc : Direction.desc},
            field: ${filter.currentField.value})
            )
        );
""")
          ];

  @override
  String get name => "List Buckets";
}

class GetStorageStats extends MethodWrap {
  GetStorageStats();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
        body: 'Get Storage Stats',
        onPressed: () {
          asyncWrapper(() async {
            await StorageService.of(context).getStats();
          });
        },
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("Get Storage Stats"),
        const AutoSpan(
            'Returns the overall information about your apps cloud storage including'
            ' total number of buckets and files stored, total storage size in bytes'
            ' and average, min and max file size in bytes.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Returns the overall information about your apps cloud storage including'
                ' total number of buckets and files stored, total storage size in bytes'
                ' and average, min and max file size in bytes.'),
            vSpace,
            const LeftSpace(
                'If the client library key is set to *enforce session*, an active'
                ' user session is required (e.g., user needs to be logged in) to call'
                ' this method.'),
            vSpace,
            const DartCode("""
final res = await altogic.storage.getStats();
    """)
          ];

  @override
  String get name => "Get Stats";
}

class SearchFileStorageService {
  List<FileSortField> fields = FileSortField.values;

  ValueNotifier<FileSortField> currentField =
      ValueNotifier(FileSortField.updatedAt);

  ValueNotifier<bool> asc = ValueNotifier(true);

  ValueNotifier<bool> returnCount = ValueNotifier(false);
}

class SearchFilesStorage extends MethodWrap {
  final TextEditingController limitController = TextEditingController(
    text: '10',
  );
  final TextEditingController pageController = TextEditingController(
    text: '1',
  );

  final SearchFileStorageService filter = SearchFileStorageService();

  SearchFilesStorage();

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
        vertical: true,
        editingController: expressionController,
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
            ...BasicSuggestions.stringMethodsSuggestions('fileName'),
            ...BasicSuggestions.equalitySuggestions('mimeType',
                string: true, valueName: 'image/png'),
            ...BasicSuggestions.comparisonSuggestions('size'),
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
          body: 'Search Files',
          listenable: Listenable.merge(
              [limitController, pageController, expressionController]),
          enabled: () =>
              !loading &&
              int.tryParse(limitController.text) != null &&
              int.tryParse(pageController.text) != null &&
              expressionController.text.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              await StorageService.of(context).searchFilesStorage(
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
        const Description('Search File in all buckets'),
        vSpace,
        const AutoSpan(
            'Gets the list of files matching the search expression. This method'
            ' performs a global search across all the files contained in all the'
            ' buckets. You can use the following file fields in your search expression.'),
        vSpace,
        const LinkText("See API Documentation",
            'https://pub.dev/documentation/altogic_dart/latest/altogic_dart/StorageManager/searchFiles.html'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const Description('Search File in all buckets'),
            vSpace,
            const AutoSpan(
                'Gets the list of files matching the search expression. This method'
                ' performs a global search across all the files contained in all the'
                ' buckets. You can use the following file fields in your search expression.'),
            vSpace,
            const LinkText("See API Documentation",
                'https://pub.dev/documentation/altogic_dart/latest/altogic_dart/StorageManager/searchFiles.html'),
            vSpace,
            const AutoSpan(
                'You can paginate through your files and sort them using the input'
                ' `FileListOptions` parameter.'),
            vSpace,
            const LeftSpace(
                'If the client library key is set to *enforce session*, an active'
                ' user session is required (e.g., user needs to be logged in) to call'
                ' this method.'),
            vSpace,
            DartCode("""
final res = await altogic
    .storage
    .searchFiles(
        '${expressionController.text}',
        FileListOptions(
            limit: ${limitController.text},
            page: ${pageController.text},
            returnCountInfo: ${filter.returnCount.value},
            sort: FileSort(
                field: ${filter.currentField.value},
                direction: ${(filter.asc.value ? Direction.asc : Direction.desc)}
            )
        )
    );
if (res.errors == null) {
  // success
}
    """)
          ];

  @override
  String get name => "Search File";
}

class DeleteFileStorage extends MethodWrap {
  DeleteFileStorage();

  final TextEditingController urlController = TextEditingController();

  final ValueNotifier<String?> preview = ValueNotifier<String?>(null);

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: urlController,
        hint: 'File URL',
      ),
      vSpace.doc(context),
      Container(
        width: double.infinity,
        alignment: Alignment.center,
        child: SizedBox(
          width: 500,
          child: ValueListenableBuilder(
              valueListenable: preview,
              builder: (c, v, w) {
                return v == null ? Container() : Image.network(v);
              }),
        ),
      ),
      AltogicButton(
          listenable: urlController,
          enabled: () => !loading && urlController.text.isNotEmpty,
          body: "Preview Image",
          onPressed: () {
            setState(() {
              preview.value = urlController.text;
            });
          }),
      AltogicButton(
        body: 'Delete File',
        onPressed: () {
          asyncWrapper(() async {
            await StorageService.of(context).deleteFile(urlController.text);
          });
        },
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("Delete File With URL (publicPath)"),
        vSpace,
        const AutoSpan(
            'Deletes a file identified by the url string. You can directly use this'
            ' method to delete any file that you know its url (e.g., no need to'
            ' specify bucket name-id and file name-id)'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan("Delete File With URL (publicPath)"),
            vSpace,
            const AutoSpan(
                'Deletes a file identified by the url string. You can directly use this'
                ' method to delete any file that you know its url (e.g., no need to'
                ' specify bucket name-id and file name-id)'),
            vSpace,
            const LeftSpace(
                'If the client library key is set to *enforce session*, an active'
                ' user session is required (e.g., user needs to be logged in) to call'
                ' this method.'),
            vSpace,
            DartCode("""
final res = await altogic
    .storage
    .deleteFile('${urlController.text}');
if (res == null) {
  // success
}
    """)
          ];

  @override
  String get name => "Delete File (with url)";
}

class CreateBucketManager extends MethodWrap {
  CreateBucketManager();

  final TextEditingController nameOrIdController = TextEditingController();

  final SuggestionService suggestionService = SuggestionService();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
          hint: "Bucket Name Or ID", editingController: nameOrIdController),
      vSpace.doc(context),
      ...suggestionService.getWidget(
          context,
          (limit, page) async {
            var res = await StorageService.of(context).listBucket(
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
            nameOrIdController.text = id;
          }),
      vSpace.doc(context),
      AltogicButton(
          body: "Get Suggestions",
          onPressed: () {
            asyncWrapper(() async {
              suggestionService.page = 1;
              var res = await StorageService.of(context).listBucket(
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
        body: "Create BucketManager",
        onPressed: () {
          Navigator.of(context).pushNamed('/bucket',
              arguments: <String, dynamic>{'bucket': nameOrIdController.text});
          return;
        },
        enabled: () => nameOrIdController.text.isNotEmpty,
        listenable: nameOrIdController,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Creates an instance of BucketManager to manage a specific'
            ' bucket of your cloud storage'
            '\n\n'
            '`bucketNameOrId` The name or id of the bucket that this'
            ' bucket manager will be operating on.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Creates an instance of BucketManager to manage a specific'
                ' bucket of your cloud storage'
                '\n\n'
                '`bucketNameOrId` The name or id of the bucket that this'
                ' bucket manager will be operating on.'),
            vSpace,
            DartCode("""
final fileManager = altogic.storage.bucket('${nameOrIdController.text}');
    """)
          ];

  @override
  String get name => "Create BucketManager";
}
