import 'package:flutter/material.dart';
import 'package:fodcast_app/models/podcast.dart';

class PodcastList extends StatelessWidget {
  final List<Podcast> podcasts;
  final void Function(Podcast) onPodcastPressed;

  const PodcastList(
      {super.key, required this.podcasts, required this.onPodcastPressed});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: podcasts.length,
      itemBuilder: (BuildContext context, int index) {
        final podcast = podcasts[index];

        return ListTile(
          onTap: () => onPodcastPressed(podcast),
          leading: Image.network(podcast.imageUrl),
          title: Text(podcast.name),
          subtitle: Text(podcast.author.name!),
        );
      },
    );
  }
}
