import 'dart:typed_data';

import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/view/pages/storage/utils/upload.dart'
    if (dart.library.html) 'package:altogic_flutter_example/src/view/pages/storage/utils/web_upload.dart'
    if (dart.library.io) 'package:altogic_flutter_example/src/view/pages/storage/utils/io_upload.dart'
    show download;
import 'package:flutter/material.dart';

import '../../main.dart';

class FileManagerService extends ServiceBase {
  FileManagerService(this.bucket, this.fileNameOrId);

  static FileManagerService of(BuildContext context) =>
      InheritedService.of<FileManagerService>(context);
  ValueNotifier<Map<String, dynamic>?> fileInfo =
      ValueNotifier<Map<String, dynamic>?>(null);
  String fileNameOrId;
  final String bucket;

  FileManager get file => altogic.storage.bucket(bucket).file(fileNameOrId);

  Future<void> exists() async {
    response.loading();
    var res = await file.exists();
    response.response(res);
  }

  Future<Map<String, dynamic>?> getInfo(bool printResult) async {
    if (printResult) response.loading();
    var res = await file.getInfo();
    if (printResult) response.response(res);
    if (res.data != null) {
      fileInfo.value = res.data;
    }
    return res.data;
  }

  Future<void> makePublic() async {
    response.loading();
    var res = await file.makePublic();
    response.response(res);
  }

  Future<void> makePrivate() async {
    response.loading();
    var res = await file.makePrivate();
    response.response(res);
  }

  Future<Uint8List?> downloadFile() {
    response.loading();
    return file.download().then((value) async {
      var info = await getInfo(false);
      response.message('Downloaded : ${value.data?.length} bytes ');
      download(info!['fileName'], value.data!);
    }).catchError((e) {
      response.message('Error: $e');
    });
  }

  Future<void> rename(String newName) async {
    response.loading();
    var res = await file.rename(newName);
    response.response(res);
    fileNameOrId = newName;
    fileInfo.value = res.data;
  }

  Future<void> duplicate(String newName) async {
    response.loading();
    var res = await file.duplicate(newName);
    response.response(res);
  }

  Future<void> delete() async {
    response.loading();
    var errors = await file.delete();
    response.error(errors);
    if (errors == null) fileInfo.value = null;
  }

  Future<void> replace(Uint8List data, void Function(int, int, double) onLoad,
      String contentType) async {
    response.loading();
    var res = await file.replace(
        data, FileUploadOptions(contentType: contentType, onProgress: onLoad));
    response.response(res);
  }

  Future<void> moveTo(String bucketNameOrId) async {
    response.loading();
    var res = await file.moveTo(bucketNameOrId);
    response.response(res);
  }

  Future<void> copyTo(String bucketNameOrId) async {
    response.loading();
    var res = await file.copyTo(bucketNameOrId);
    response.response(res);
  }

  Future<void> addTags(List<String> tags) async {
    response.loading();
    var res = await file.addTags(tags);
    response.response(res);

    fileInfo.value = res.data;
  }

  Future<void> removeTags(List<String> tags) async {
    response.loading();
    var res = await file.removeTags(tags);
    fileInfo.value = res.data;
    response.response(res);
  }

  Future<void> updateInfo(
      {String? newName,
      required bool isPublic,
      required List<String> tags}) async {
    response.loading();
    var res =
        await file.updateInfo(newName: newName, isPublic: isPublic, tags: tags);
    response.response(res);
    fileNameOrId = newName ?? fileNameOrId;
    fileInfo.value = res.data;
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
}
