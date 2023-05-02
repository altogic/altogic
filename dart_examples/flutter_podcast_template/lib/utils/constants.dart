class Constants {
  static const String appName = "Podcast App";
  static const String apiUrl =
      "https://c3-na.altogic.com/e:643d5f8dd21be6bdc5e77aef";
  static const String googleClientId = "your_google_client_id";
  static const String spotifyClientId = "your_spotify_client_id";
  static const String homeRoute = '/home';
  static const String loginRoute = '/login';
  static const String signupRoute = '/signup';
  static const String profileRoute = '/profile';
  static const String splashRoute = '/splash';
  static final emailRegExp = RegExp(r"^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
  static final name = RegExp(r"^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");
}
