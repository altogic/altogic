import 'package:fodcast_app/models/podcast.dart';
import 'package:fodcast_app/services/auth_service.dart';
import 'package:fodcast_app/utils/altogic_service.dart';

class PodcastService {
  static final PodcastService _instance = PodcastService._internal();

  factory PodcastService() => _instance;

  PodcastService._internal();

  List<String> subscribedPodcasts = [];

  final Map<String, Podcast> _podcasts = {};

  Future<void> loadSubscribed() async {
    int i = 1;
    while (true) {
      final response = await altogic.db
          .model("userPodcast")
          .filter('user_id == "${AuthService().user.id}"')
          .limit(100)
          .page(i)
          .get();

      if (response.errors != null) {
        throw Exception('Failed to load subscribed podcasts.');
      } else {
        final List<String> podcasts = (response.data as List)
            .map<String>((e) => e['podcast_id'])
            .toList();
        subscribedPodcasts.addAll(podcasts);
        if (podcasts.length < 100) {
          break;
        }
      }
      i++;
    }
  }

  Future<List<Podcast>> getAllPodcasts() async {
    return [];
  }

  Future<Podcast> getPodcast(String podcastId) async {
    if (_podcasts.containsKey(podcastId)) {
      return _podcasts[podcastId]!;
    }
    final response = await altogic.db.model("podcast").object(podcastId).get();
    if (response.errors != null) {
      throw Exception('Failed to load podcast.');
    } else {
      final Podcast podcast = Podcast.fromJson(response.data!);
      await podcast.loadAuthor();
      _podcasts[podcastId] = podcast;
      return podcast;
    }
  }

  Future<List<Podcast>> getTrendingPodcasts() async {
    return [];
  }

// Get subscriptions
  Future<List<Podcast>> getSubscriptions() async {
    final list = <Future<Podcast>>[];

    for (final podcastId in subscribedPodcasts) {
      list.add(getPodcast(podcastId));
    }

    return Future.wait(list);
  }

  void subscribe(Podcast podcast) async {
    if (subscribedPodcasts.contains(podcast.id)) {
      // Unsubscribe
      subscribedPodcasts.remove(podcast.id);
      await altogic.db
          .model("userPodcast")
          .filter(
              'user_id == ${AuthService().user.id} && podcast_id == "${podcast.id}"')
          .delete();
    } else {
      // Subscribe
      subscribedPodcasts.add(podcast.id);
      await altogic.db.model("userPodcast").create({
        "user_id": AuthService().user.id,
        "podcast_id": podcast.id,
      });
    }
  }

  void savePodcasts(List<Podcast> podcasts) {
    for (final podcast in podcasts) {
      _podcasts[podcast.id] = podcast;
    }
  }
}
