import 'dart:math';

import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/service/db_service.dart';
import 'package:altogic_flutter_example/src/service/suggestion_service.dart';
import 'package:altogic_flutter_example/src/utils/lorem.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/input.dart';
import 'package:altogic_flutter_example/src/view/widgets/suggestion.dart';
import 'package:flutter/material.dart';

import '../../../controller/user_controller.dart';
import '../../widgets/documentation/texts.dart';

CurrentUserController currentUser = CurrentUserController();

// get market
class GetMarketWithObjectId extends MethodWrap {
  GetMarketWithObjectId();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Get Market',
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context)
                  .getMarketWithObjectId(currentUser.market.id);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'You can create a direct reference to objects whose `_id` is *known*.'
            ' This created reference is of type `DBObject`.'),
        vSpace,
        const AutoSpan('Get market object from database with `DbObject`.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan('Get market object from database with `DbObject`. \n'
                'To get `DbObject` instance call `.object` method on'
                ' `QueryBuilder` instance.'),
            vSpace,
            DartCode("""
DBObject object = altogic.db
       .model('market')
       .object('${currentUser.market.id}');
"""),
            vSpace,
            const AutoSpan(
                'You can get `DbObject` from database with `get` method.'),
            vSpace,
            const DartCode("""
await object.get();
  """),
            vSpace,
            const AutoSpan('General use case:'),
            vSpace,
            DartCode("""
var res = altogic.db
            .model('market')  
            .object('${currentUser.market.id}')
            .get();
""")
          ];

  @override
  String get name => "Get market  (DbObject.get)";
}

class GetMarketWithFilter extends MethodWrap {
  GetMarketWithFilter();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Get Market',
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context)
                  .getMarketWithFilter(currentUser.market.id);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'You can filter objects with `QueryBuilder`. Get market object from'
            ' database with `QueryBuilder.filter`. After adding the '
            'filtering and other operations (sorting etc.) as a chain, you can'
            ' call the `.get` method to get the result.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Get market object from database with `QueryBuilder.filter`.'),
            vSpace,
            DartCode("""
var res = await altogic
      .db
      .model('market')
      .filter('_id == "${currentUser.market.id}"')
      .get();
"""),
          ];

  @override
  String get name => "Get market (QueryBuilder.filter)";
}

class GetMarketWithLookup extends MethodWrap {
  GetMarketWithLookup();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Get Market',
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context)
                  .getMarketWithLookup(currentUser.market.id);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'If the model you are querying has an object reference field,'
            ' you can also get the referenced object by doing a simple lookup.'
            ' Get market object from database with `QueryBuilder.lookup`'
            ' and filter.')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Get market object from database with `QueryBuilder.lookup` and filter.'),
            vSpace,
            DartCode("""
var res = await altogic
      .db
      .model('market')
      .filter('_id == "${currentUser.market.id}"')
      .lookup(SimpleLookup(field: 'user'))
      .get();
"""),
          ];

  @override
  String get name => "Get market with user (QueryBuilder.lookup)";
}

class GetContact extends MethodWrap {
  final TextEditingController contactIdController = TextEditingController();

  GetContact();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: contactIdController,
        hint: 'Contact id',
      ),
      AltogicButton(
          body: 'Get Contact',
          enabled: () => !loading && contactIdController.text.length == 24,
          listenable: contactIdController,
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context).getContact(contactIdController.text);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan('Get contact object from database with `DbObject.get`. '
            '"contact" is a *sub-model* of the "market" model. '
            'You can get the sub-model object also by using the `DbObject.get`'
            ' method. For this you need to specify the sub-model name in the'
            ' `model` method like `db.model(market.contacts)`.'
            '\n'
            'You can copy contact id from the "Get market" example. There isn\'t'
            '')
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Get contact object from database with `DbObject.get`.'),
            vSpace,
            DartCode("""
            var res = await altogic
                  .db
                  .model('market.contacts')
                  .object('${contactIdController.text}')
                  .get();
            """),
          ];

  @override
  String get name => "Get contact from db (DbObject.get)";
}

class CreateMarketCase extends MethodWrap {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController addressController = TextEditingController();

  CreateMarketCase();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: nameController,
        hint: "Market Name",
      ),
      vSpace.doc(context),
      AltogicInput(
        editingController: addressController,
        hint: "Market Address (Optional)",
      ),
      AltogicButton(
        body: 'Create Market',
        onPressed: () {
          DbService.of(context).createMarket(nameController.text,
              addressController.text.isEmpty ? null : addressController.text);
        },
        listenable: nameController,
        enabled: () => !loading && nameController.text.isNotEmpty,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to create a new market. The market name is required.\n"
            "The method `QueryBuilder.create` is used to create a new object in the database.\n"),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => const [
            AutoSpan(
                'Create market function uses `.create` method of ``QueryBuilder'),
            DartCode("""
altogic.db.model('market').create({
  'name': name, 'user': owner, 'market_address': address
})
"""),
          ];

  @override
  String get name => 'Create Market';
}

class ChangeMarketName extends MethodWrap {
  final TextEditingController nameController = TextEditingController();

