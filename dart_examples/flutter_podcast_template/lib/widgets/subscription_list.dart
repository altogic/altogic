import 'package:flutter/material.dart';
import 'package:fodcast_app/models/podcast.dart';

class SubscriptionList extends StatelessWidget {
  final List<Podcast> podcasts;
  final void Function(Podcast) onPodcastPressed;

  const SubscriptionList(
      {super.key, required this.podcasts, required this.onPodcastPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 128,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        scrollDirection: Axis.horizontal,
        itemCount: podcasts.length,
        separatorBuilder: (BuildContext context, int index) =>
            const SizedBox(width: 20.0),
        itemBuilder: (BuildContext context, int index) {
          final podcast = podcasts[index];

          return GestureDetector(
            onTap: () => onPodcastPressed(podcast),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Stack(
                  children: [
                    ClipOval(
                      child: Image.network(
                        podcast.imageUrl,
                        width: 80,
                        height: 80,
                        fit: BoxFit.cover,
                      ),
                    ),
                    if (podcast.author.emailVerified ?? false)
                      Positioned(
                        top: 0,
                        right: 0,
                        child: Container(
                          width: 24,
                          height: 24,
                          decoration: const BoxDecoration(
                            color: Colors.green,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.new_releases,
                            color: Colors.white,
                            size: 16.0,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 8.0),
                Text(
                  podcast.name.length > 9
                      ? '${podcast.name.substring(0, 9)}..'
                      : podcast.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14.0,
                  ),
                ),
                const SizedBox(height: 4.0),
                Text(
                  podcast.author.name!,
                  style: TextStyle(
                    fontSize: 14.0,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
