import 'package:flutter/material.dart';
import 'package:fodcast_app/models/episode.dart';
import 'package:intl/intl.dart';

class EpisodeList extends StatelessWidget {
  final List<Episode> episodes;
  final void Function(Episode) onEpisodePressed;

  const EpisodeList(
      {super.key, required this.episodes, required this.onEpisodePressed});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: episodes.length,
      itemBuilder: (BuildContext context, int index) {
        final episode = episodes[index];
        /* final date = DateFormat('MMM d, yyyy').format(episode.published); */
        final date = DateFormat('MMM d, yyyy').format(episode.pubDate);

        return ListTile(
          onTap: () => onEpisodePressed(episode),
          leading: Image.network(episode.imageUrl),
          title: Text(episode.title),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 4),
              /* Text(episode.podcastTitle), */
              Text(episode.podcastId),
              const SizedBox(height: 4),
              Text(date),
            ],
          ),
        );
      },
    );
  }
}
