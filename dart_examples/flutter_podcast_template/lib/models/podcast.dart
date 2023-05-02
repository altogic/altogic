import 'package:altogic/altogic.dart';
import 'package:fodcast_app/services/podcast_service.dart';

import '../utils/altogic_service.dart';

class Podcast {
  final String id;
  final String name;
  final String description;
  final String authorId;
  final String imageUrl;
  final int episodeCount;
  final List<String> tags;

  bool get subscribed => PodcastService().subscribedPodcasts.contains(id);

  Podcast(
      {required this.id,
      required this.name,
      required this.description,
      required this.authorId,
      required this.imageUrl,
      required this.episodeCount,
      required this.tags});

  factory Podcast.fromJson(Map<String, dynamic> json) {
    return Podcast(
      id: json['_id'],
      name: json['name'],
      description: json['description'],
      authorId: json['author'],
      imageUrl: json['imageUrl'],
      episodeCount: json['episodeCount'],
      tags: json['tags'] != null ? List<String>.from(json['tags']) : [],
    );
  }

  User? _author;

  Future<void> loadAuthor() async {
    final response = await altogic.db.model("users").object(authorId).get();
    if (response.errors != null) {
      throw Exception('Failed to load author.');
    } else {
      _author = User.fromJson(response.data!);
    }
  }

  User get author => _author!;
}
