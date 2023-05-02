import 'dart:math';
import 'package:flutter/material.dart';
import 'package:fodcast_app/models/episode.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:fodcast_app/screens/podcast_screen.dart';
import 'package:fodcast_app/utils/audio_manager.dart';
import 'package:provider/provider.dart';

class EpisodeScreen extends StatefulWidget {
  final ValueChanged<bool>? onPlayStateChange;
  final ValueChanged<Episode?>? onEpisodeChanged; // Add this line
  final Episode episode;

  const EpisodeScreen(
      {Key? key,
      required this.episode,
      this.onPlayStateChange,
      this.onEpisodeChanged})
      : super(key: key);

  @override
  State<EpisodeScreen> createState() => _EpisodeScreenState();
}

class _EpisodeScreenState extends State<EpisodeScreen> {
  AudioManager _audioManager = AudioManager();

  @override
  void initState() {
    super.initState();
    _audioManager = context.read<AudioManager>();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.blue,
              Colors.purple,
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      _buildHeader(),
                      const SizedBox(height: 8.0),
                      _buildEpisodeImage(),
                      const SizedBox(height: 24.0),
                      _buildEpisodeTitle(),
                      const SizedBox(height: 16.0),
                      _buildEpisodeDescription(),
                      const SizedBox(height: 8),
                      _buildPodcastDesc(),
                      const SizedBox(height: 8),
                      _buildSlider(),
                      const SizedBox(height: 16.0),
                      _buildPlayerControls(),
                      const SizedBox(height: 16.0),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.arrow_back),
            color: Colors.white,
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.share),
            color: Colors.white,
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerControls() {
    return Container(
      height: 125,
      decoration: const BoxDecoration(),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Consumer<AudioManager>(
                builder: (context, audioManager, child) {
                  final isCurrentEpisode =
                      audioManager.currentEpisode?.id == widget.episode.id;
                  return IconButton(
                    icon: const Icon(Icons.replay_30_rounded,
                        color: Colors.white),
                    iconSize: 36.0,
                    onPressed: isCurrentEpisode
                        ? () {
                            _audioManager.seek(
                                widget.episode.progress.position.value -
                                    const Duration(seconds: 30));
                          }
                        : null,
                  );
                },
              ),
              const SizedBox(width: 32.0),
              Consumer<AudioManager>(
                builder: (context, audioManager, child) {
                  IconData icon = Icons.play_circle_fill_rounded;
                  Function() onPressed;

                  if (audioManager.currentEpisode?.id == widget.episode.id &&
                      audioManager.playerState == PlayerState.playing) {
                    icon = Icons.pause_circle_filled_rounded;
                    onPressed = () {
                      audioManager.pause();
                      if (widget.onPlayStateChange != null) {
                        widget.onPlayStateChange!(false);
                      }
                    };
                  } else {
                    icon = Icons.play_circle_fill_rounded;
                    onPressed = () {
                      audioManager.play(widget.episode);
                      if (widget.onPlayStateChange != null) {
                        widget.onPlayStateChange!(true);
                      }
                    };
                  }

                  return IconButton(
                    icon: Icon(icon, color: Colors.white),
                    iconSize: 72.0,
                    onPressed: onPressed,
                  );
                },
              ),
              const SizedBox(width: 32.0),
              Consumer<AudioManager>(
                builder: (context, audioManager, child) {
                  final isCurrentEpisode =
                      audioManager.currentEpisode?.id == widget.episode.id;
                  return IconButton(
                    icon: const Icon(Icons.forward_30_rounded,
                        color: Colors.white),
                    iconSize: 36.0,
                    onPressed: isCurrentEpisode
                        ? () {
                            _audioManager.seek(
                                widget.episode.progress.position.value +
                                    const Duration(seconds: 30));
                          }
                        : null,
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 8.0),
          ValueListenableBuilder(
              valueListenable: widget.episode.progress.position,
              builder: (ctx, position, _) {
                final duration = widget.episode.duration;

                return Text(
                  '${position.inMinutes.toString().padLeft(2, '0')}:${(position.inSeconds % 60).toString().padLeft(2, '0')} / ${duration.inMinutes.toString().padLeft(2, '0')}:${(duration.inSeconds % 60).toString().padLeft(2, '0')}',
                  style: const TextStyle(fontSize: 24.0, color: Colors.white),
                );
              }),
        ],
      ),
    );
  }

  Widget _buildSlider() {
    return ValueListenableBuilder(
      valueListenable: widget.episode.progress.position,
      builder: (context, position, child) {
        final isCurrentEpisode =
            AudioManager().currentEpisode?.id == widget.episode.id;
        final duration = widget.episode.duration;
        return Slider(
          max: duration.inSeconds.toDouble(),
          onChanged: (double value) {
            if (isCurrentEpisode) {
              final newPosition = Duration(seconds: value.toInt());
              AudioManager().seek(newPosition);
            }
          },
          activeColor: isCurrentEpisode ? Colors.white : Colors.grey[500],
          inactiveColor: Colors.grey[500],
          divisions: max(duration.inSeconds, 1),
          min: 0,
          value: position.inSeconds
              .toDouble()
              .clamp(0, duration.inSeconds.toDouble()),
          label: isCurrentEpisode
              ? '${position.inMinutes.toString().padLeft(2, '0')}:${(position.inSeconds % 60).toString().padLeft(2, '0')}'
              : '00:00',
        );
      },
    );
  }

  Widget _buildEpisodeImage() {
    return Hero(
      tag: 'audio_track_${widget.episode.id}',
      child: Container(
        decoration: const BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black26,
              offset: Offset(0, 1),
              blurRadius: 6.0,
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Image.network(
            widget.episode.imageUrl,
            width: 260,
            fit: BoxFit.cover,
          ),
        ),
      ),
    );
  }

  Widget _buildEpisodeTitle() {
    return Text(
      widget.episode.title,
      style: const TextStyle(
          fontSize: 32.0, fontWeight: FontWeight.bold, color: Colors.white),
      textAlign: TextAlign.center,
    );
  }

  Widget _buildEpisodeDescription() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Text(
        widget.episode.description,
        style: const TextStyle(fontSize: 16.0, color: Colors.white),
        textAlign: TextAlign.justify,
      ),
    );
  }

  Widget _buildPodcastDesc() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: TextButton(
        onPressed: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (context) => PodcastScreen(
                podcast: widget.episode.podcast,
              ),
            ),
          );
        },
        child: Text(
          widget.episode.podcast.name,
          style: const TextStyle(fontSize: 16.0, color: Colors.white),
          textAlign: TextAlign.justify,
        ),
      ),
    );
  }
}

