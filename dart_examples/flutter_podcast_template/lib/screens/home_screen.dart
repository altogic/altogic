import 'package:flutter/material.dart';
import 'package:fodcast_app/screens/episode_screen.dart';
import 'package:fodcast_app/screens/podcast_screen.dart';
import 'package:fodcast_app/services/episode_service.dart';
import 'package:fodcast_app/services/podcast_service.dart';
import 'package:fodcast_app/services/progress_service.dart';
import 'package:fodcast_app/utils/constants.dart';
import 'package:fodcast_app/utils/audio_manager.dart';
import 'package:intl/intl.dart';
import 'package:fodcast_app/models/episode.dart';
import 'package:fodcast_app/models/podcast.dart';
import 'package:fodcast_app/widgets/history_list.dart';
import 'package:fodcast_app/widgets/recommendation_list.dart';
import 'package:fodcast_app/widgets/subscription_list.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  HomeScreenState createState() => HomeScreenState();
}

class HomeScreenState extends State<HomeScreen> {
  final EpisodeService _episodeService = EpisodeService();
  final PodcastService _podcastService = PodcastService();

  List<Episode>? _recommendations;
  List<Episode>? _trends;
  List<Episode>? _history;
  List<Episode>? _newEpisodes;
  List<Podcast>? _subscriptions;
  bool _isPlaying = false;
  bool loading = true;

  @override
  void initState() {
    super.initState();
    audioManager.addListener(_listen);
    _loadData();
  }

  @override
  void dispose() {
    audioManager.removeListener(_listen);
    super.dispose();
  }

  void _loadData() async {
    final recommendations = await _episodeService.getRecommendedEpisodes();

    final history = await ProgressService().getLastProgress();
    final newEpisodes = await _episodeService.getNewEpisodes();
    final subscriptions = await _podcastService.getSubscriptions();
    final trends = await _episodeService.getTrendingEpisodes();

    if (mounted) {
      setState(() {
        _recommendations = recommendations;
        _history = history;
        _newEpisodes = newEpisodes;
        _subscriptions = subscriptions;
        _trends = trends;
        loading = false;
      });
    }
  }