  ChangeMarketName();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: nameController,
        hint: "New Market Name",
      ),
      AltogicButton(
        body: 'Change Market Name',
        onPressed: () {
          asyncWrapper(() async {
            await DbService.of(context).changeMarketName(nameController.text);
          });
        },
        listenable: nameController,
        enabled: () => !loading && nameController.text.isNotEmpty,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("You can perform update operations with `DBObject`."
            " This case is used to change the name of the market."
            " The new name is required."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Change market name function uses `.update` method of `DbObject`'),
            vSpace,
            DartCode("""
var res = await altogic.db
    .model('market')
    .object('${currentUser.market.id}') // id
    .update({
      'name': '${nameController.text}',
     });
"""),
          ];

  @override
  String get name => 'Change Market Name (DbObject.update)';
}

class AddMarketContact extends MethodWrap {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();

  AddMarketContact();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: nameController,
        hint: "Contact Name",
      ),
      AltogicInput(
        editingController: emailController,
        hint: "Email Address",
      ),
      AltogicButton(
        body: 'Add Market Contact',
        onPressed: () {
          asyncWrapper(() async {
            await DbService.of(context)
                .appendMarketContact(nameController.text, emailController.text);
          });
        },
        listenable: Listenable.merge([nameController, emailController]),
        enabled: () =>
            !loading &&
            nameController.text.isNotEmpty &&
            emailController.text.isNotEmpty,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("This case is used to add a new contact to the market."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Add market contact function uses `.append` method of `DBObject`'),
            vSpace,
            DartCode("""
var res = await altogic.db
    .model('market.contacts')
    .object()
    .append({
        'name': ${nameController.text},
        'email': ${emailController.text},
      }, 
      "${currentUser.market.id}",
      options: const AppendOptions(returnTop: true)
    );
            """),
          ];

  @override
  String get name => 'Add Market Contact (DbObject.append)';
}

class DeleteContact extends MethodWrap {
  final TextEditingController idController = TextEditingController();

  final SuggestionService suggestion = SuggestionService();

  DeleteContact();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: idController,
        hint: 'Contact ID',
        info: const [
          AutoSpan('Contact ID is used to delete the contact.'),
        ],
      ),
      ...suggestion.getWidget(
          context,
          (limit, page) =>
              DbService.of(context).getMarketContacts(limit: limit, page: page),
          (map) => map['name'] as String,
          setState, (id) {
        idController.text = id;
      }),
      AltogicButton(
          body: 'Get Contacts To Suggestion',
          onPressed: () {
            suggestion.page = 1;
            suggestion.getSuggestions(
                (limit, page) => DbService.of(context)
                    .getMarketContacts(limit: limit, page: page),
                setState);
          }),
      AltogicButton(
        body: 'Delete Contact',
        onPressed: () {
          asyncWrapper(() async {
            var res =
                await DbService.of(context).deleteContact(idController.text);
            if (res) {
              setState(() {
                suggestion.values.removeWhere(
                    (element) => element['_id'] == idController.text);
                idController.clear();
              });
            }
          });
        },
        listenable: idController,
        enabled: () => !loading && idController.text.isNotEmpty,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to delete a contact from your market. Contact ID is required.\n"
            "Delete contact function uses `.delete` method of `DbObject`"),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Delete product function uses `.delete` method of `DBObject`'),
            vSpace,
            DartCode("""
var res = await altogic.db
    .model('market.contacts')
    .object(${idController.text})
    .delete();
    
if (res.errors == null) {
  // Product deleted successfully
}
"""),
          ];

  @override
  String get name => 'Delete Contact (DbObject.delete)';
}

class DeleteContactWithFilter extends MethodWrap {
  final TextEditingController idController = TextEditingController();

  final SuggestionService suggestion = SuggestionService();

  DeleteContactWithFilter();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: idController,
        hint: 'Contact ID',
        info: const [
          AutoSpan('Contact ID is used to delete the contact.'),
        ],
      ),
      ...suggestion.getWidget(
          context,
          (limit, page) =>
              DbService.of(context).getMarketContacts(limit: limit, page: page),
          (map) => map['name'] as String,
          setState, (id) {
        idController.text = id;
      }),
      AltogicButton(
          body: 'Get Contacts To Suggestion',
          onPressed: () {
            suggestion.page = 1;
            suggestion.getSuggestions(
                (limit, page) => DbService.of(context)
                    .getMarketContacts(limit: limit, page: page),
                setState);
          }),
      AltogicButton(
        body: 'Delete Contact',
        onPressed: () {
          asyncWrapper(() async {
            var res = await DbService.of(context)
                .deleteContactWithFilter(idController.text);
            if (res) {
              setState(() {
                suggestion.values.removeWhere(
                    (element) => element['_id'] == idController.text);
                idController.clear();
              });
            }
          });
        },
        listenable: idController,
        enabled: () => !loading && idController.text.isNotEmpty,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to delete a contact from your market. Contact ID is required.\n"
            "Delete contact function uses `.delete` method of `QueryBuilder`"),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Delete product function uses `.delete` method of `QueryBuilder`'),
            vSpace,
            DartCode("""
var res = await altogic.db
    .model('market.contacts')
    .filter('_id == "${idController.text}"')
    .delete();
    
if (res.errors == null) {
  // Product deleted successfully
}
"""),
          ];

  @override
  String get name => 'Delete Contact (QueryBuilder.delete)';
}

