import 'dart:math';

import 'package:flutter/material.dart';
import 'package:fodcast_app/models/episode.dart';
import 'package:intl/intl.dart';

class HistoryList extends StatelessWidget {
  final List<Episode> episodes;
  final void Function(Episode) onEpisodePressed;
  final void Function(Episode) onEpisodeRemoved;

  const HistoryList({
    super.key,
    required this.episodes,
    required this.onEpisodePressed,
    required this.onEpisodeRemoved,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 320,
      child: Column(
        children: [
          Flexible(
            child: ListView.builder(
              physics: const NeverScrollableScrollPhysics(),
              padding: EdgeInsets.zero,
              itemCount: min(episodes.length, 3),
              itemBuilder: (BuildContext context, int index) {
                final episode = episodes[index];
                final date = DateFormat('MMM d, yyyy').format(episode.pubDate);
                return Dismissible(
                  key: ValueKey(episode.id),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    alignment: Alignment.centerRight,
                    color: Colors.grey,
                    child: const Padding(
                      padding: EdgeInsets.only(right: 16.0),
                      child: Icon(Icons.delete, color: Colors.white),
                    ),
                  ),
                  onDismissed: (direction) => onEpisodeRemoved(episode),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Image.network(
                            episode.imageUrl,
                            height: 80,
                            width: 80,
                            fit: BoxFit.cover,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                episode.title,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                episode.description,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.calendar_month_sharp,
                                        color: Colors.grey,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        date,
                                        style: TextStyle(
                                          fontSize: 14,
                                          color: Colors.grey[600],
                                        ),
                                      ),
                                    ],
                                  ),
                                  Row(
                                    children: [
                                      const Icon(
                                        Icons.play_circle_fill_rounded,
                                        color: Colors.grey,
                                      ),
                                      const SizedBox(width: 4),
                                      ValueListenableBuilder(
                                          valueListenable:
                                              episode.progress.position,
                                          builder: (c, d, _) {
                                            return Text(
                                              '${d.inMinutes.toString().padLeft(2, '0')}'
                                              ':'
                                              '${(d.inSeconds % 60).toString().padLeft(2, '0')}',
                                              style: const TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            );
                                          }),
                                    ],
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
