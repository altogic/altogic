import 'dart:convert';

import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/service/storage_service.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/texts.dart';
import 'package:flutter/material.dart';

import 'bucket_cases.dart';

class BucketManagerPage extends StatefulWidget {
  const BucketManagerPage({Key? key, required this.bucket}) : super(key: key);

  final String bucket;

  @override
  State<BucketManagerPage> createState() => _BucketManagerPageState();
}

class _BucketManagerPageState extends State<BucketManagerPage> {
  late BucketService bucketService = BucketService(bucket: widget.bucket);

  @override
  void initState() {
    bucketService.bucketInfo.addListener(_listener);
    bucketService.getBucketInfo(false, false);
    super.initState();
  }

  @override
  void dispose() {
    bucketService.bucketInfo.removeListener(_listener);
    super.dispose();
  }

  _listener() {
    setState(() {});
  }

  Map<String, dynamic>? get bucket => bucketService.bucketInfo.value;

  @override
  Widget build(BuildContext context) {
    var list = [
      GetBucketExists.new,
      GetBucketInfo.new,
      EmptyBucket.new,
      RenameBucket.new,
      DeleteBucket.new,
      MakePublicBucket.new,
      MakePrivateBucket.new,
      ListFilesBucket.new,
      UploadFileFromBucket.new,
      DeleteFilesMethod.new,
      if (bucket != null) ...[
        AddTagsBucketManager.new,
        RemoveTagsBucketManager.new,
        UpdateInfoBucketManager.new,
      ],
      CreateFileManager.new
    ];

    ListView.builder(
        padding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 30,
        ),
        itemCount: list.length + 1,
        itemBuilder: (c, i) {
          if (i == 0) {
            Documentation(children: [
              const Header("Bucket Manager"),
              AutoSpan("Bucket : ${widget.bucket}"),
              vSpace,
              if (bucket != null)
                Description(
                    'Bucket Info : \n${const JsonEncoder.withIndent('   ').convert(bucket)}')
              else
                const AutoSpan('There is no bucket with this name or ID'),
              vSpace,
            ]);
          }
          return MethodWidget(
            create: list[i - 1],
            response: bucketService.response,
          );
        });

    return InheritedService(
      service: bucketService,
      child: BaseViewer(
        leading: IconButton(
            onPressed: () {
              Navigator.of(context).pushNamed('/storage');
            },
            icon: const Icon(Icons.arrow_back_rounded)),
        body: ListView.builder(
            padding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 30,
            ),
            itemCount: list.length + 1,
            itemBuilder: (c, i) {
              if (i == 0) {
                return Documentation(children: [
                  const Header("Bucket Manager"),
                  AutoSpan("Bucket : ${widget.bucket}"),
                  vSpace,
                  if (bucket != null)
                    Description(
                        'Bucket Info : \n${const JsonEncoder.withIndent('   ').convert(bucket)}')
                  else
                    const AutoSpan('There is no bucket with this name or ID'),
                  vSpace,
                ]);
              }
              return MethodWidget(
                create: list[i - 1],
                response: bucketService.response,
              );
            }),
      ),
    );
  }
}
