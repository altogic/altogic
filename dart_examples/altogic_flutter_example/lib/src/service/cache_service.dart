import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/main.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:flutter/material.dart';

class CacheService extends ServiceBase {
  static CacheService of(BuildContext context) =>
      InheritedService.of<CacheService>(context);

  Future<void> setCache(String key, dynamic value, int? ttl) async {
    response.loading();
    var res = await altogic.cache.set(key, value,ttl);
    response.error(res);
  }

  Future<void> getCache(String key) async {
    response.loading();
    var res = await altogic.cache.get(key).asInt();
    response.response(res);
  }

  Future<void> deleteCache(String key) async {
    response.loading();
    var res = await altogic.cache.delete(key);
    response.error(res);
  }

  Future<void> increment(String key, int amount) async {
    response.loading();
    var res = await altogic.cache.increment(key, increment: amount);
    response.response(res);
  }

  Future<void> decrement(String key, int amount) async {
    response.loading();
    var res = await altogic.cache.decrement(key, decrement: amount);
    response.response(res);
  }

  Future<void> expire(String key, int ttl) async {
    response.loading();
    var res = await altogic.cache.expire(key, ttl);
    response.error(res);
  }

  Future<void> getStats() async {
    response.loading();
    var res = await altogic.cache.getStats();
    response.response(res);
  }

  Future<void> listKeys(String? expression, String? next) async {
    response.loading();
    var res = await altogic.cache.listKeys(expression, next);
    response.response(APIResponse(
        data: {'data': res.data, 'next': res.next}, errors: res.errors));
  }
}
