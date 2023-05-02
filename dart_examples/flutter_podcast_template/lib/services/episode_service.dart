import 'dart:math';

import 'package:altogic/altogic.dart';
import 'package:fodcast_app/models/episode.dart';
import 'package:fodcast_app/services/podcast_service.dart';
import 'package:fodcast_app/services/user_service.dart';
import 'package:fodcast_app/utils/altogic_service.dart';

import '../models/podcast.dart';

class EpisodeService {
  static final EpisodeService _instance = EpisodeService._internal();

  factory EpisodeService() => _instance;

  EpisodeService._internal();

  final Map<String, Episode> _episodes = {};

  Future<List<Episode>> getEpisodesForPodcast(String podcastId,
      [int? limit]) async {
    final filter = altogic.db
        .model("episode")
        .filter('podcastId == "$podcastId"')
        .sort("pubDate", Direction.desc);

    if (limit != null) {
      filter.limit(limit);
    }

    final response = await filter.get();

    if (response.errors != null) {
      throw Exception('Failed to load episodes for podcast.');
    } else {
      final List<Episode> episodes = List<Episode>.from(
          response.data.map((episode) => Episode.fromJson(episode)));

      await Future.wait(episodes.map((e) => e.cache()));

      for (final episode in episodes) {
        _episodes[episode.id] = episode;
      }

      return episodes;
    }
  }

  // Get recommendations
  Future<List<Episode>> getRecommendedEpisodes() async {
    final userInterests = UserService().interests;

    // convert totals to rates
    final rates = {};
    int total = 0;
    for (final interest in userInterests.keys) {
      total += userInterests[interest]!;
    }

    for (final interest in userInterests.keys) {
      rates[interest] = userInterests[interest]! / total;
    }

    // select random 5 interest with probability mess
    final random = Random();
    final selectedInterests = <String>{};

    while (selectedInterests.length < 5 &&
        selectedInterests.length < rates.length) {
      final interest = rates.keys.elementAt(random.nextInt(rates.length));
      if (random.nextDouble() < rates[interest]!) {
        selectedInterests.add(interest);
      }
    }

    var filter = [];

    for (var f in selectedInterests) {
      filter.add('IN(tags, "$f")');
    }

    // get podcasts
    final response = await altogic.db
        .model("podcast")
        .filter(filter.join(" || "))
        .getRandom(10);

    if (response.errors != null) {
      throw Exception('Failed to load episodes for podcast.');
    }

    final podcasts = List<Podcast>.from(
        response.data!.map((podcast) => Podcast.fromJson(podcast)));

    await Future.wait(podcasts.map((e) => e.loadAuthor()));

    PodcastService().savePodcasts(podcasts);

    // get episodes
    final episodes = <Episode>[];

    for (final podcast in podcasts) {
      final podcastEpisodes = await getEpisodesForPodcast(podcast.id, 1);
      episodes.addAll(podcastEpisodes);
    }

    return episodes;
  }

// Get new episodes
  Future<List<Episode>> getNewEpisodes() async {
    final response = await altogic.db
        .model("episode")
        .limit(10)
        .sort("pubDate", Direction.desc)
        .get();

    if (response.errors != null) {
      throw Exception('Failed to load episodes for podcast.');
    } else {
      final List<Episode> episodes = List<Episode>.from(
          response.data.map((episode) => Episode.fromJson(episode)));

      await Future.wait(episodes.map((e) => e.cache()));

      for (final episode in episodes) {
        _episodes[episode.id] = episode;
      }

      return episodes;
    }
  }

  Future<Episode> getEpisode(String id) async {
    if (_episodes.containsKey(id)) {
      return _episodes[id]!;
    } else {
      final response = await altogic.db.model("episode").object(id).get();

      if (response.errors != null) {
        throw Exception('Failed to load episode.');
      } else {
        final episode = Episode.fromJson(response.data!);
        await episode.cache();
        _episodes[episode.id] = episode;
        return episode;
      }
    }
  }

  Future<List<Episode>> getTrendingEpisodes() async {
    final response = await altogic.db
        .model("progressEpisode")
        .filter(
            "DATEMILLIS(updatedAt) > ${DateTime.now().subtract(const Duration(days: 7)).microsecondsSinceEpoch}")
        .group("episode_id")
        .compute(GroupComputation(
            name: "count",
            type: GroupComputationType.count,
            sort: Direction.desc));

    if (response.errors != null) {
      throw Exception('Failed to load episodes for podcast.');
    } else {
      final List<Future<Episode>> episodes = List<Future<Episode>>.from(
          response.data.map((episode) =>
              EpisodeService().getEpisode(episode["groupby"]['group'])));
      return await Future.wait(episodes);
    }
  }
}
