class Recommendation {
  final String userId;
  final String episodeId;
  final String id;
  final String title;
  final String description;
  final String imageUrl;
  final String url;

  Recommendation({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.url,
    required this.userId,
    required this.episodeId,
  });

  factory Recommendation.fromJson(Map<String, dynamic> json) {
    return Recommendation(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      imageUrl: json['imageUrl'],
      url: json['url'],
      userId: json['user_id'],
      episodeId: json['episode_id'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'imageUrl': imageUrl,
      'url': url,
      'user_id': userId,
      'episode_id': episodeId,
    };
  }
}

class RecommendationResponse {
  final int count;
  final int totalPages;
  final int currentPage;
  final int pageSize;
  final List<Recommendation> recommendations;

  RecommendationResponse({
    required this.count,
    required this.totalPages,
    required this.currentPage,
    required this.pageSize,
    required this.recommendations,
  });

  factory RecommendationResponse.fromJson(Map<String, dynamic> json) {
    final List<dynamic> results = json['result'];
    final List<Recommendation> recommendations =
        results.map((dynamic item) => Recommendation.fromJson(item)).toList();

    return RecommendationResponse(
      count: json['countInfo']['count'],
      totalPages: json['countInfo']['totalPages'],
      currentPage: json['countInfo']['currentPage'],
      pageSize: json['countInfo']['pageSize'],
      recommendations: recommendations,
    );
  }
}
