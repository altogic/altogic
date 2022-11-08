import 'package:altogic_flutter_example/src/service/endpoints_service.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/service/suggestion_service.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/input.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../widgets/base_viewer.dart';
import '../widgets/documentation/base.dart';
import '../widgets/documentation/texts.dart';

class EndpointPage extends StatefulWidget {
  const EndpointPage({Key? key}) : super(key: key);

  @override
  State<EndpointPage> createState() => _DatabasePageState();
}

class _DatabasePageState extends State<EndpointPage> {
  EndpointService endpointService = EndpointService();
  final widgets = [
    GetMethod.new,
    PostMethod.new,
    DeleteMethod.new,
    PutMethod.new,
  ];

  @override
  Widget build(BuildContext context) {
    return InheritedService(
      service: endpointService,
      child: BaseViewer(
          body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 30,
        ),
        child: Column(
          children: [
            const Documentation(children: [
              Header("Endpoint Manager"),
              vSpace,
              AutoSpan("This page is used to show endpoint operations"),
              vSpace,
              Header('Calling Endpoint\n', level: 2),
              AutoSpan("To call an endpoint, you need to use an "
                  "`EndpointManager` instance : `altogic.endpoint`"),
              vSpace,
              AutoSpan("With EndpointManager, you can call any endpoint "
                  "with the following methods : `get` , `post` , `put` , `delete`."),
              vSpace,
              Header('Getting Result\n', level: 2),
              AutoSpan(
                  "Each of these methods returns a `FutureApiResponse` that "
                  "you can use to get the result with casting:"),
              vSpace,
              DartCode("""
var response = await altogic
                    .endpoint
                    .get('<path>')
                    .asMap();
                    
print(response.runtimeType); 
// out APIResponse<Map<String,dynamic>>

if (response.errors == null) {
    print(response.data);
}                  

""")
            ]),
            const SizedBox(
              height: 40,
            ),
            ...widgets.map((e) => MethodWidget(
                  create: e,
                  response: endpointService.response,
                ))
          ],
        ),
      )),
    );
  }
}

abstract class EndpointWrap extends MethodWrap {
  EndpointWrap();

  String get method;

  final TextEditingController controllerA = TextEditingController();
  final TextEditingController controllerB = TextEditingController();

  @override
  String get name => "$method Method";

  Future<void> run(BuildContext context, int a, int b);

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Value a", editingController: controllerA),
      AltogicInput(hint: "Value b", editingController: controllerB),
      AltogicButton(
          body: method,
          onPressed: () {
            asyncWrapper(() async {
              await run(context, int.parse(controllerA.text),
                  int.parse(controllerB.text));
            });
          },
          enabled: () =>
              controllerA.text.isNotEmpty &&
              controllerB.text.isNotEmpty &&
              int.tryParse(controllerA.text) != null &&
              int.tryParse(controllerB.text) != null,
          listenable: Listenable.merge([controllerA, controllerB])),
    ];
  }
}

class GetMethod extends EndpointWrap {
  GetMethod();

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This method is used to get the sum of two numbers as an example."
            " The endpoint allow the numbers as a query parameter. "),
        vSpace,
        const ImageDoc(
            "https://c1-na.altogic.com/_storage/62d3ea1510b444043a4f80b7/62d3ea1510b444043a4f80b7/63627096ae654277fc2d582a",
            maxWidth: 700),
        vSpace,
        const Bold('Path:'),
        const InlineCode('/test/get\n'),
        const Bold("Query Parameters:"),
        const InlineCode('a:integer\nb:integer\n'),
        const Bold('Method:'),
        const InlineCode('GET'),
        vSpace,
        const AutoSpan(
            'This endpoint will return a map with the `"total"` field.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                "This method is used to get the sum of two numbers as an example."
                " The endpoint allow the numbers as a query parameter."),
            vSpace,
            const Bold('Path:'),
            const InlineCode('/test/get\n'),
            const Bold("Query Parameters:"),
            const InlineCode('a:integer\nb:integer\n'),
            const Bold('Method:'),
            const InlineCode('GET'),
            vSpace,
            const AutoSpan(
                'You can fill query parameters with adding to path:'),
            vSpace,
            DartCode("""
altogic
  .endpoint
  .get('/test/get?a=${controllerA.text}&b=${controllerB.text}')
  .asMap();
"""),
            vSpace,
            const AutoSpan("Or you can use the `queryParameters` parameter"),
            vSpace,
            DartCode("""
altogic
   .endpoint
   .get(
        '/test/get',
        queryParams: {
            'a': ${controllerA.text},
            'b': ${controllerB.text},
        }
   )
   .asMap();
"""),
          ];

  @override
  String get method => "GET";

  @override
  Future<void> run(BuildContext context, int a, int b) async {
    await EndpointService.of(context).getMethod(a, b);
  }
}