class ChangeMarketAddress extends MethodWrap {
  final TextEditingController addressController = TextEditingController();

  ChangeMarketAddress();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: addressController,
        hint: "New Market Address",
      ),
      AltogicButton(
        body: 'Change Market Address',
        onPressed: () {
          asyncWrapper(() async {
            await DbService.of(context)
                .changeMarketAddress(addressController.text);
          });
        },
        listenable: addressController,
        enabled: () => !loading && addressController.text.isNotEmpty,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to change the address of the market. The new address is required."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Change market address function uses `.updateFields` method of ``QueryBuilder'),
            vSpace,
            DartCode("""
var res = await altogic.db
        .model('market')
        .object("${currentUser.market.id}") // id
        .updateFields(FieldUpdate(
            field: 'market_address',
            updateType: UpdateType.set,
            value: "${addressController.text}"));
            
if (res.errors == null) {
  // success
}
"""),
          ];

  @override
  String get name => 'Change Market Address (updateFields/set)';
}

class UnsetMarketAddress extends MethodWrap {
  UnsetMarketAddress();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
        body: 'Unset Market Address',
        onPressed: () {
          asyncWrapper(() async {
            await DbService.of(context).unsetMarketAddress();
          });
        },
        enabled: () => !loading,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("This case is used to unset the address of the market."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Unset market address function uses `.updateFields` method of ``QueryBuilder'),
            vSpace,
            DartCode("""
var res = await altogic.db
        .model('market')
        .object("${currentUser.market.id}") // id
        .updateFields(FieldUpdate(
            field: 'market_address',
            updateType: UpdateType.unset));
            
if (res.errors == null) {
  // success
}
"""),
          ];

  @override
  String get name => 'Unset Market Address (updateFields/unset)';
}

class CreateProduct extends MethodWrap {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController priceController = TextEditingController();
  final TextEditingController categoryController = TextEditingController();
  final TextEditingController propertyController = TextEditingController();
  final TextEditingController quantityController = TextEditingController();

  final List<String> categories = [];
  final List<String> properties = [];

  CreateProduct();

  void _submitProperty(String? submitted) {
    if (submitted != null && submitted.isNotEmpty) {
      properties.add(propertyController.text);
      propertyController.clear();
      setState(() {});
    }
  }

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: nameController,
        hint: "Product Name",
      ),
      AltogicInput(
        editingController: descriptionController,
        hint: "Product Description",
      ),
      AltogicInput(
        editingController: priceController,
        hint: "Product Price",
      ),
      AltogicInput(
        editingController: quantityController,
        hint: "Product Quantity",
      ),
      AltogicInput(
        editingController: categoryController,
        hint: "Product Category",
        info: const [
          AutoSpan(
              "You can use any string as a category. It is not a predefined field."),
          vSpace,
          AutoSpan('You can also use group categories method to gain ideas.')
        ],
      ),
      AltogicInput(
        editingController: propertyController,
        hint: "Product Property",
        onSubmitted: _submitProperty,
        suffixIcon: (c) => IconButton(
            onPressed: propertyController.text.isEmpty
                ? null
                : () {
                    _submitProperty(propertyController.text);
                  },
            icon: const Icon(Icons.add)),
        info: const [
          AutoSpan(
              "You can use any string as a property. It is not a predefined field."
              " You can add multiple properties."),
          vSpace,
          AutoSpan('To add property type and add it to the list.')
        ],
      ),
      SizedBox(
        width: MediaQuery.of(context).size.width,
        child: Wrap(
          children: properties
              .map((e) => Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Chip(
                      label: Text(e),
                      onDeleted: () {
                        properties.remove(e);
                        setState(() {});
                      },
                    ),
                  ))
              .toList(),
        ),
      ),
      if (categories.isNotEmpty)
        SizedBox(
          width: MediaQuery.of(context).size.width,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                  alignment: Alignment.center,
                  width: MediaQuery.of(context).size.width,
                  child:
                      const Text('Tap to fill category field or type new one')),
              const SizedBox(height: 10),
              Wrap(
                runSpacing: 10,
                spacing: 10,
                children: [
                  for (var cat in categories)
                    ActionChip(
                      label: Text(cat),
                      onPressed: () {
                        categoryController.text = cat;
                      },
                    )
                ],
              )
            ],
          ),
        ),
      AltogicButton(
        body: 'Get Category Suggestions',
        documentationBuilder: (c) => const [
          AutoSpan('Group categories function uses `.group` and `.compute` '
              'method of ``QueryBuilder'),
          vSpace,
          DartCode("""
var res = await altogic.db
  .model('product')
  .group('category')
  .compute(GroupComputation(
    sort: Direction.desc,
    name: 'count',
    type: GroupComputationType.count,
  ));
"""),
        ],
        onPressed: () async {
          await asyncWrapper<List<String>?>(() async {
            var res = await DbService.of(context).groupCategories(true);
            categories.addAll(res ?? []);
            return res;
          });
        },
        enabled: () => !loading,
      ),
      AltogicButton(
        body: 'Fill with Lorem Ipsum ',
        onPressed: () {
          nameController.text = createProductName();
          descriptionController.text = createProductDescription();
          priceController.text = Random().nextInt(100).toString();
          quantityController.text = Random().nextInt(100).toString();
          categoryController.text = createProductCategory();
          propertyController.clear();
          properties.clear();
          properties.addAll(createProductProperties());
          setState(() {});
        },
      ),
      AltogicButton(
        body: 'Create Product',
        onPressed: () {
          asyncWrapper(() async {
            var res = await DbService.of(context).createProduct(
                nameController.text,
                descriptionController.text,
                int.parse(priceController.text),
                categoryController.text,
                properties,
                int.parse(quantityController.text));
            if (res) {
              nameController.clear();
              descriptionController.clear();
              priceController.clear();
              categoryController.clear();
              propertyController.clear();
              properties.clear();
              quantityController.clear();
              setState(() {});
            }
          });
        },
        listenable: Listenable.merge([
          nameController,
          descriptionController,
          priceController,
          categoryController,
          quantityController
        ]),
        enabled: () =>
            !loading &&
            properties.isNotEmpty &&
            nameController.text.isNotEmpty &&
            priceController.text.isNotEmpty &&
            descriptionController.text.isNotEmpty &&
            categoryController.text.isNotEmpty &&
            int.tryParse(priceController.text) != null &&
            int.tryParse(quantityController.text) != null,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to create a new product. All fields are required."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => const [
            AutoSpan(
                'Create product function uses `.create` method of ``QueryBuilder'),
            vSpace,
            DartCode("""
var res = await altogic.db
    .model('product')
    .create({
      'name': name,
      'description': description,
      'market': currentUserController.market.id,
      'price': price,
      'category': category,
      'amount': quantity,
});
"""),
          ];

  @override
  String get name => 'Create Product (create)';
}