  void _onEpisodePressed(Episode episode) {
    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => EpisodeScreen(
          episode: episode,
          onPlayStateChange: _onEpisodePlayingStateChanged, // Add this line
          onEpisodeChanged: _onEpisodeChanged,
        ),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          var begin = const Offset(0.0, 1.0);
          var end = Offset.zero;
          var curve = Curves.ease;

          var tween = Tween(begin: begin, end: end).chain(
            CurveTween(curve: curve),
          );

          return SlideTransition(
            position: animation.drive(tween),
            child: child,
          );
        },
      ),
    );
  }

  void _onPodcastPressed(Podcast podcast) {
    Navigator.push(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) {
          return PodcastScreen(podcast: podcast);
        },
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          var begin = const Offset(0.0, 1.0);
          var end = Offset.zero;
          var curve = Curves.ease;

          var tween =
              Tween(begin: begin, end: end).chain(CurveTween(curve: curve));

          return SlideTransition(
            position: animation.drive(tween),
            child: child,
          );
        },
      ),
    );
  }

  void _onEpisodePlayingStateChanged(bool isPlaying) {
    setState(() {
      _isPlaying = isPlaying;
    });
  }

  void _onEpisodeChanged(Episode? episode) {}

  void _onEpisodeRemovedFromHistory(Episode episode) {
    setState(() {
      _history!.removeWhere((element) => element.id == episode.id);
    });
  }

  _listen() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : CustomScrollView(
              slivers: [
                SliverAppBar(
                  /* title: Text('Podcasts'), */
                  centerTitle: true,
                  floating: true,
                  pinned: true,
                  snap: true,
                  automaticallyImplyLeading: false,
                  expandedHeight: 200.0,
                  actions: [
                    IconButton(
                      icon: const Icon(Icons.account_circle),
                      onPressed: () {
                        Navigator.pushNamed(context, Constants.profileRoute);
                      },
                    ),
                  ],
                  flexibleSpace: FlexibleSpaceBar(
                    background: Image.network(
                      'https://picsum.photos/600/800',
                      fit: BoxFit.cover,
                    ),
                    centerTitle: true,
                    title: const Text(
                      'Explore Podcasts',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16.0, vertical: 16.0),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate(
                      [
                        if (_recommendations != null &&
                            _recommendations!.isNotEmpty) ...[
                          const Text(
                            'Recommendations',
                            style: TextStyle(
                                fontSize: 24.0, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16.0),
                          RecommendationList(
                            episodes: _recommendations!,
                            onEpisodePressed: _onEpisodePressed,
                          )
                        ],
                        if (_trends != null && _trends!.isNotEmpty) ...[
                          const Text(
                            'Trends',
                            style: TextStyle(
                                fontSize: 24.0, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 16.0),
                          RecommendationList(
                            episodes: _trends!,
                            onEpisodePressed: _onEpisodePressed,
                          )
                        ],
                        if (_history != null && _history!.isNotEmpty) ...[
                          const SizedBox(height: 32.0),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Text(
                                'Listen Again',
                                style: TextStyle(
                                    fontSize: 24.0,
                                    fontWeight: FontWeight.bold),
                              ),
                              Text(
                                'See All',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 14.0,
                                  fontWeight: FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16.0),
                          HistoryList(
                            episodes: _history!,
                            onEpisodePressed: _onEpisodePressed,
                            onEpisodeRemoved: _onEpisodeRemovedFromHistory,
                          )
                        ],
                        if (_subscriptions != null &&
                            _subscriptions!.isNotEmpty) ...[
                          const SizedBox(height: 32.0),
                          const Text(
                            'Subscriptions',
                            style: TextStyle(
                                fontSize: 24.0, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 32.0),
                          SubscriptionList(
                            podcasts: _subscriptions!,
                            onPodcastPressed: _onPodcastPressed,
                          ),
                          const SizedBox(height: 32.0),
                        ],
                        if (_newEpisodes != null &&
                            _newEpisodes!.isNotEmpty) ...[
                          const Text(
                            'New Episodes',
                            style: TextStyle(
                                fontSize: 24.0, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 0.0),
                          ListView.builder(
                            itemCount: _newEpisodes!.length,
                            shrinkWrap: true,
                            physics: const ClampingScrollPhysics(),
                            padding: const EdgeInsets.only(
                                top: 8.0, bottom: 8.0, left: 0),
                            itemBuilder: (BuildContext context, int index) {
                              final episode = _newEpisodes![index];
                              final date = DateFormat('MMM d, yyyy')
                                  .format(episode.pubDate);
                              return ListTile(
                                contentPadding: const EdgeInsets.all(0),
                                onTap: () => _onEpisodePressed(episode),
                                leading: Image.network(episode.imageUrl),
                                title: Text(episode.title),
                                subtitle: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const SizedBox(height: 4),
                                    Text(episode.podcast.name, maxLines: 1),
                                    const SizedBox(height: 4),
                                    Text(date),
                                  ],
                                ),
                              );
                            },
                          )
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            ),
      bottomNavigationBar: _showMiniPlayer(),
    );
  }

  AudioManager get audioManager => AudioManager();

  Widget _showMiniPlayer() {
    final currentEpisode = audioManager.currentEpisode;

    if (currentEpisode == null) {
      return const SizedBox.shrink();
    }

    return ValueListenableBuilder(
      valueListenable: currentEpisode.progress.position,
      builder: (ctx, position, _) {
        final duration = currentEpisode.duration;
        return GestureDetector(
          onTap: () {
            _onEpisodePressed(currentEpisode);
          },
          child: Container(
            height: 80,
            color: Colors.black.withOpacity(0.8),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Hero(
                      tag: 'audio_track_${currentEpisode.id}',
                      child: CircleAvatar(
                        backgroundImage: NetworkImage(currentEpisode.imageUrl),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Tooltip(
                      message: currentEpisode.title,
                      child: Text(
                        currentEpisode.title.length > 20
                            ? '${currentEpisode.title.substring(0, 20)}...'
                            : currentEpisode.title,
                        style: const TextStyle(color: Colors.white),
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    const SizedBox(width: 8),
                    Text(
                      '${position.inMinutes.toString().padLeft(2, '0')}:${(position.inSeconds % 60).toString().padLeft(2, '0')}',
                      style: const TextStyle(color: Colors.white),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      height: 4,
                      width: 40,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(2),
                      ),
                      child: Padding(
                        padding: EdgeInsets.only(
                            left:
                                (position.inSeconds / duration.inSeconds) * 40),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.green,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      icon: Icon(
                          _isPlaying
                              ? Icons.pause_circle_filled
                              : Icons.play_circle_filled,
                          color: Colors.white),
                      onPressed: () {
                        if (_isPlaying) {
                          audioManager.pause();
                          setState(() {
                            _isPlaying = false;
                          });
                        } else {
                          audioManager.play(currentEpisode);
                          setState(() {
                            _isPlaying = true;
                          });
                        }
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
