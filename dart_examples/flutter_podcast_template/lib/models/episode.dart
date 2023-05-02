import 'package:fodcast_app/models/podcast.dart';
import 'package:fodcast_app/services/podcast_service.dart';
import 'package:fodcast_app/services/progress_service.dart';

class Episode {
  final String id;
  final String title;
  final String description;
  final String audioUrl;
  final String imageUrl;
  final String podcastId;
  final DateTime pubDate;
  final Duration duration;

  Episode(
      {required this.id,
      required this.title,
      required this.description,
      required this.audioUrl,
      required this.imageUrl,
      required this.podcastId,
      required this.pubDate,
      required this.duration});

  factory Episode.fromJson(Map<String, dynamic> json) {
    return Episode(
        id: json['_id'],
        title: json['title'],
        description: json['description'],
        audioUrl: json['audioUrl'],
        imageUrl: json['imageUrl'],
        podcastId: json['podcastId'],
        pubDate: DateTime.parse(json['pubDate']),
        duration: Duration(milliseconds: json['duration']));
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'audioUrl': audioUrl,
      'imageUrl': imageUrl,
      'podcastId': podcastId,
      'pubDate': pubDate.toIso8601String(),
      'duration': duration
    };
  }

  Podcast? _podcast;

  Podcast get podcast => _podcast!;

  EpisodeProgress? _progress;

  EpisodeProgress get progress => _progress!;

  Future<void> cache([Podcast? podcast]) async {
    _podcast = podcast ??= await PodcastService().getPodcast(podcastId);
    _progress = await ProgressService().getEpisodeProgress(id);
  }
}