class FilterService {
  List<String> fields = ['name', 'price', 'category', 'createdAt', 'updatedAt'];

  String currentField = 'createdAt';

  bool asc = true;
}

class GetMarketProducts extends MethodWrap {
  final filter = FilterService();

  final TextEditingController limitController = TextEditingController(
    text: '10',
  );
  final TextEditingController pageController = TextEditingController(
    text: '1',
  );

  GetMarketProducts();

  @override
  List<Widget> children(BuildContext context) {
    var sorting = Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Sorting With:'),
        DropdownButton(
            value: filter.currentField,
            items: filter.fields
                .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                .toList(),
            onChanged: (v) {
              setState(() {
                filter.currentField = v as String;
              });
            }),
        const SizedBox(
          width: 20,
        ),
        SizedBox(
          width: 100,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Text('Ascending'),
              Switch(
                  value: filter.asc,
                  onChanged: (v) {
                    setState(() {
                      filter.asc = v;
                    });
                  }),
            ],
          ),
        ),
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
      vSpace.doc(context),

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
          body: 'Get Market Products',
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
              await DbService.of(context).getMarketProducts(
                  sortEntry: SortEntry(filter.currentField,
                      filter.asc ? Direction.asc : Direction.desc),
                  limit: int.tryParse(limitController.text) ?? 20,
                  page: int.tryParse(pageController.text) ?? 1);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to get all products of the current market."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Get market products function uses `.get` method of ``QueryBuilder'),
            vSpace,
            DartCode("""
var res = await altogic.db
  .model('product')
  .sort('${filter.currentField}',
      ${filter.asc} ? Direction.asc : Direction.desc})
  .filter('market == "${currentUser.market.id}"')
  .get();
"""),
          ];

  @override
  String get name => 'Get Market Products (filter)';
}

class FilterAllProducts extends MethodWrap {
  final filter = FilterService();

  final TextEditingController expression = TextEditingController();

  final TextEditingController limitController = TextEditingController(
    text: '10',
  );
  final TextEditingController pageController = TextEditingController(
    text: '1',
  );

  FilterAllProducts();

  @override
  void initState() {
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
      Future.wait([
        DbService.of(context).groupCategories(false),
        DbService.of(context).groupProperties(false)
      ]).then((value) {
        if (mounted) {
          setState(() {
            categories = value[0];
            properties = value[1];
          });
        }
      });
    });
    super.initState();
  }

  List<String>? categories;
  List<String>? properties;

  @override
  List<Widget> children(BuildContext context) {
    var sorting = Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text('Sorting With:'),
        DropdownButton(
            value: filter.currentField,
            items: filter.fields
                .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                .toList(),
            onChanged: (v) {
              setState(() {
                filter.currentField = v as String;
              });
            }),
        const SizedBox(
          width: 20,
        ),
        SizedBox(
          width: 100,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const Text('Ascending'),
              Switch(
                  value: filter.asc,
                  onChanged: (v) {
                    setState(() {
                      filter.asc = v;
                    });
                  }),
            ],
          ),
        ),
      ],
    );
    var size = MediaQuery.of(context).size;
    return [
      AltogicInput(
          vertical: true,
          suffixIcon: (c) => IconButton(
              icon: const Icon(Icons.clear),
              onPressed: () {
                expression.clear();
              }),
          hint: 'Filter Expression',
          editingController: expression),
      BasicSuggestions(
          values: [
            ...BasicSuggestions.logicalOperators,
            if (categories != null && categories!.isNotEmpty)
              ...BasicSuggestions.equalitySuggestions('category',
                  valueName: categories!.first, string: true),
            ...BasicSuggestions.comparisonSuggestions('price',
                valueName: "1000"),
            if (properties != null && properties!.isNotEmpty)
              BasicSuggestions.arrayIn('properties',
                  valueName: properties!.first)
          ],
          onSelected: (v) {
            expression.text = expression.text + v;
          }),
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
      vSpace.doc(context),

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
          body: 'Get Products',
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
              await DbService.of(context).filterProducts(
                  expression: expression.text,
                  sortEntry: SortEntry(filter.currentField,
                      filter.asc ? Direction.asc : Direction.desc),
                  limit: int.tryParse(limitController.text) ?? 20,
                  page: int.tryParse(pageController.text) ?? 1);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("This case is used to get all products with filter."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Filter products function uses `.get` method of ``QueryBuilder'),
            vSpace,
            DartCode("""
var res = await altogic.db
  .model('product')
  .sort('${filter.currentField}', ${filter.asc ? Direction.asc : Direction.desc})
  .filter('${expression.text}')
  .get();
"""),
          ];

  @override
  String get name => 'Filter Products (filter)';
}

