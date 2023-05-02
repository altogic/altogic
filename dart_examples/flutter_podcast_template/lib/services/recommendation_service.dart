import 'package:fodcast_app/models/podcast.dart';
import 'package:fodcast_app/utils/api_routes.dart';
import 'package:fodcast_app/utils/auth_token.dart';
import 'package:fodcast_app/utils/constants.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class RecommendationService {
  static final RecommendationService _instance =
      RecommendationService._internal();
  final String apiUrl = Constants.apiUrl;
  final String recommendedPodcastsEndpoint = ApiRoutes.recommendedPodcasts;

  factory RecommendationService() => _instance;

  RecommendationService._internal();

  Future<List<Podcast>> getRecommendedPodcasts() async {
    final authToken = await AuthToken().getToken();
    final headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $authToken',
    };

    final response = await http
        .get(Uri.parse(apiUrl + recommendedPodcastsEndpoint), headers: headers);

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final List<Podcast> podcasts = List<Podcast>.from(
          responseData.map((podcast) => Podcast.fromJson(podcast)));
      return podcasts;
    } else {
      throw Exception('Failed to load recommended podcasts.');
    }
  }
}
