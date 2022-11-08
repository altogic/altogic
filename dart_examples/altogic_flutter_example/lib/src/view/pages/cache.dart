import 'package:altogic_flutter_example/src/service/cache_service.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/texts.dart';
import 'package:altogic_flutter_example/src/view/widgets/input.dart';
import 'package:flutter/material.dart';

import '../widgets/documentation/base.dart';
import '../widgets/documentation/code.dart';

class CachePage extends StatefulWidget {
  const CachePage({Key? key}) : super(key: key);

  @override
  State<CachePage> createState() => _CachePageState();
}

class _CachePageState extends State<CachePage> {
  CacheService cacheService = CacheService();

  List<MethodState Function()> widgets = [
    SetCacheMethod.new,
    GetCacheMethod.new,
    DeleteCacheMethod.new,
    IncrementCacheMethod.new,
    DecrementCacheMethod.new,
    ExpireCacheMethod.new,
    GetStatsCacheMethod.new,
    ListKeysMethod.new
  ];

  @override
  Widget build(BuildContext context) {
    return InheritedService(
        service: cacheService,
        child: BaseViewer(
            body: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 30,
          ),
          child: Column(
            children: [
              const Documentation(children: [
                Header("Cache Manager"),
                vSpace,
                AutoSpan(
                    'The cache manager provides simple key-value storage at a high-speed'
                    ' data storage layer (Redis) speeding up data set and get operations.'
                    '\n\n'
                    'The values stored can be a single JSON object, an array of objects or'
                    ' primitive values (e.g., numbers, text, boolean). Values can be stored with'
                    ' an optional time-to-live (TTL) to automatically expire entries.'
                    '\n\n'
                    'You can directly store primitive values such as integers, strings, etc.,'
                    ' however, when you try to get them Altogic returns them wrapped in a simple'
                    ' object with a key named `value`. As an example if you store a text field'
                    ' "Hello world!" at a key named "welcome", when you try to get the value of'
                    ' this key using the [get] method, you will receive the following'
                    ' response: { value: "Hello world"}.'),
                vSpace,
                AutoSpan("This page is used to show cache operations"),
                vSpace,
                AutoSpan("To get an `CacheManager`, you need to use an "
                    "expression: `altogic.cache` "),
                vSpace,
                AutoSpan(
                    "With `CacheManager`, you can call following methods."),
                vSpace,
              ]),
              ...(widgets.map((e) =>
                  MethodWidget(create: e, response: cacheService.response)))
            ],
          ),
        )));
  }
}

class SetCacheMethod extends MethodWrap {
  SetCacheMethod();

  final TextEditingController keyController = TextEditingController();
  final TextEditingController valueController = TextEditingController();
  final TextEditingController ttlController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Key", editingController: keyController),
      AltogicInput(hint: "Value (integer)", editingController: valueController),
      AltogicInput(hint: "TTL in seconds (optional)", editingController: ttlController),
      AltogicButton(
        body: "Set Cache",
        onPressed: () {
          CacheService.of(context).setCache(
              keyController.text,
              int.tryParse(valueController.text),
              int.tryParse(ttlController.text));
        },
        enabled: () =>
            keyController.text.isNotEmpty &&
            valueController.text.isNotEmpty &&
            int.tryParse(valueController.text) != null &&
            (ttlController.text.isEmpty ||
                int.tryParse(ttlController.text) != null),
        listenable: Listenable.merge([keyController, valueController]),
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Sets an item in the cache. Overwrites any existing value already set.'
            ' If *ttl* specified, sets the stored entry to automatically expire'
            ' in specified seconds. Any previous time to live associated with the'
            ' key is discarded on successful set operation.'),
        const LeftSpace(
            '*If the client library key is set to **enforce session**, an active'
            ' user session is required (e.g., user needs to be logged in) to call'
            ' this method.*'),
        vSpace,
        const LeftSpace('*In this example*, values can only be integers.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Sets an item in the cache. Overwrites any existing value already set.'
                ' If *ttl* specified, sets the stored entry to automatically expire'
                ' in specified seconds. Any previous time to live associated with the'
                ' key is discarded on successful set operation.'),
            vSpace,
            DartCode("""
var res = await altogic.cache.set("${keyController.text}", ${valueController.text}, ttl: ${ttlController.text});
if (res == null) {
  //success
}
""")
          ];

  @override
  String get name => "Set Cache Value";
}

class GetCacheMethod extends MethodWrap {
  GetCacheMethod();

