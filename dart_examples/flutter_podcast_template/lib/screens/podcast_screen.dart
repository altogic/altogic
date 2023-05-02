import 'package:flutter/material.dart';
import 'package:fodcast_app/models/podcast.dart';
import 'package:fodcast_app/services/episode_service.dart';
import 'package:fodcast_app/services/podcast_service.dart';
import 'package:fodcast_app/widgets/custom_button.dart';
import 'package:fodcast_app/widgets/episode_list.dart';

import '../models/episode.dart';

class PodcastScreen extends StatefulWidget {
  final String? podcastId;
  final Podcast? podcast;

  const PodcastScreen({super.key, this.podcastId, this.podcast});

  @override
  PodcastScreenState createState() => PodcastScreenState();
}

class PodcastScreenState extends State<PodcastScreen> {
  Podcast? _podcast;

  Podcast get podcast => _podcast!;
  final PodcastService _podcastService = PodcastService();

  List<Episode> episodes = [];

  final List<Widget> _tabs = const [
    Tab(text: 'Episodes'),
    Tab(text: 'Info'),
    Tab(text: 'Reviews'),
  ];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() async {
    final podcast =
        widget.podcast ?? await _podcastService.getPodcast(widget.podcastId!);
    episodes = await EpisodeService().getEpisodesForPodcast(podcast.id);
    setState(() {
      _podcast = podcast;
    });
  }

  @override
  Widget build(BuildContext context) {
    return _podcast == null
        ? const Center(child: CircularProgressIndicator())
        : DefaultTabController(
            length: _tabs.length,
            child: Scaffold(
              appBar: AppBar(
                title: Text(podcast.name),
                centerTitle: true,
                actions: [
                  IconButton(
                    icon: Icon(podcast.subscribed
                        ? Icons.favorite
                        : Icons.favorite_border),
                    onPressed: () {
                      _podcastService.subscribe(podcast);
                      setState(() {});
                    },
                  ),
                ],
                bottom: TabBar(
                  tabs: _tabs,
                  indicatorColor: Colors.white,
                ),
              ),
              body: TabBarView(
                children: [
                  EpisodeList(episodes: episodes, onEpisodePressed: (e) {}),
                  _buildInfoTab(),
                  _buildReviewsTab(),
                ],
              ),
            ),
          );
  }

  Widget _buildInfoTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Image.network(podcast.imageUrl),
          const SizedBox(height: 16.0),
          Text(
            podcast.name,
            style: const TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8.0),
          Text(
            podcast.author.name!,
            style: const TextStyle(fontSize: 18.0),
          ),
          const SizedBox(height: 8.0),
          Text(
            podcast.description,
            style: const TextStyle(fontSize: 16.0),
          ),
          const SizedBox(height: 16.0),
          CustomButton(
            text: 'Subscribe',
            onPressed: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildReviewsTab() {
    return const Center(
      child: Text('No reviews yet.'),
    );
  }
}
