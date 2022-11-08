import 'dart:async';
import 'dart:io';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:path_provider/path_provider.dart';

Uint8List getUintList(PlatformFile file) {
  return File(file.path!).readAsBytesSync();
}

void download(String name, Uint8List data) async {
  // var body = await HttpClient().getUrl(Uri.parse(uri));
  // var response = await body.close();
  // var bytes = await consolidateHttpClientResponseBytes(response);
  var path = await getApplicationDocumentsDirectory();
  var file = File("${path.path}/$name");
  await file.writeAsBytes(data);
}

Future<Uint8List> consolidateHttpClientResponseBytes(
    HttpClientResponse response) {
  final List<List<int>> chunks = <List<int>>[];
  final Completer<Uint8List> completer = Completer<Uint8List>();
  response.listen(
    (List<int> chunk) {
      chunks.add(chunk);
    },
    onDone: () {
      completer.complete(Uint8List.fromList(
        chunks.expand<int>((List<int> c) => c).toList(),
      ));
    },
    onError: completer.completeError,
    cancelOnError: true,
  );
  return completer.future;
}
