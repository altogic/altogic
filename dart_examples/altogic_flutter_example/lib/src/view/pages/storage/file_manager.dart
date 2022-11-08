import 'dart:convert';

import 'package:altogic_flutter_example/src/service/file_manager.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/view/pages/storage/file_cases.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:flutter/material.dart';

import '../../widgets/documentation/base.dart';
import '../../widgets/documentation/texts.dart';

class FileManagerPage extends StatefulWidget {
  const FileManagerPage({Key? key, required this.file, required this.bucket})
      : super(key: key);

  final String bucket;
  final String file;

  @override
  State<FileManagerPage> createState() => _FileManagerPageState();
}

class _FileManagerPageState extends State<FileManagerPage> {
  late final service = FileManagerService(widget.bucket, widget.file);

  Map<String, dynamic>? get file => service.fileInfo.value;

  @override
  void initState() {
    service.fileInfo.addListener(_listener);
    service.getInfo(false);
    super.initState();
  }

  @override
  void dispose() {
    service.fileInfo.removeListener(_listener);
    super.dispose();
  }

  _listener() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    var list = [
      FileExistsCase.new,
      GetFileInfoMethod.new,
      MakeFilePublic.new,
      MakeFilePrivate.new,
      DownloadFileCase.new,
      if (file != null) ...[
        RenameFileCase.new,
        DuplicateFileCase.new,
      ],
      DeleteFileMethod.new,
      ReplaceFileMethod.new,
      MoveToBucketFileMethod.new,
      CopyToBucketFileMethod.new,
      if (file != null) ...[
        AddTagsFileManager.new,
        RemoveTagsFileManager.new,
        UpdateInfoFileManager.new
      ],
    ];

    return InheritedService(
      service: service,
      child: BaseViewer(
        leading: IconButton(
            onPressed: () {
              Navigator.of(context).pushNamed('/bucket/${widget.bucket}');
            },
            icon: const Icon(Icons.arrow_back_rounded)),
        leadingHome: false,
        body: ListView.builder(
          itemBuilder: (c, i) {
            if (i == 0) {
              return Documentation(children: [
                const Header("File Manager"),
                vSpace,
                const AutoSpan("This page is used to manage file."),
                vSpace,
                if (file != null)
                  Description(
                      "File: ${const JsonEncoder.withIndent('   ').convert(file)}")
                else
                  const AutoSpan("Loading file..."),
                vSpace
              ]);
            }
            return MethodWidget(
              create: list[i - 1],
              response: service.response,
            );
          },
          itemCount: list.length + 1,
          padding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 30,
          ),
        ),
      ),
    );
  }
}