class SearchProducts extends MethodWrap {
  final TextEditingController searchController = TextEditingController();

  SearchProducts();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: searchController,
        hint: 'Search',
        info: const [
          AutoSpan('Search is used to search for products.'),
          vSpace,
          AutoSpan('Default value is empty.'),
        ],
      ),
      AltogicButton(
          body: 'Search Products',
          listenable: searchController,
          enabled: () => !loading && searchController.text.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context).searchProducts(searchController.text);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to search for products of the current market."),
        vSpace,
        const AutoSpan(
            "`QueryBuilder.search` searches by exact match. You can use `searchFuzzy` to search without an exact match."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Search products function uses `.search` method of ``QueryBuilder'),
            vSpace,
            DartCode("""
var res = await altogic.db
  .model('product')
  .searchText('${searchController.text}')
  .get();
"""),
          ];

  @override
  String get name => 'Search Products (QueryBuilder.search)';
}

// search fuzzy
class SearchFuzzyProducts extends MethodWrap {
  final TextEditingController searchController = TextEditingController();

  final List<String> fields = [
    'name',
    'category',
  ];

  final ValueNotifier<String> currentField = ValueNotifier('name');

  SearchFuzzyProducts();

  @override
  List<Widget> children(BuildContext context) {
    return [
      Container(
        width: MediaQuery.of(context).size.width,
        alignment: Alignment.center,
        child: SizedBox(
            width: MediaQuery.of(context).size.width.clamp(100, 300),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Field:'),
                DropdownButton(
                    value: currentField.value,
                    items: fields
                        .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                        .toList(),
                    onChanged: (v) {
                      setState(() {
                        currentField.value = v as String;
                      });
                    })
              ],
            )),
      ),
      AltogicInput(
        editingController: searchController,
        hint: 'Search',
        info: const [
          AutoSpan('Search is used to search for products.'),
          vSpace,
          AutoSpan('Default value is empty.'),
        ],
      ),
      AltogicButton(
          body: 'Search Fuzzy Products',
          listenable: searchController,
          enabled: () => !loading && searchController.text.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context).searchFuzzyProducts(
                  currentField.value, searchController.text);
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to search for products of the current market."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Search products function uses `.search` method of ``QueryBuilder'),
            vSpace,
            DartCode("""
var res = await altogic.db
  .model('product')
  .searchText('${searchController.text}')
  .get();
"""),
          ];

  @override
  String get name => 'Search Fuzzy Products';
}

class OmitService {
  Map<String, bool> omitFields = {
    'name': false,
    'price': false,
    'category': false,
    'createdAt': false,
    'updatedAt': false,
    'properties': false,
    'amount': false,
    'market': false,
    'description': false,
  };
}

class OmitProduct extends MethodWrap {
  final TextEditingController idController = TextEditingController();

  OmitProduct();

  final SuggestionService suggestion = SuggestionService();

  final OmitService omit = OmitService();

  @override
  List<Widget> children(BuildContext context) {
    return [
      ...omit.omitFields.entries.map((e) {
        var tile = CheckboxListTile(
          title: Text(e.key),
          value: e.value,
          onChanged: (v) {
            setState(() {
              omit.omitFields[e.key] = v!;
            });
          },
        );
        return Container(
          margin: const EdgeInsets.symmetric(vertical: 3),
          width: MediaQuery.of(context).size.width.clamp(100, 300),
          decoration: BoxDecoration(
            border: Border.all(
                color: const Color.fromRGBO(25, 118, 210, 1), width: 0.5),
          ),
          child: MediaQuery.of(context).size.width < 200
              ? SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: tile,
                )
              : tile,
        );
      }),
      SizedBox(
        width: MediaQuery.of(context).size.width,
        height: 10,
      ),
      AltogicInput(
        editingController: idController,
        hint: 'Product ID',
      ),
      ...suggestion.getWidget(
          context,
          (limit, page) => DbService.of(context).getMarketProductsNames(
              sortEntry: SortEntry('createdAt', Direction.asc),
              limit: limit,
              page: page,
              withPrice: true,
              withAmount: true),
          (map) => map['name'],
          setState, (id) {
        idController.text = id;
      }),
      AltogicButton(
          body: 'Get Products To Suggestion',
          onPressed: () {
            suggestion.page = 1;
            suggestion.getSuggestions(
                (limit, page) => DbService.of(context).getMarketProductsNames(
                    sortEntry: SortEntry('createdAt', Direction.asc),
                    limit: limit,
                    page: page,
                    withPrice: true,
                    withAmount: true),
                setState);
          }),
      AltogicButton(
          body: 'Get Product With Fields',
          listenable: Listenable.merge([
            idController,
          ]),
          enabled: () => !loading && idController.text.length == 24,
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context).getProductWithOmit(
                idController.text,
                omit.omitFields.keys
                    .where((element) => omit.omitFields[element]!)
                    .toList(),
              );
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to show `QueryBuilder.omit` method.\n\n"
            "You can mark the fields that you do not want to return."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                "This case is used to show `QueryBuilder.omit` method.\n\n"
                "You can mark the fields that you do not want to return."),
            vSpace,
            DartCode("""
var res = await altogic.db
      .model('product')
      .filter('_id == "${idController.text}"')
      .omit(['${omit.omitFields.keys.where((element) => omit.omitFields[element]!).join("', '")}'])
      .get();
    """),
          ];

  @override
  String get name => 'Get Product With Selected Fields (Omit)';
}

