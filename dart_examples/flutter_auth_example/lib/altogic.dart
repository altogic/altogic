import 'package:altogic/altogic.dart';

const String envUrl = 'https://c4-na.altogic.com/e:63627456fe0ce760f2900095';
const String clientKey = '5b05db9ed41044049441b00885c262e8';
const String clientKeyy = String.fromEnvironment("name");

final altogic = createClient(envUrl, clientKey);
