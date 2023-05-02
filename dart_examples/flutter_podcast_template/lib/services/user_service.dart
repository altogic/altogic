import 'package:altogic/altogic.dart';
import 'package:fodcast_app/services/auth_service.dart';
import 'package:fodcast_app/utils/altogic_service.dart';

class UserService {
  static final UserService _instance = UserService._internal();

  factory UserService() => _instance;

  UserService._internal();

  final Map<String, int> interests = {};

  addUserInterest(String tag) async {
    if (interests[tag] == null) {
      interests[tag] = 1;
      await altogic.db
          .model("userInterest")
          .create({'user_id': AuthService().user.id, 'tag': tag, "count": 1});
    } else {
      interests[tag] = interests[tag]! + 1;
      await altogic.db
          .model("userInterest")
          .filter('user_id == "${AuthService().user.id}" && tag == "$tag"')
          .updateFields(FieldUpdate(
              field: "count", updateType: UpdateType.increment, value: 1));
    }
  }

  Future<void> getUserInterests() async {
    final resp = await altogic.db
        .model("userInterest")
        .filter('user_id == "${AuthService().user.id}"')
        .get();

    if (resp.errors == null) {
      for (final interest in resp.data) {
        interests[interest['tag']] = interest['count'];
      }
    }
  }

/*Future<User> login(String email, String password) async {
    final response = await http.post(Uri.parse(apiUrl + loginEndpoint),
        body: {'email': email, 'password': password});

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final User user = User.fromJson(responseData);
      return user;
    } else {
      throw Exception('Failed to login user.');
    }
  }

  Future<User> signup(String name, String email, String password) async {
    final response = await http.post(Uri.parse(apiUrl + signupEndpoint),
        body: {'name': name, 'email': email, 'password': password});

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final User user = User.fromJson(responseData);
      return user;
    } else {
      throw Exception('Failed to signup user.');
    }
  }*/

/*Future<User> getCurrentUser() async {
    final response = await http.get(Uri.parse(apiUrl + currentUserEndpoint));

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final User user = User.fromJson(responseData);
      return user;
    } else {
      throw Exception('Failed to load current user.');
    }
  }*/

/*  Future<APIError?> updateUser({required String displayName,required String bio}) async {
    throw UnimplementedError('Not implemented');
  }*/

/*Future<List<String>> getSubscribedPodcasts() async {
    final response =
        await http.get(Uri.parse(apiUrl + subscribedPodcastsEndpoint));

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final List<String> podcastIds = List<String>.from(responseData);
      return podcastIds;
    } else {
      throw Exception('Failed to load subscribed podcasts.');
    }
  }

  Future<List<Map<String, dynamic>>> getEpisodeHistory() async {
    final response = await http.get(Uri.parse(apiUrl + episodeHistoryEndpoint));
    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final List<Map<String, dynamic>> episodeData =
          List<Map<String, dynamic>>.from(responseData);
      return episodeData;
    } else {
      throw Exception('Failed to load episode history.');
    }
  }

  Future<bool> markEpisodeAsListened(String episodeId) async {
    final response = await http.post(Uri.parse(
        apiUrl + markEpisodeAsListenedEndpoint.replaceAll(':id', episodeId)));
    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final bool success = responseData['success'];
      return success;
    } else {
      throw Exception('Failed to mark episode as listened.');
    }
  }

  Future<bool> removeEpisodeFromHistory(String episodeId) async {
    final response = await http.delete(Uri.parse(apiUrl +
        removeEpisodeFromHistoryEndpoint.replaceAll(':id', episodeId)));
    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final bool success = responseData['success'];
      return success;
    } else {
      throw Exception('Failed to remove episode from history.');
    }
  }

  Future<bool> markEpisodeAsFavorite(String episodeId) async {
    final response = await http.post(Uri.parse(
        apiUrl + markEpisodeAsFavoriteEndpoint.replaceAll(':id', episodeId)));

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final bool success = responseData['success'];
      return success;
    } else {
      throw Exception('Failed to mark episode as favorite.');
    }
  }

  Future<bool> removeEpisodeFromFavorites(String episodeId) async {
    final response = await http.delete(Uri.parse(apiUrl +
        removeEpisodeFromFavoritesEndpoint.replaceAll(':id', episodeId)));

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final bool success = responseData['success'];
      return success;
    } else {
      throw Exception('Failed to remove episode from favorites.');
    }
  }

  Future<List<Map<String, dynamic>>> getFavoriteEpisodes() async {
    final response =
        await http.get(Uri.parse(apiUrl + favoriteEpisodesEndpoint));

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final List<Map<String, dynamic>> episodeData =
          List<Map<String, dynamic>>.from(responseData);
      return episodeData;
    } else {
      throw Exception('Failed to load favorite episodes.');
    }
  }

  Future<List<String>> getRecommendedPodcasts() async {
    final response =
        await http.get(Uri.parse(apiUrl + recommendedPodcastsEndpoint));

    if (response.statusCode == 200) {
      final responseData = json.decode(response.body);
      final List<String> podcastIds = List<String>.from(responseData);
      return podcastIds;
    } else {
      throw Exception('Failed to load recommended podcasts.');
    }
  }*/
}
