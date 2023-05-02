import 'dart:async';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';
import 'package:fodcast_app/models/episode.dart';

import '../services/progress_service.dart';

class AudioManager with ChangeNotifier {
  late AudioPlayer _audioPlayer;
  StreamSubscription<PlayerState>? _playerStateSubscription;
  StreamSubscription<Duration>? _positionSubscription;
  PlayerState _playerState = PlayerState.stopped;

  PlayerState get playerState => _playerState;

  bool get isPlaying => playerState == PlayerState.playing;
  Episode? _currentEpisode;

  Episode? get currentEpisode => _currentEpisode;

  static final AudioManager _instance = AudioManager._();

  AudioManager._() {
    _initAudioPlayer();
  }

  factory AudioManager() {
    return _instance;
  }

  void _initAudioPlayer() {
    _audioPlayer = AudioPlayer();
    _playerStateSubscription =
        _audioPlayer.onPlayerStateChanged.listen((state) {
      _playerState = state;
      notifyListeners();
    });

    _positionSubscription = _audioPlayer.onPositionChanged.listen((event) {
      currentEpisode?.progress.position.value = event;
    });
    _audioPlayer.onDurationChanged.listen((Duration d) {
      // notifyListeners();
    });
  }

/*  void updateCurrentEpisode(Episode episode) {
    _currentEpisode = episode;
    notifyListeners();
  }*/

/*  void setPlaylist(List<Episode> playlist, {int startIndex = 0}) {
    _playlist = playlist;
    _playlistIndex = startIndex;
  }

  void next() {
    if (_playlistIndex < _playlist.length - 1) {
      _playlistIndex++;
      _playMediaItem(_playlist[_playlistIndex]);
    }
  }

  void previous() {
    if (_playlistIndex > 0) {
      _playlistIndex--;
      _playMediaItem(_playlist[_playlistIndex]);
    }
  }

  Future<void> playMediaItem(Episode mediaItem) async {
    if (_playlist.isEmpty) {
      _playlist.add(mediaItem);
      _playlistIndex = 0;
    } else {
      final index = _playlist.indexWhere((item) => item.id == mediaItem.id);

      if (index == -1) {
        _playlist.insert(++_playlistIndex, mediaItem);
      } else {
        _playlistIndex = index;
      }
    }

    _playMediaItem(mediaItem);
  }*/

/*  Future<void> _playMediaItem(Episode mediaItem) async {
    _currentEpisode = mediaItem;
    notifyListeners();

    final url = mediaItem.audioUrl;
    await _audioPlayer.play(UrlSource(url));
  }*/

  Future<void> play(Episode episode) async {
    await _audioPlayer.play(UrlSource(episode.audioUrl),
        position: episode.progress.position.value);
    await _audioPlayer.seek(episode.progress.position.value);
    _currentEpisode = episode;
    notifyListeners();
  }

  Future<void> pause() async {
    currentEpisode!.progress.position.value =
        (await _audioPlayer.getCurrentPosition())!;
    ProgressService().saveProgress(currentEpisode!);
    await _audioPlayer.pause();
    notifyListeners();
  }

/*Future<void> stop() async {
    await _audioPlayer.stop();
  }*/

  // Future<void> resume() async {
  //   if (_currentEpisode != null) {
  //     await _audioPlayer.resume();
  //   }
  // }

  Future<void> seek(Duration position) async {
    currentEpisode!.progress.position.value = position;
    ProgressService().saveProgress(currentEpisode!);
    await _audioPlayer.seek(position);
    notifyListeners();
  }

  /*Future<void> reset() async {
    await _audioPlayer.stop();
    _currentEpisode = null;
    notifyListeners();
  }*/

  @override
  void dispose() {
    _playerStateSubscription?.cancel();
    _positionSubscription?.cancel();
    _audioPlayer.release();
    _audioPlayer.dispose();
    super.dispose();
  }
}
