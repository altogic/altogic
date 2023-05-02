import 'dart:async';

import 'package:altogic/altogic.dart';
import 'package:flutter/cupertino.dart';
import 'package:fodcast_app/models/episode.dart';
import 'package:fodcast_app/services/auth_service.dart';
import 'package:fodcast_app/services/episode_service.dart';
import 'package:fodcast_app/services/podcast_service.dart';
import 'package:fodcast_app/services/user_service.dart';
import 'package:fodcast_app/utils/altogic_service.dart';

class EpisodeProgress {
  final String episodeId;
  final DateTime updatedAt;
  final ValueNotifier<Duration> position;
  bool createdLocally;

  EpisodeProgress(
      {required this.episodeId,
      required Duration position,
      required this.updatedAt,
      required this.createdLocally})
      : position = ValueNotifier(position);
}

class ProgressService {
  ProgressService._();

  static final ProgressService _instance = ProgressService._();

  factory ProgressService() => _instance;

  final Map<String, EpisodeProgress?> _progress = {};

  Future<void> firstProgress(String podcastId) async {
    final podcast = await PodcastService().getPodcast(podcastId);

    for (final tag in podcast.tags) {
      UserService().addUserInterest(tag);
    }
  }

  Future<void> saveProgress(Episode episode) async {
    final position = episode.progress.position.value;
    final podcastId = episode.podcastId;
    final episodeId = episode.id;

    final progress = await getEpisodeProgress(episodeId);

    if (progress.createdLocally) {
      firstProgress(podcastId);

      await altogic.db.model("progressEpisode").create({
        'user_id': AuthService().user.id,
        'podcast_id': podcastId,
        'episode_id': episodeId,
        'time_elapsed': position.inMilliseconds,
        'updatedAt': DateTime.now().toIso8601String(),
      });

      progress.createdLocally = false;
    } else {
      await altogic.db
          .model("progressEpisode")
          .filter(
              'user_id == "${AuthService().user.id}" && episode_id == "$episodeId"')
          .update({
        'time_elapsed': position.inMilliseconds,
        'updatedAt': DateTime.now().toIso8601String(),
      });
    }
  }

  Completer? lastLoading;

  Future<List<Episode>> getLastProgress() async {
    lastLoading = Completer();
    final progress = await altogic.db
        .model("progressEpisode")
        .filter('user_id == "${AuthService().user.id}" && time_elapsed > 0')
        .sort("updatedAt", Direction.desc)
        .get();

    if (progress.errors == null) {
      for (final p in progress.data!) {
        _progress[p['episode_id']] = EpisodeProgress(
          createdLocally: false,
          episodeId: p['episode_id'],
          updatedAt: DateTime.parse(p['updatedAt']),
          position: Duration(milliseconds: p['time_elapsed']),
        );
      }
      lastLoading?.complete();
      return Future.wait((progress.data as List)
          .map((e) => EpisodeService().getEpisode(e['episode_id'])));
    } else {
      lastLoading?.complete();
      throw Exception('Failed to load episodes for podcast.');
    }
  }

  Future<EpisodeProgress> getEpisodeProgress(String episodeId) async {
    if (lastLoading != null) {
      await lastLoading!.future;
    }
    if (_progress.containsKey(episodeId)) {
      return _progress[episodeId]!;
    } else {
      await _getProgress(episodeId);
      return _progress[episodeId]!;
    }
  }

  Future<void> _getProgress(String episodeId) async {
    final progress = await altogic.db
        .model("progressEpisode")
        .filter(
            'user_id == "${AuthService().user.id}" && episode_id == "$episodeId"')
        .getSingle();

    if (progress.errors == null && progress.data != null) {
      _progress[episodeId] = EpisodeProgress(
        createdLocally: false,
        episodeId: episodeId,
        updatedAt: DateTime.parse(progress.data!['updatedAt']),
        position: Duration(milliseconds: progress.data!['time_elapsed']),
      );
    } else {
      _progress[episodeId] = EpisodeProgress(
        createdLocally: true,
        episodeId: episodeId,
        updatedAt: DateTime.now(),
        position: Duration.zero,
      );
    }
  }
}