  final TextEditingController keyController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Key", editingController: keyController),
      AltogicButton(
        body: "Get Cache",
        onPressed: () {
          CacheService.of(context).getCache(keyController.text);
        },
        enabled: () => keyController.text.isNotEmpty,
        listenable: Listenable.merge([keyController]),
      )
    ];
  }

  ///' > *If the client library key is set to **enforce session**, an active'
  ///' user session is required (e.g., user needs to be logged in) to call'
  ///' this method.*'

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            ' Gets an item from the cache by key. If key is not found, then `null`'
            ' is returned as data.'),
        vSpace,
        const LeftSpace(
            '*If the client library key is set to **enforce session**, an active'
            ' user session is required (e.g., user needs to be logged in) to call'
            ' this method.*'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                ' Gets an item from the cache by key. If key is not found, then `null`'
                ' is returned as data.'),
            vSpace,
            const AutoSpan(
                '`CacheManager.get` method returns a `FutureApiResponse` object.\n'
                'You can use `FutureApiResponse` methods to get the response '
                'data as desired type.'),
            vSpace,
            DartCode("""
var res = await altogic.cache.get("${keyController.text}").asInt();
if (res == null) {
  //success
}
            """)
          ];

  @override
  String get name => "Get Cache Value";
}

// delete cache
class DeleteCacheMethod extends MethodWrap {
  DeleteCacheMethod();

  final TextEditingController keyController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Key", editingController: keyController),
      AltogicButton(
        body: "Delete Cache",
        onPressed: () {
          CacheService.of(context).deleteCache(keyController.text);
        },
        enabled: () => keyController.text.isNotEmpty,
        listenable: Listenable.merge([keyController]),
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Removes the specified key(s) from the cache. Irrespective of whether'
            ' the key is found or not, success response is returned.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Removes the specified key(s) from the cache. Irrespective of whether'
                ' the key is found or not, success response is returned.'),
            vSpace,
            DartCode("""
var errors = await altogic.cache.delete("${keyController.text}");
if (errors == null) {
  // success
}
""")
          ];

  @override
  String get name => "Delete Cache Value";
}

class IncrementCacheMethod extends MethodWrap {
  IncrementCacheMethod();

  final TextEditingController keyController = TextEditingController();
  final TextEditingController amountController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Key", editingController: keyController),
      AltogicInput(hint: "Amount", editingController: amountController),
      AltogicButton(
        body: "Increment Cache",
        onPressed: () {
          CacheService.of(context).increment(
              keyController.text, int.tryParse(amountController.text)!);
        },
        enabled: () =>
            keyController.text.isNotEmpty &&
            int.tryParse(amountController.text) != null,
        listenable: Listenable.merge([keyController, amountController]),
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Increments the value of the number stored at the key by the increment'
            ' amount. If increment amount not specified, increments the number stored'
            ' at key by one. If the key does not exist, it is set to 0 before'
            ' performing the operation. If *ttl* specified, sets the stored entry'
            ' to automatically expire in specified seconds. Any previous time to live'
            ' associated with the key is discarded on successful increment operation.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Increments the value of the number stored at the key by the increment'
                ' amount. If increment amount not specified, increments the number stored'
                ' at key by one. If the key does not exist, it is set to 0 before'
                ' performing the operation. If *ttl* specified, sets the stored entry'
                ' to automatically expire in specified seconds. Any previous time to live'
                ' associated with the key is discarded on successful increment operation.'),
            vSpace,
            DartCode("""
var res = await altogic.cache.increment("${keyController.text}", ${amountController.text});
if (res.errors == null) {
  // success
}
""")
          ];

  @override
  String get name => "Increment Cache Value";
}

class DecrementCacheMethod extends MethodWrap {
  DecrementCacheMethod();

  final TextEditingController keyController = TextEditingController();
  final TextEditingController amountController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Key", editingController: keyController),
      AltogicInput(hint: "Amount", editingController: amountController),
      AltogicButton(
        body: "Decrement Cache",
        onPressed: () {
          CacheService.of(context).decrement(
              keyController.text, int.tryParse(amountController.text)!);
        },
        enabled: () =>
            keyController.text.isNotEmpty &&
            int.tryParse(amountController.text) != null,
        listenable: Listenable.merge([keyController, amountController]),
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Decrements the value of the number stored at the key by the decrement'
            ' amount. If decrement amount not specified, decrements the number stored'
            ' at key by one. If the key does not exist, it is set to 0 before'
            ' performing the operation. If *ttl* specified, sets the stored entry'
            ' to automatically expire in specified seconds. Any previous time to live'
            ' associated with the key is discarded on successful decrement operation.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Decrements the value of the number stored at the key by the decrement'
                ' amount. If decrement amount not specified, decrements the number stored'
                ' at key by one. If the key does not exist, it is set to 0 before'
                ' performing the operation. If *ttl* specified, sets the stored entry'
                ' to automatically expire in specified seconds. Any previous time to live'
                ' associated with the key is discarded on successful decrement operation.'),
            vSpace,
            DartCode("""
var res = await altogic.cache.decrement("${keyController.text}", ${amountController.text});
if (res.errors == null) {
  // success
}
""")
          ];

  @override
  String get name => "Decrement Cache Value";
}

