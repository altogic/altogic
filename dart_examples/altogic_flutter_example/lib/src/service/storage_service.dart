import 'dart:typed_data';

import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/main.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:flutter/material.dart';

class StorageService extends ServiceBase {
  StorageService();

  static StorageService of(BuildContext context) =>
      InheritedService.of<StorageService>(context);

  Future<void> createBucket(
      String name, List<String> tags, bool isPublic) async {
    response.loading();
    final res = await altogic.storage
        .createBucket(name, isPublic: isPublic, tags: tags);
    response.response(res);
  }

  Future<dynamic> listBucket(
      {required int limit,
      required int page,
      required bool returnCountInfo,
      required BucketSortField sort,
      required bool asc,
      String? expression}) async {
    response.loading();
    final res = await altogic.storage.listBuckets(
        expression: expression,
        options: BucketListOptions(
            limit: limit,
            page: page,
            returnCountInfo: returnCountInfo,
            sort: BucketSortEntry(
                direction: asc ? Direction.asc : Direction.desc, field: sort)));
    response.response(res);
    return res.data;
  }

  Future<void> getStats() async {
    response.loading();
    final res = await altogic.storage.getStats();
    response.response(res);
  }

  Future<void> searchFilesStorage(
      {required int limit,
      required int page,
      required bool returnCountInfo,
      required FileSortField sort,
      required bool asc,
      required String expression}) async {
    response.loading();

    final res = await altogic.storage.searchFiles(
        expression,
        FileListOptions(
            limit: limit,
            page: page,
            returnCountInfo: returnCountInfo,
            sort: FileSort(
                field: sort, direction: asc ? Direction.asc : Direction.desc)));
    response.response(res);
  }

  Future<void> deleteFile(String url) async {
    response.loading();
    final res = await altogic.storage.deleteFile(url);
    response.error(res);
  }
}

class BucketService extends ServiceBase {
  BucketService({required this.bucket});

  static BucketService of(BuildContext context) =>
      InheritedService.of<BucketService>(context);

  String bucket;

  ValueNotifier<Map<String, dynamic>?> bucketInfo =
      ValueNotifier<Map<String, dynamic>?>(null);

  Future<void> getBucketInfo(bool detailed, bool printResponse) async {
    if (printResponse) response.loading();
    var res = await altogic.storage.bucket(bucket).getInfo(detailed);
    if (res.data != null) {
      bucketInfo.value = res.data;
    }
    if (printResponse) {
      response.response(res);
    }
  }

  Future<void> getBucketExists() async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).exists();
    response.response(res);
  }

  Future<void> emptyBucket() async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).empty();
    response.error(res);
  }

  Future<void> renameBucket(String newName) async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).rename(newName);
    bucket = newName;
    response.response(res);
    bucketInfo.value = res.data;
  }

  Future<void> deleteBucket() async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).delete();
    response.error(res);
  }

  Future<void> makePublic(bool includeFiles) async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).makePublic(includeFiles);
    response.response(res);    bucketInfo.value = res.data;
  }

  Future<void> makePrivate(bool includeFiles) async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).makePrivate(includeFiles);
    response.response(res);
    bucketInfo.value = res.data;
  }

  Future<dynamic> listFiles(
      {required int limit,
      required int page,
      required bool returnCountInfo,
      required FileSortField sort,
      required bool asc,
      required String expression}) async {
    response.loading();

    final res = await altogic.storage.bucket(bucket).listFiles(
        expression: expression,
        options: FileListOptions(
            limit: limit,
            page: page,
            returnCountInfo: returnCountInfo,
            sort: FileSort(
                field: sort, direction: asc ? Direction.asc : Direction.desc)));
    response.response(res);
    return res.data;
  }

  Future<void> uploadFile(String name, Uint8List bytes,
      void Function(int, int, double) onProgress, String contentType) async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).upload(name, bytes,
        FileUploadOptions(onProgress: onProgress, contentType: contentType));
    response.response(res);
  }

  Future<void> deleteFiles(List<String> files) async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).deleteFiles(files);
    response.error(res);
  }

  Future<void> addTags(List<String> tags) async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).addTags(tags);
    response.response(res);
    bucketInfo.value = res.data;
  }

  Future<void> removeTags(List<String> tags) async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).removeTags(tags);
    response.response(res);
    bucketInfo.value = res.data;
  }

  Future<void> updateInfo(
      {required bool isPublic,
      required bool includeFiles,
      String? newName,
      required List<String> tags}) async {
    response.loading();
    var res = await altogic.storage.bucket(bucket).updateInfo(
        isPublic: isPublic,
        includeFiles: includeFiles,
        newName: newName,
        tags: tags);
    response.response(res);
    bucket = newName ?? bucket;
    bucketInfo.value = res.data;
  }
}
