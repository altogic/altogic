import 'dart:convert';

import 'package:altogic_flutter_example/src/service/db_service.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../../controller/user_controller.dart';
import '../../widgets/base_viewer.dart';
import '../../widgets/case.dart';
import '../../widgets/documentation/base.dart';
import '../../widgets/documentation/code.dart';
import '../../widgets/documentation/texts.dart';
import 'cases.dart';

class DatabasePage extends StatefulWidget {
  const DatabasePage({Key? key}) : super(key: key);

  @override
  State<DatabasePage> createState() => _DatabasePageState();
}

class _DatabasePageState extends State<DatabasePage> {
  DbService dbService = DbService();
  CurrentUserController currentUserController = CurrentUserController();

  @override
  void initState() {
    currentUserController.addListener(_listener);
    super.initState();
  }

  @override
  void dispose() {
    currentUserController.removeListener(_listener);
    super.dispose();
  }

  void _listener() {
    setState(() {});
  }

  List<Widget> list(BuildContext ctx) {
    return [
      const Documentation(children: [
        Header("Database Manager"),
        vSpace,
        AutoSpan("This page is used to show database operations"),
      ]),
      const SizedBox(
        height: 40,
      ),
      const AutoSpan(
              "This page is used to show database operations with a simple "
              "scenario. The scenario is ... (will be added) ")
          .doc(ctx),
      Container(
        width: double.infinity,
        alignment: Alignment.centerLeft,
        child: SizedBox(
          width: 600,
          child: Image.network(
              'https://c1-na.altogic.com/_storage/62d3ea1510b444043a4f80b7/62d3ea1510b444043a4f80b7/63626f16043d31db9ee6af50'),
        ),
      ),
      vSpace.doc(ctx),
      if (!currentUserController.hasMarket) ...[
        const AutoSpan("You have to create a market first.").doc(ctx),
        vSpace.doc(ctx),
        const AutoSpan("You can create a market with the following form:")
            .doc(ctx),
        vSpace.doc(ctx),
        MethodWidget(
          create: CreateMarketCase.new,
          response: DbService.of(ctx).response,
        )
      ],
      if (currentUserController.hasMarket) ...[
        Documentation(children: [
          const AutoSpan("Now, you have a market!"),
          vSpace,
          AutoSpan("Market:\n${const JsonEncoder.withIndent('    '
              '').convert(currentUserController.market.toJson())}"),
          vSpace,
          const Header('Model', level: 2),
          vSpace,
          const AutoSpan(
              "In order to perform database operations, we first need to know which model we will operate on : \n\n"),
          const DartCode("""
altogic.db.model('model_name');
"""),
          vSpace,
          const AutoSpan(
              "In this example, we will use the model named 'market'."),
          vSpace,
          const AutoSpan(
              '`.model` expression returns a `QueryBuilder` object which you can'
              ' do all operations on it.'),
          vSpace,
          const AutoSpan("You can use the following operations on the"
              " `QueryBuilder` and `DbObject`:"),
          vSpace,
        ]),
      ],
    ];
  }

  @override
  Widget build(BuildContext context) {
    final widgets = [
      GetMarketWithObjectId.new, // object.get
      GetMarketWithFilter.new, // query.filter
      GetMarketWithLookup.new, // query.lookup
      ChangeMarketName.new, // object.update
      GetContact.new, // object.get for sub
      AddMarketContact.new, // append
      DeleteContact.new, // object.delete for sub
      DeleteContactWithFilter.new, // query.filter.delete sub
      ChangeMarketAddress.new, // object.update // set
      UnsetMarketAddress.new, // query.filter.update // unset
      CreateProduct.new, // create
      GetMarketProducts.new, // query.filter // page // limit
      FilterAllProducts.new,
      OmitProduct.new,
      ChangePrice.new, // query.filter.update
      DeleteProduct.new, // object.delete
      DeleteProductWithQueryBuilder.new, // query.delete
      IncrementDecrement.new, // (amount) // object.updateFields // inc // dec
      PushProperty.new, // query.filter.updateFields // push
      PullProperty.new, // object.updateFields // pull
      SearchProducts.new, // search
      SearchFuzzyProducts.new, // search fuzzy
      GroupCategories.new, // filter / group / compute / count
      GetMarketWithAvgPrice.new, // filter / compute / avg
      GetMarketWithTotalStockValue.new,
      GetMarketProductCount.new // filter / compute / count
    ];

    return InheritedService(
      service: dbService,
      child: BaseViewer(body: Builder(builder: (ctx) {
        var li = list(ctx);
        return ListView.builder(
          padding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 30,
          ),
          itemCount: li.length + (currentUser.hasMarket ? widgets.length : 0),
          itemBuilder: (context, index) {
            if (index < li.length) {
              return li[index];
            }
            return MethodWidget(
                create: widgets[index - li.length],
                response: dbService.response);
          },
        );
      })),
    );
  }
}