// change product price
class ChangePrice extends MethodWrap {
  final TextEditingController priceController = TextEditingController();
  final TextEditingController idController = TextEditingController();

  ChangePrice();

  final SuggestionService suggestion = SuggestionService();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: idController,
        hint: 'Product ID',
      ),
      AltogicInput(
        editingController: priceController,
        hint: 'Price',
      ),
      ...suggestion.getWidget(
          context,
          (limit, page) => DbService.of(context).getMarketProductsNames(
              sortEntry: SortEntry('createdAt', Direction.asc),
              limit: limit,
              page: page,
              withPrice: true,
              withAmount: true),
          (map) => map['name'],
          setState, (id) {
        idController.text = id;
      }),
      AltogicButton(
          body: 'Get Products To Suggestion',
          onPressed: () {
            suggestion.page = 1;
            suggestion.getSuggestions(
                (limit, page) => DbService.of(context).getMarketProductsNames(
                    sortEntry: SortEntry('createdAt', Direction.asc),
                    limit: limit,
                    page: page,
                    withPrice: true,
                    withAmount: true),
                setState);
          }),
      AltogicButton(
          body: 'Change Price',
          listenable: Listenable.merge([
            priceController,
            idController,
          ]),
          enabled: () =>
              !loading &&
              int.tryParse(priceController.text) != null &&
              idController.text.length == 24,
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context).changeProductPrice(
                  idController.text, int.parse(priceController.text));
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to change price of products of the current market."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Change price function uses `.update` method of ``QueryBuilder'),
            vSpace,
            DartCode("""
var res = await altogic.db
    .model('product')
    .filter('_id = "${idController.text}"')
    .update({'price': ${priceController.text}});
"""),
          ];

  @override
  String get name => 'Change Product Price (QueryBuilder.update)';
}

// Delete Product
class DeleteProduct extends MethodWrap {
  final TextEditingController idController = TextEditingController();

  final SuggestionService suggestion = SuggestionService();

  DeleteProduct();

  //

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: idController,
        hint: 'Product ID',
        info: const [
          AutoSpan('Product ID is used to delete the product.'),
        ],
      ),
      ...suggestion.getWidget(
          context,
          (limit, page) => DbService.of(context).getMarketProductsNames(
              sortEntry: SortEntry('createdAt', Direction.asc),
              limit: limit,
              page: page),
          (map) => map['name'],
          setState, (id) {
        idController.text = id;
      }),
      AltogicButton(
          body: 'Get Products To Suggestion',
          onPressed: () {
            suggestion.page = 1;
            suggestion.getSuggestions(
                (limit, page) => DbService.of(context).getMarketProductsNames(
                    sortEntry: SortEntry('createdAt', Direction.asc),
                    limit: limit,
                    page: page),
                setState);
          }),
      AltogicButton(
        body: 'Delete Product',
        onPressed: () {
          asyncWrapper(() async {
            var res =
                await DbService.of(context).deleteProduct(idController.text);
            if (res) {
              setState(() {
                suggestion.values.removeWhere(
                    (element) => element['_id'] == idController.text);
                idController.clear();
              });
            }
          });
        },
        listenable: idController,
        enabled: () => !loading && idController.text.isNotEmpty,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to delete a product. Product ID is required.\n"
            "Delete product function uses `.delete` method of `DBObject`"),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Delete product function uses `.delete` method of `DBObject`'),
            vSpace,
            DartCode("""
var res = await altogic.db
    .model('product')
    .object(${idController.text})
    .delete();
    
if (res.errors == null) {
  // Product deleted successfully
}
"""),
          ];

  @override
  String get name => 'Delete Product (DbObject.delete)';
}

// Delete Product
class DeleteProductWithQueryBuilder extends MethodWrap {
  final TextEditingController idController = TextEditingController();

  final SuggestionService suggestion = SuggestionService();

  DeleteProductWithQueryBuilder();

