/* import 'package:flutter/material.dart';

class MiniPlayer extends StatefulWidget {
  final String title;
  final String imageUrl;
  final Duration duration;
  final VoidCallback onTap;

  const MiniPlayer({
    required this.title,
    required this.imageUrl,
    required this.duration,
    required this.onTap,
  });

  @override
  _MiniPlayerState createState() => _MiniPlayerState();
}

class _MiniPlayerState extends State<MiniPlayer> {
  bool _isPlaying = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        height: 60,
        color: Colors.black.withOpacity(0.8),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Hero(
                  tag: 'audio_track_${widget.title}',
                  child: CircleAvatar(
                    backgroundImage: NetworkImage(widget.imageUrl),
                  ),
                ),
                const SizedBox(width: 8),
                Tooltip(
                  message: widget.title,
                  child: Text(
                    widget.title,
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
            Row(
              children: [
                const Icon(
                  Icons.play_arrow,
                  color: Colors.white,
                ),
                const SizedBox(width: 8),
                Text(
                  '${widget.duration.inMinutes.toString().padLeft(2, '0')}:${(widget.duration.inSeconds % 60).toString().padLeft(2, '0')}',
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
                  child: FractionallySizedBox(
                    widthFactor: 0.6, // replace with your own progress value
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
 */

import 'package:flutter/material.dart';

class MiniPlayer extends StatefulWidget {
  final String title;
  final String imageUrl;
  final Duration duration;
  final VoidCallback onTap;

  const MiniPlayer({
    super.key,
    required this.title,
    required this.imageUrl,
    required this.duration,
    required this.onTap,
  });

  @override
  State<MiniPlayer> createState() => _MiniPlayerState();
}

class _MiniPlayerState extends State<MiniPlayer> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: Hero(
        tag: 'audio_track_${widget.title}',
        child: Container(
          height: 60,
          color: Colors.black.withOpacity(0.8),
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Hero(
                    tag: 'audio_track_${widget.title}_avatar',
                    child: CircleAvatar(
                      backgroundImage: NetworkImage(widget.imageUrl),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Tooltip(
                    message: widget.title,
                    child: Text(
                      widget.title,
                      style: const TextStyle(color: Colors.white),
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  SizedBox(
                    width: 80,
                    child: Text(
                      '${widget.duration.inMinutes.toString().padLeft(2, '0')}:${(widget.duration.inSeconds % 60).toString().padLeft(2, '0')}',
                      style: const TextStyle(color: Colors.white),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    height: 4,
                    width: 40,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(2),
                    ),
                    child: FractionallySizedBox(
                      widthFactor: 0.6, // replace with your own progress value
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Icon(
                    Icons.play_arrow,
                    color: Colors.white,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
