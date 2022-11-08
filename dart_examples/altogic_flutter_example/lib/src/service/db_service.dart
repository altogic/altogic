import 'dart:convert';

import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/controller/user_controller.dart';
import 'package:altogic_flutter_example/src/models/market.dart';
import 'package:altogic_flutter_example/src/models/product.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:flutter/material.dart';

import '../../main.dart';
import '../models/contacts.dart';

class DbService extends ServiceBase {
  DbService();

  static DbService of(BuildContext context) =>
      InheritedService.of<DbService>(context);

  CurrentUserController currentUserController = CurrentUserController();

  DatabaseManager db = altogic.db;

  QueryBuilder marketModel = altogic.db.model('market');

  Future<void> createMarket(String name, String? address) async {
    if (!currentUserController.isLogged) {
      response.message(
          'Login required. You can log in via the "Authorization" page');
      return;
    }

    response.message('Market Creating...');
    var res = await marketModel.create(Market(
        id: '',
        name: name,
        marketAddress: address,
        ownerId: currentUserController.user.id,
        contacts: []).toJson());

    response.response(res);
    if (res.errors == null) {
      var market = Market.fromJson(res.data!);
      currentUserController.market = market;
      response
          .message('Setting market to current user...\n\n${response.value}');
      var settingField = await altogic.db
          .model('users')
          .object(currentUserController.user.id)
          .updateFields(FieldUpdate(
              field: 'market', updateType: UpdateType.set, value: market.id));
      if (settingField.errors == null) {
        response
            .message('Market field setting successfully\n\n${response.value}');
      } else {
        response.message('Market created successfully\n\n'
            'But setting market to current user failed\n\n'
            '${settingField.errors}\n\n'
            '${response.value}');
      }
    }
  }

  Future<Market?> getMarketWithFilter(String marketId) async {
    var res =
        await altogic.db.model('market').filter('_id == "$marketId"').get();
    response.response(res);
    if (res.errors == null) {
      return Market.fromJson((res.data! as List).first);
    } else {
      return null;
    }
  }

  Future<Market?> getMarketWithLookup(String marketId) async {
    var res = await altogic.db
        .model('market')
        .lookup(SimpleLookup('user'))
        .filter('_id == "$marketId"')
        .get();
    response.response(res);
    if (res.errors == null) {
      return Market.fromJson((res.data! as List).first);
    } else {
      return null;
    }
  }

  Future<Market?> getMarketWithObjectId(String marketId) async {
    var res = await altogic.db.model('market').object(marketId).get();
    response.response(res);
    if (res.errors == null) {
      return Market.fromJson(res.data!);
    } else {
      return null;
    }
  }

  Future<Contact?> getContact(String contactId) async {
    var res = await altogic.db.model('market.contacts').object(contactId).get();
    response.response(res);
    if (res.errors == null) {
      return Contact.fromMap(res.data!);
    } else {
      return null;
    }
  }

  Future<void> changeMarketName(String newName) async {
    var res = await altogic.db
        .model('market')
        .object(currentUserController.market.id)
        .update({
      'name': newName,
    });
    response.response(res);
    if (res.errors == null) {
      currentUserController.market = Market.fromJson(res.data!);
    }
  }

  Future<void> appendMarketContact(String name, String email) async {
    var res = await altogic.db.model('market.contacts').object().append({
      'name': name,
      'email': email,
    }, currentUserController.market.id,
        const AppendOptions(returnTop: true, cache: Cache.nocache));

    response.response(res);

    if (res.errors == null) {
      var m = await getMarketWithObjectId(currentUserController.market.id);

      currentUserController.market = m;
    }
  }

  Future<List<Map<String, dynamic>>?> getMarketContacts(
      {int limit = 10, int page = 1}) async {
    var res = await altogic.db
        .model('market')
        .filter('_id == "${currentUserController.market.id}"')
        .limit(limit)
        .page(page)
        .omit(['user', 'name', 'market_address']).get();

    response.response(res);

    if (res.errors == null) {
      var d = (res.data as List?);
      if (d != null && d.isNotEmpty) {
        return (d.first['contacts'] as List?)
            ?.map((e) => (e as Map).cast<String, dynamic>())
            .toList();
      }
    }

    return null;
  }

