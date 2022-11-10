import 'package:altogic/altogic.dart';

const String envUrl = String.fromEnvironment("ALTOGIC_ENV_URL");
const String clientKey = String.fromEnvironment("ALTOGIC_CLIENT_KEY");

final altogic = createClient(envUrl, clientKey);
