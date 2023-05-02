import 'package:fodcast_app/utils/constants.dart';

class ApiRoutes {
  static const String _baseUrl = Constants.apiUrl;

  // User routes
  static const String login = '$_baseUrl/login';
  static const String signup = '$_baseUrl/signup';
  static const String currentUser = '$_baseUrl/user';
  static const String updateUser = '$_baseUrl/user';
  static const String subscribedPodcasts = '$_baseUrl/user/podcasts';
  static const String episodeHistory = '$_baseUrl/user/episodes';
  static const String markEpisodeAsListened =
      '$_baseUrl/user/episodes/:id/listened';
  static const String removeEpisodeFromHistory =
      '$_baseUrl/user/episodes/:id/listened';
  static const String markEpisodeAsFavorite =
      '$_baseUrl/user/episodes/:id/favorite';
  static const String removeEpisodeFromFavorites =
      '$_baseUrl/user/episodes/:id/favorite';
  static const String favoriteEpisodes = '$_baseUrl/user/episodes/favorites';
  static const String recommendedPodcasts = '$_baseUrl/user/recommended';
  static const String episodes = '$_baseUrl/user/episodes/:id/';

  // Podcast routes
  static const String allPodcasts = '$_baseUrl/podcasts';
  static String podcast(String podcastId) => '$_baseUrl/podcasts/$podcastId';
  static String podcastEpisodes(String podcastId) =>
      '$_baseUrl/podcasts/$podcastId/episodes';

  // Episode routes

  static episodesRoute(String podcastId) => '/podcasts/$podcastId/episodes';

  // Trending routes
  static const String trendingPodcasts = '$_baseUrl/podcasts/trending';

  static const String subscriptions = '$_baseUrl/user/podcasts';

  static const String history = '/user/episodes';

  static const String favorites = '$_baseUrl/user/episodes/favorites';

  static const String newEpisodes = '$_baseUrl/user/episodes/new';

  static String recommendedEpisodes = '/recommendedEpisodes/';

  // Search routes

  // Subscription routes

  // Episode routes

  // Category routes

  // Genre routes
}