  Future<void> changeMarketAddress(String newAddress) async {
    var res = await altogic.db
        .model('market')
        .object(currentUserController.market.id)
        .updateFields(FieldUpdate(
            field: 'market_address',
            updateType: UpdateType.set,
            value: newAddress));
    response.response(res);
    if (res.errors == null) {
      currentUserController.market = Market.fromJson(res.data!);
    }
  }

  //unset market_address field
  Future<void> unsetMarketAddress() async {
    var res = await altogic.db
        .model('market')
        .object(currentUserController.market.id)
        .updateFields(
            FieldUpdate(field: 'market_address', updateType: UpdateType.unset));
    response.response(res);
    if (res.errors == null) {
      currentUserController.market = Market.fromJson(res.data!);
    }
  }

  // create product
  Future<bool> createProduct(String name, String description, int price,
      String category, List<String> properties, int amount) async {
    Product;
    var res = await altogic.db.model('product').create({
      'name': name,
      'description': description,
      'market': currentUserController.market.id,
      'price': price,
      'category': category,
      'properties': properties,
      'amount': 0
    });
    response.response(res);
    return res.errors == null;
  }

  Future<List<Product>?> getMarketProducts(
      {SortEntry? sortEntry, required int limit, required int page}) async {
    var res = await altogic.db
        .model('product')
        .sort(sortEntry?.field ?? 'createdAt',
            sortEntry?.direction ?? Direction.desc)
        .filter("market == \"${currentUserController.market.id}\"")
        .limit(limit)
        .page(page)
        .get();

    response.response(res);

    if (res.errors == null) {
      var products = <Product>[];
      for (var product in res.data!) {
        products.add(Product.fromMap(product));
      }
      return products;
    } else {
      return null;
    }
  }

  Future<List<Product>?> filterProducts(
      {required String expression,
      SortEntry? sortEntry,
      required int limit,
      required int page}) async {
    var res = await altogic.db
        .model('product')
        .sort(sortEntry?.field ?? 'createdAt',
            sortEntry?.direction ?? Direction.desc)
        .filter(expression)
        .limit(limit)
        .page(page)
        .get();

    response.response(res);

    if (res.errors == null) {
      var products = <Product>[];
      for (var product in res.data!) {
        products.add(Product.fromMap(product));
      }
      return products;
    } else {
      return null;
    }
  }

  Future<List<Map<String, dynamic>>?> getMarketProductsNames(
      {SortEntry? sortEntry,
      required int limit,
      required int page,
      bool withPrice = false,
      bool withAmount = false}) async {
    var res = await altogic.db
        .model('product')
        .sort(sortEntry?.field ?? 'createdAt',
            sortEntry?.direction ?? Direction.desc)
        .filter("market == \"${currentUserController.market.id}\"")
        .omit([
          'description',
          'market',
          if (!withPrice) 'price',
          if (!withAmount) 'amount',
          'category',
          'createdAt',
          'updatedAt',
          'deletedAt',
          'properties'
        ])
        .limit(limit)
        .page(page)
        .get();

    response.response(res);

    if (res.errors == null) {
      return (res.data as List).cast<Map<String, dynamic>>();
    } else {
      return null;
    }
  }

  Future<List<String>?> groupCategories(bool write) async {
    var res = await altogic.db
        .model('product')
        .group('category')
        .compute(GroupComputation(
          sort: Direction.desc,
          name: 'count',
          type: GroupComputationType.count,
        ));

    if (res.errors == null) {
      var parsed = <String>[];
      for (var item in res.data!) {
        parsed.add('${item['groupby']['group']}');
      }

      if (write) {
        response.message('Categories: ${parsed.join(', ')} \n\n'
            'Response:\n${const JsonEncoder.withIndent('    ').convert(res.data)}');
      }
      return parsed;
    } else {
      if (write) response.response(res);
      return null;
    }
  }

  Future<List<String>?> groupProperties(bool write) async {
    var res = await altogic.db
        .model('product')
        .group('properties.\$')
        .compute(GroupComputation(
          sort: Direction.desc,
          name: 'count',
          type: GroupComputationType.count,
        ));

    if (res.errors == null) {
      var parsed = <String>[];
      for (var item in res.data!) {
        parsed.add('${item['groupby']['group']}');
      }

      if (write) {
        response.message('Properties: ${parsed.join(', ')} \n\n'
            'Response:\n${const JsonEncoder.withIndent('    ').convert(res.data)}');
      }
      return parsed;
    } else {
      if (write) response.response(res);
      return null;
    }
  }