class PostMethod extends EndpointWrap {
  PostMethod();

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This method is used to get the multiply of two numbers as an example."
            " The endpoint allow the numbers as a json body."),
        vSpace,
        const ImageDoc(
            "https://c1-na.altogic.com/_storage/62d3ea1510b444043a4f80b7/62d3ea1510b444043a4f80b7/636270bcae654277fc2d582b",
            maxWidth: 700),
        vSpace,
        const Bold('Path:'),
        const InlineCode('/test/post\n'),
        const Bold("Request Body:"),
        const DartCode('{\n'
            '   "a": integer,\n'
            '   "b": integer\n'
            '}'),
        const Bold('\nMethod:'),
        const InlineCode('POST'),
        vSpace,
        const AutoSpan(
            'This endpoint will return a map with the `"multiply"` field.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                "This method is used to get the sum of two numbers as an example."
                " The endpoint allow the numbers as a query parameter."),
            vSpace,
            const Bold('Path:'),
            const InlineCode('/test/post\n'),
            const Bold("Request Body:"),
            const DartCode('{\n'
                '   "a": integer,\n'
                '   "b": integer\n'
                '}'),
            const Bold('\nMethod:'),
            const InlineCode('POST'),
            vSpace,
            const AutoSpan('You can fill body with adding to parameter:'),
            vSpace,
            DartCode("""
altogic
   .endpoint
   .post(
        '/test/post',
        body: {
            'a': ${controllerA.text},
            'b': ${controllerB.text},
        }
   )
   .asMap();
"""),
          ];

  @override
  String get method => "POST";

  @override
  Future<void> run(BuildContext context, int a, int b) async {
    await EndpointService.of(context).postMethod(a, b);
  }
}

class DeleteMethod extends MethodWrap {
  DeleteMethod();

  final TextEditingController controller = TextEditingController();

  @override
  String get name => "DELETE Method";

  final List<Map<String, dynamic>> objects = [];

  final SuggestionService suggestion = SuggestionService();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: "Object ID", editingController: controller),
      ...suggestion.getWidget(
          context,
          (limit, page) {
            return EndpointService.of(context).getObjects();
          },
          (m) => m["count"].toString(),
          setState,
          (id) {
            controller.text = id;
          }),
      AltogicButton(
          body: 'Get Objects To Delete',
          onPressed: () {
            suggestion.page = 1;
            suggestion.getSuggestions(
                (limit, page) => EndpointService.of(context).getObjects(),
                setState);
          }),
      AltogicButton(
          body: "DELETE",
          onPressed: () {
            asyncWrapper(() async {
              var res = await EndpointService.of(context)
                  .deleteMethod(controller.text);
              suggestion.values.add(res.data ?? {});
              suggestion.values
                  .removeWhere((element) => element['_id'] == controller.text);
              suggestion.values
                  .sort((a, b) => a['count'].compareTo(b['count']));
              controller.clear();
            });
          },
          enabled: () => controller.text.length == 24,
          listenable: controller),
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("This method is used to delete object as an example."
            " The endpoint allow the deleting object id in path."),
        vSpace,
        const ImageDoc(
            "https://c1-na.altogic.com/_storage/62d3ea1510b444043a4f80b7/62d3ea1510b444043a4f80b7/636270f98b2e22a92742b89d",
            maxWidth: 700),
        vSpace,
        const ImageDoc(
            "https://c1-na.altogic.com/_storage/62d3ea1510b444043a4f80b7/62d3ea1510b444043a4f80b7/636271138b2e22a92742b89e",
            maxWidth: 700),
        vSpace,
        const Bold('Path:'),
        const InlineCode('/test/delete/<id>\n'),
        const Bold('Method:'),
        const InlineCode('Delete'),
        vSpace,
        const LeftSpace("When object deleted with this endpoint,"
            " new object created with random count"),
        vSpace,
        const AutoSpan('This endpoint will return a newly created object.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan("This method is used to delete object as an example."
                " The endpoint allow the deleting object id in path."),
            vSpace,
            const Bold('Path:'),
            const InlineCode('/test/delete/<id>\n'),
            const Bold('\nMethod:'),
            const InlineCode('DELETE'),
            vSpace,
            const AutoSpan('You can delete object with:'),
            vSpace,
            DartCode("""
altogic
   .endpoint
   .post('/test/delete/${controller.text}')
   .asMap();
"""),
          ];
}

class PutMethod extends EndpointWrap {
  PutMethod();

  @override
  String get method => "PUT";

  @override
  Future<void> run(BuildContext context, int a, int b) async {
    await EndpointService.of(context).putMethod(a, b);
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This method is used to get the divide of numbers as an example."
            " The endpoint allow the numbers in request headers."),
        vSpace,
        const ImageDoc(
            "https://c1-na.altogic.com/_storage/62d3ea1510b444043a4f80b7/62d3ea1510b444043a4f80b7/636270d9ae654277fc2d582c",
            maxWidth: 700),
        vSpace,
        const Bold('Path:'),
        const InlineCode('/test/put\n'),
        const Bold("Request Additional Headers:"),
        const DartCode(''
            '   "a": integer,\n'
            '   "b": integer'),
        const Bold('\nMethod:'),
        const InlineCode('PUT'),
        vSpace,
        const AutoSpan(
            'This endpoint will return a map with the `"divide"` field.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                "This method is used to get the divide of numbers as an example."
                " The endpoint allow the numbers in request headers."),
            vSpace,
            const Bold('Path:'),
            const InlineCode('/test/put\n'),
            const Bold("Request Additional Headers:"),
            const DartCode(''
                '   "a": integer,\n'
                '   "b": integer'),
            const Bold('\nMethod:'),
            const InlineCode('PUT'),
            vSpace,
            const AutoSpan('You can fill headers with adding to parameter:'),
            vSpace,
            DartCode("""
altogic
   .endpoint
   .put(
        '/test/put',
        headers: {
            'a': ${controllerA.text},
            'b': ${controllerB.text},
        }
   )
   .asMap();
"""),
          ];
}