class ExpireCacheMethod extends MethodWrap {
  ExpireCacheMethod();

  final TextEditingController keyController = TextEditingController();
  final TextEditingController ttlController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Key", editingController: keyController),
      AltogicInput(hint: "TTL in seconds", editingController: ttlController),
      AltogicButton(
        body: "Expire Cache",
        onPressed: () {
          CacheService.of(context)
              .expire(keyController.text, int.tryParse(ttlController.text)!);
        },
        enabled: () =>
            keyController.text.isNotEmpty &&
            int.tryParse(ttlController.text) != null,
        listenable: Listenable.merge([keyController, ttlController]),
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Sets a timeout on key. After the timeout has expired, the key will'
            ' automatically be deleted.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Sets a timeout on key. After the timeout has expired, the key will'
                ' automatically be deleted.'),
            vSpace,
            DartCode("""
var errors = await altogic.cache.expire("${keyController.text}", ${ttlController.text});
if (errors == null) {
  // success
}    
""")
          ];

  @override
  String get name => "Expire Cache Value";
}

class GetStatsCacheMethod extends MethodWrap {
  GetStatsCacheMethod();

  final TextEditingController keyController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
        body: "Get Stats",
        onPressed: () {
          CacheService.of(context).getStats();
        },
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Returns the overall information about your apps cache including total'
            ' number of keys and total storage size (bytes), daily and monthly ingress'
            ' and egress volumes (bytes).')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Returns the overall information about your apps cache including total'
                ' number of keys and total storage size (bytes), daily and monthly ingress'
                ' and egress volumes (bytes).'),
            vSpace,
            const DartCode("""
var res = await altogic.cache.getStats();
if (res.errors == null) {
  // success
}
""")
          ];

  @override
  String get name => "Get Stats";
}

class ListKeysMethod extends MethodWrap {
  ListKeysMethod();

  final TextEditingController expressionController = TextEditingController();
  final TextEditingController nextController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Pattern", editingController: expressionController),
      AltogicInput(hint: "Next", editingController: nextController),
      AltogicButton(
        body: "List Keys",
        onPressed: () {
          CacheService.of(context)
              .listKeys(expressionController.text, nextController.text);
        },
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            ' Gets the list of keys in your app cache storage. If `pattern` is'
            ' specified, it runs the pattern match to narrow down returned results,'
            ' otherwise, returns all keys contained in your app\'s cache storage.'
            ' See below examples how to specify filtering pattern:'
            '\n\n'
            ' - h?llo matches hello, hallo and hxllo\n'
            ' - h*llo matches hllo and heeeello\n'
            ' - h[ae]llo matches hello and hallo, but not hillo\n'
            ' - h[^e]llo matches hallo, hbllo, ... but not hello\n'
            ' - h[a-b]llo matches hallo and hbllo')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Gets the list of keys in your app cache storage. If `pattern` is'
                ' specified, it runs the pattern match to narrow down returned results,'
                ' otherwise, returns all keys contained in your app\'s cache storage.'
                ' See below examples how to specify filtering pattern:'
                '\n\n'
                ' - h?llo matches hello, hallo and hxllo\n'
                ' - h*llo matches hllo and heeeello\n'
                ' - h[ae]llo matches hello and hallo, but not hillo\n'
                ' - h[^e]llo matches hallo, hbllo, ... but not hello\n'
                ' - h[a-b]llo matches hallo and hbllo'),
            vSpace,
            const AutoSpan(
                'You can paginate through your cache keys using the `next` cursor.'
                ' In your first call to `listKeys`, specify the `next` value as null.'
                ' This will start pagination of your cache keys. In the return result of'
                ' the method you can get the list of keys matching your pattern and also'
                ' the `next` value that you can use in your next call to `listKeys` method'
                ' to move to the next page. If the returned `next` value is null this means'
                ' that you have paginated all your keys and there is no additional keys'
                'to paginate.'),
            vSpace,
            DartCode("""
var res = await altogic.cache.listKeys(${expressionController.text.isEmpty ? 'null' : '"${expressionController.text}"'}, ${nextController.text.isEmpty ? 'null' : '"${nextController.text}"'});
if (res.errors == null) {
  // success
}""")
          ];

  @override
  String get name => "List Keys";
}
