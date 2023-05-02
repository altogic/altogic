import 'dart:convert';
import 'package:fodcast_app/utils/constants.dart';
import 'package:http/http.dart' as http;

class HttpClient {
  static final HttpClient _instance = HttpClient._internal();
  final String apiUrl = Constants.apiUrl;

  factory HttpClient() => _instance;

  HttpClient._internal();

  Future<Map<String, dynamic>> get(String endpoint,
      {Map<String, String>? headers}) async {
    final response =
        await http.get(Uri.parse(apiUrl + endpoint), headers: headers);

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      return responseData;
    } else {
      throw Exception('Failed to load data from API.');
    }
  }

  Future<Map<String, dynamic>> post(String endpoint, dynamic body,
      {Map<String, String>? headers}) async {
    final response = await http.post(Uri.parse(apiUrl + endpoint),
        body: body, headers: headers);

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      return responseData;
    } else {
      throw Exception('Failed to load data from API.');
    }
  }

  // Add more HTTP methods here as needed

  Future<Map<String, dynamic>> put(String endpoint, dynamic body,
      {Map<String, String>? headers}) async {
    final response = await http.put(Uri.parse(apiUrl + endpoint),
        body: body, headers: headers);

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      return responseData;
    } else {
      throw Exception('Failed to load data from API.');
    }
  }

  Future<Map<String, dynamic>> delete(String endpoint,
      {Map<String, String>? headers}) async {
    final response =
        await http.delete(Uri.parse(apiUrl + endpoint), headers: headers);

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      return responseData;
    } else {
      throw Exception('Failed to load data from API.');
    }
  }

  Future<Map<String, dynamic>> patch(String endpoint, dynamic body,
      {Map<String, String>? headers}) async {
    final response = await http.patch(Uri.parse(apiUrl + endpoint),
        body: body, headers: headers);

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      return responseData;
    } else {
      throw Exception('Failed to load data from API.');
    }
  }
}