/* Widget _buildMiniPlayer() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 8.0,
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                icon: Icon(Icons.expand_more_rounded),
                onPressed: () {
                  setState(() {
                    _isExpanded = !_isExpanded;
                  });
                },
              ),
              const SizedBox(width: 8.0),
              StreamBuilder<PlayerState>(
                stream: _playerStateStream,
                builder: (BuildContext context,
                    AsyncSnapshot<PlayerState> snapshot) {
                  IconData icon = Icons.play_circle_fill_rounded;
                  if (snapshot.hasData) {
                    if (snapshot.data == PlayerState.playing) {
                      icon = Icons.pause_circle_filled_outlined;
                    } else if (snapshot.data == PlayerState.paused) {
                      icon = Icons.play_circle_fill_rounded;
                    }
                  }
                  return IconButton(
                    icon: Icon(icon),
                    onPressed: () {
                      if (snapshot.hasData) {
                        if (snapshot.data == PlayerState.playing) {
                          _audioPlayer.pause();
                        } else if (snapshot.data == PlayerState.paused) {
                          _audioPlayer.resume();
                        }
                      }
                    },
                  );
                },
              ),
              const SizedBox(width: 8.0),
              IconButton(
                icon: Icon(Icons.stop_circle_rounded),
                onPressed: () {
                  _audioPlayer.stop();
                },
              ),
            ],
          ),
          const SizedBox(height: 8.0),
          _buildSlider(),
        ],
      ),
    );
  } */