  //

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
        editingController: idController,
        hint: 'Product ID',
        info: const [
          AutoSpan('Product ID is used to delete the product.'),
        ],
      ),
      ...suggestion.getWidget(
          context,
          (limit, page) => DbService.of(context).getMarketProductsNames(
              sortEntry: SortEntry('createdAt', Direction.asc),
              limit: limit,
              page: page),
          (map) => map['name'],
          setState, (id) {
        idController.text = id;
      }),
      AltogicButton(
          body: 'Get Products To Suggestion',
          onPressed: () {
            suggestion.page = 1;
            suggestion.getSuggestions(
                (limit, page) => DbService.of(context).getMarketProductsNames(
                    sortEntry: SortEntry('createdAt', Direction.asc),
                    limit: limit,
                    page: page),
                setState);
          }),
      AltogicButton(
        body: 'Delete Product',
        onPressed: () {
          asyncWrapper(() async {
            var res = await DbService.of(context)
                .deleteProductWithQuery(idController.text);
            if (res) {
              setState(() {
                suggestion.values.removeWhere(
                    (element) => element['_id'] == idController.text);
                idController.clear();
              });
            }
          });
        },
        listenable: idController,
        enabled: () => !loading && idController.text.isNotEmpty,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to delete a product. Product ID is required.\n"
            "Delete product function uses `.delete` method of `QueryBuilder`"),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                'Delete product function uses `.delete` method of `QueryBuilder`'),
            vSpace,
            DartCode("""
var res = await altogic.db
    .model('product')
    .object(${idController.text})
    .delete();
    
if (res.errors == null) {
  // Product deleted successfully
}
"""),
          ];

  @override
  String get name => 'Delete Product (QueryBuilder.delete)';
}

class IncrementDecrement extends MethodWrap {
  final TextEditingController idController = TextEditingController();

  final TextEditingController amountController = TextEditingController();

  final SuggestionService suggestion = SuggestionService();

  IncrementDecrement();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(editingController: idController, hint: 'Product ID'),
      AltogicInput(hint: 'Amount', editingController: amountController),
      ...suggestion.getWidget(
          context,
          (limit, page) => DbService.of(context).getMarketProductsNames(
              sortEntry: SortEntry('createdAt', Direction.asc),
              limit: limit,
              page: page,
              withAmount: true,
              withPrice: true),
          (map) => map['name'],
          setState, (id) {
        idController.text = id;
      }),
      AltogicButton(
          body: 'Get Product',
          enabled: () => idController.text.length == 24,
          listenable: idController,
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context).getProduct(idController.text);
            });
          }),
      AltogicButton(
          body: 'Get Products To Suggestion',
          onPressed: () {
            suggestion.page = 1;
            suggestion.getSuggestions(
                (limit, page) => DbService.of(context).getMarketProductsNames(
                    sortEntry: SortEntry('createdAt', Direction.asc),
                    limit: limit,
                    page: page,
                    withAmount: true,
                    withPrice: true),
                setState);
          }),
      AltogicButton(
        body: 'Increment Stock',
        onPressed: () {
          asyncWrapper(() async {
            await DbService.of(context).incrementProductAmount(
                idController.text, int.parse(amountController.text));
          });
        },
        listenable: Listenable.merge([idController, amountController]),
        enabled: () =>
            !loading &&
            amountController.text.isNotEmpty &&
            int.tryParse(amountController.text) != null &&
            idController.text.length == 24,
      ),
      AltogicButton(
        body: 'Decrement Stock',
        onPressed: () {
          asyncWrapper(() async {
            await DbService.of(context).decrementProductAmount(
                idController.text, int.parse(amountController.text));
          });
        },
        listenable: Listenable.merge([idController, amountController]),
        enabled: () =>
            !loading &&
            amountController.text.isNotEmpty &&
            int.tryParse(amountController.text) != null &&
            idController.text.length == 24,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to update product price. Product ID is required.\n"
            "functions use `.updateFields` method of `DBObject`"),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => null;

  @override
  String get name => 'Change Product Quantity(increment/decrement)';
}

class PushProperty extends MethodWrap {
  final TextEditingController idController = TextEditingController();

  final TextEditingController propertyController = TextEditingController();

  final SuggestionService suggestion = SuggestionService();

  PushProperty();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(editingController: idController, hint: 'Product ID'),
      AltogicInput(hint: 'Property', editingController: propertyController),
      ...suggestion.getWidget(
          context,
          (limit, page) => DbService.of(context).getMarketProductsNames(
              sortEntry: SortEntry('createdAt', Direction.asc),
              limit: limit,
              page: page),
          (map) => map['name'],
          setState, (id) {
        idController.text = id;
      }),
      AltogicButton(
          body: 'Get Product',
          enabled: () => idController.text.length == 24,
          listenable: idController,
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context).getProduct(idController.text);
            });
          }),
      AltogicButton(
          body: 'Get Products To Suggestion',
          onPressed: () {
            suggestion.page = 1;
            suggestion.getSuggestions(
                (limit, page) => DbService.of(context).getMarketProductsNames(
                    sortEntry: SortEntry('createdAt', Direction.asc),
                    limit: limit,
                    page: page),
                setState);
          }),
      AltogicButton(
        body: 'Push Property',
        onPressed: () {
          asyncWrapper(() async {
            var res = await DbService.of(context).pushProductProperty(
                idController.text, propertyController.text);
            if (res) {
              propertyController.clear();
            }
          });
        },
        listenable: Listenable.merge([idController, propertyController]),
        enabled: () =>
            !loading &&
            propertyController.text.isNotEmpty &&
            idController.text.length == 24,
      ),
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to push property to product. Product ID is required.\n"
            "functions use `.updateFields` method of `DBObject`"),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                "This case is used to push property to product. Product ID is required.\n"
                "functions use `.updateFields` method of `DBObject`")
          ];

  @override
  String get name => 'Push Property (updateFields/push)';
}

