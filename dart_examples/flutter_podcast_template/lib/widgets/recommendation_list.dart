import 'package:flutter/material.dart';
import 'package:fodcast_app/models/episode.dart';
import 'package:intl/intl.dart';

class RecommendationList extends StatelessWidget {
  final List<Episode> episodes;
  final Function(Episode) onEpisodePressed;

  const RecommendationList(
      {super.key, required this.episodes, required this.onEpisodePressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 320.0,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: episodes.length,
        itemBuilder: (BuildContext context, int index) {
          final episode = episodes[index];
          return Padding(
            padding: const EdgeInsets.all(8.0),
            child: SizedBox(
              width: 200.0,
              child: Card(
                child: Stack(
                  children: [
                    Positioned.fill(
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4.0),
                        child: Image.network(
                          episode.imageUrl,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      left: 0,
                      right: 0,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.transparent,
                              Colors.black.withOpacity(0.7),
                            ],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                        ),
                        padding: const EdgeInsets.symmetric(
                            vertical: 8.0, horizontal: 16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              episode.title,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 16.0,
                              ),
                            ),
                            const SizedBox(height: 4.0),
                            Text(
                              episode.description,
                              maxLines: 3,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12.0,
                              ),
                            ),
                            const SizedBox(height: 8.0),
                            Row(
                              children: [
                                const Icon(
                                  Icons.calendar_today_outlined,
                                  color: Colors.white,
                                  size: 16.0,
                                ),
                                const SizedBox(width: 4.0),
                                Text(
                                  DateFormat('MMM d, yyyy')
                                      .format(episode.pubDate),
                                  style: const TextStyle(
                                      color: Colors.white, fontSize: 12.0),
                                ),
                                const SizedBox(width: 8.0),
                                const Icon(
                                  Icons.access_time_rounded,
                                  color: Colors.white,
                                  size: 16.0,
                                ),
                                const SizedBox(width: 4.0),
                                Text(
                                  "${episode.duration.inMinutes} min",
                                  style: const TextStyle(
                                      color: Colors.white, fontSize: 12.0),
                                ),
                              ],
                            )
                          ],
                        ),
                      ),
                    ),
                    Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () => onEpisodePressed(episode),
                        child: const SizedBox.expand(),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