  Future<void> changeProductPrice(String productId, int newPrice) async {
    var res = await altogic.db
        .model('product')
        .filter('_id == "$productId"')
        .update({'price': newPrice});
    response.response(APIResponse(
      data: {
        'updated': res.data?.updated,
        'total': res.data?.totalMatch,
      },
      errors: res.errors,
    ));
  }

  // delete product
  Future<bool> deleteProduct(String productId) async {
    var res = await altogic.db.model('product').object(productId).delete();
    response.message(res.errors != null ? res.errors.toString() : 'Deleted');
    return res.errors == null;
  }

  // delete product
  Future<bool> deleteProductWithQuery(String productId) async {
    var res =
        await altogic.db.model('product').filter('_id == $productId').delete();
    response.message(res.errors != null ? res.errors.toString() : 'Deleted');
    return res.errors == null;
  }

  // delete product
  Future<bool> deleteContact(String contactId) async {
    var res =
        await altogic.db.model('market.contacts').object(contactId).delete();
    response.message(res.errors != null ? res.errors.toString() : 'Deleted');
    return res.errors == null;
  }

  // delete product
  Future<bool> deleteContactWithFilter(String contactId) async {
    var res = await altogic.db
        .model('market.contacts')
        .filter('_id == "$contactId"')
        .delete();
    response.message(res.errors != null ? res.errors.toString() : 'Deleted');
    return res.errors == null;
  }

  // Get product
  Future<Product?> getProduct(String productId) async {
    var res =
        await altogic.db.model('product').filter('_id == "$productId"').get();
    response.response(res);
    if (res.errors == null) {
      return Product.fromMap((res.data! as List).first);
    } else {
      return null;
    }
  }

  // Get product
  Future<void> getProductWithOmit(String productId,
      [List<String> omit = const []]) async {
    var res = await altogic.db
        .model('product')
        .filter('_id == "$productId"')
        .omit(omit)
        .get();
    response.response(res);
  }

  // increment product price
  Future<void> incrementProductAmount(String productId, int increment) async {
    var res = await altogic.db.model('product').object(productId).updateFields(
        FieldUpdate(
            field: 'amount',
            updateType: UpdateType.increment,
            value: increment));
    response.response(res);
  }

  // decrement product price
  Future<void> decrementProductAmount(String productId, int decrement) async {
    var res = await altogic.db.model('product').object(productId).updateFields(
        FieldUpdate(
            field: 'amount',
            updateType: UpdateType.decrement,
            value: decrement));
    response.response(res);
  }

  // push product property
  Future<bool> pushProductProperty(String productId, String property) async {
    var res = await altogic.db.model('product').object(productId).updateFields(
        FieldUpdate(
            field: 'properties', updateType: UpdateType.push, value: property));
    response.response(res);
    return res.errors == null;
  }

  // pull product property
  Future<bool> pullProductProperty(String productId, String property) async {
    var res = await altogic.db.model('product').object(productId).updateFields(
        FieldUpdate(
            field: 'properties', updateType: UpdateType.pull, value: property));
    response.response(res);
    return res.errors == null;
  }

  Future<void> searchProducts(String query) async {
    var res = await altogic.db
        .model('product')
        .filter("market == \"${currentUserController.market.id}\"")
        .searchText(query);
    response.response(res);
  }

  // search fuzzy products
  Future<void> searchFuzzyProducts(String field, String text) async {
    var res = await altogic.db
        .model('product')
        .filter("market == \"${currentUserController.market.id}\"")
        .searchFuzzy(field, text);
    response.response(res);
  }

  Future<void> getAvgPrices() async {
    var res = await altogic.db.model('product').group('market').compute(
        GroupComputation(
            sort: Direction.desc,
            name: 'avg',
            type: GroupComputationType.avg,
            expression: 'price'));

    response.response(res);

    return;
  }

  Future<void> getTotalValue() async {
    var res = await altogic.db.model('product').group('market').compute(
        GroupComputation(
            sort: Direction.desc,
            name: 'value',
            type: GroupComputationType.sum,
            expression: 'price * amount'));

    response.response(res);

    return;
  }

  Future<void> getProductCount() async {
    var res = await altogic.db.model('product').group('market').compute(
        GroupComputation(
            sort: Direction.desc,
            name: 'count',
            type: GroupComputationType.count));

    response.response(res);

    return;
  }
}