class PullProperty extends MethodWrap {
  final TextEditingController idController = TextEditingController();

  final TextEditingController propertyController = TextEditingController();

  final SuggestionService suggestion = SuggestionService();

  PullProperty();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(editingController: idController, hint: 'Product ID'),
      AltogicInput(hint: 'Property', editingController: propertyController),
      ...suggestion.getWidget(
          context,
          (limit, page) => DbService.of(context).getMarketProductsNames(
              sortEntry: SortEntry('createdAt', Direction.asc),
              limit: limit,
              page: page),
          (map) => map['name'],
          setState, (id) {
        idController.text = id;
      }),
      AltogicButton(
          body: 'Get Product',
          enabled: () => idController.text.length == 24,
          listenable: idController,
          onPressed: () {
            asyncWrapper(() async {
              await DbService.of(context).getProduct(idController.text);
            });
          }),
      AltogicButton(
          body: 'Get Products To Suggestion',
          onPressed: () {
            suggestion.page = 1;
            suggestion.getSuggestions(
                (limit, page) => DbService.of(context).getMarketProductsNames(
                    sortEntry: SortEntry('createdAt', Direction.asc),
                    limit: limit,
                    page: page),
                setState);
          }),
      AltogicButton(
        body: 'Pull Property',
        onPressed: () {
          asyncWrapper(() async {
            var res = await DbService.of(context).pullProductProperty(
                idController.text, propertyController.text);
            if (res) {
              propertyController.clear();
            }
          });
        },
        listenable: Listenable.merge([idController, propertyController]),
        enabled: () =>
            !loading &&
            propertyController.text.isNotEmpty &&
            idController.text.length == 24,
      ),
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "This case is used to pull property from product. Product ID is required.\n"
            "functions use `.updateFields` method of `DBObject`"),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            const AutoSpan(
                "This case is used to pull property from product. Product ID is required.\n"
                "functions use `.updateFields` method of `DBObject`")
          ];

  @override
  String get name => 'Pull Property (updateFields/pull)';
}

class GroupCategories extends MethodWrap {
  GroupCategories();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
        body: 'Group Categories',
        onPressed: () {
          asyncWrapper(() async {
            await DbService.of(context).groupCategories(true);
          });
        },
        enabled: () => !loading,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("Groups products by categories and get group counts."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) {
            return const [
              AutoSpan('Group categories function uses `.group` and `.compute` '
                  'method of ``QueryBuilder'),
              vSpace,
              DartCode("""
var res = await altogic.db
  .model('product')
  .group('category')
  .compute(GroupComputation(
    sort: Direction.desc,
    name: 'count',
    type: GroupComputationType.count,
  ));
"""),
            ];
          };

  @override
  String get name => 'Group Categories (group/compute)';
}

class GetMarketWithAvgPrice extends MethodWrap {
  GetMarketWithAvgPrice();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
        body: 'Get Market Avg Price',
        onPressed: () {
          asyncWrapper(() async {
            await DbService.of(context).getAvgPrices();
          });
        },
        enabled: () => !loading,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "Filter products by market and get average products price."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) {
            return [
              const DartCode("""
var res = await altogic.db
        .model('product')
        .group('market')
        .compute(GroupComputation(
            sort: Direction.desc,
            name: 'avg',
            type: GroupComputationType.avg,
            expression: 'price'));
"""),
            ];
          };

  @override
  String get name => 'Get Average Product Price (compute / avg)';
}

class GetMarketWithTotalStockValue extends MethodWrap {
  GetMarketWithTotalStockValue();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
        body: 'Get Market Total Stock Value',
        onPressed: () {
          asyncWrapper(() async {
            await DbService.of(context).getTotalValue();
          });
        },
        enabled: () => !loading,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            "Filter products by market and get sum of price * quantity."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) {
            return [
              const DartCode("""
var res = await altogic
    .db
    .model('product')
    .group('market')
    .compute(
        GroupComputation(
            sort: Direction.desc,
            name: 'value',
            type: GroupComputationType.sum,
            expression: 'price * amount'));
"""),
            ];
          };

  @override
  String get name => 'Get Market Total Stock Value (compute / sum)';
}

class GetMarketProductCount extends MethodWrap {
  GetMarketProductCount();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
        body: 'Get Market Product Count',
        onPressed: () {
          asyncWrapper(() async {
            await DbService.of(context).getProductCount();
          });
        },
        enabled: () => !loading,
      )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan("Filter products by market and get count."),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) {
            return [
              const DartCode("""
var res = await altogic
    .db
    .model('product')
    .group('market')
    .compute(
        GroupComputation(
            sort: Direction.desc,
            name: 'count',
            type: GroupComputationType.count));
"""),
            ];
          };

  @override
  String get name => 'Get Market Product Count (compute / count)';
}
