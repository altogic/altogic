import 'dart:ui';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:string_scanner/string_scanner.dart';

// NOTICE:
// The codes on this page are from the dart_code_viewer2 package on pub.dev.
// The package is not used through dependencies in order to reshape it according to needs.
// Thanks to github.com/verkit

/// A code viewer for the dart language.
///
/// A code viewer can be used to display dart code. By default the [DartCodeViewer]
/// gives you a Theme based code view. If you are using a [ThemeMode] that is light
/// than you will get the light option. Note that the default background of the code
/// viewer is based off [ColorScheme.background].
///
/// Supplying a non-null [data] String is required as input.
///
/// Requires one of its ancestors to be a [Material] widget.
///
/// Requires one of its ancestors to be a [MediaQuery] widget. Typically, these
/// are introduced by the [MaterialApp] or [WidgetsApp] widget at the top of
/// your application widget tree.
///
/// {@tool dartpad --template=stateless_widget_scaffold}
///
/// ![A dart_code_viewer example for light mode.]
/// (https://github.com/JoseAlba/dart_code_viewer/images/import_example)
///
/// Here is an example of a small string that shows up as Dart code in a flutter
/// application.
///
/// ```dart
/// @override
/// Widget build(BuildContext context) {
///   return DartCodeViewer(r'class DartCodeViewer extends StatelessWidget {}');
/// }
/// ```
/// {@end-tool}
///
/// See also:
///  * [DartCodeViewerTheme] and [DartCodeViewerThemeData] for information about
///  controlling the visual appearance of the DartCodeViewer.
///  * [Code viewer online tool](https://romannurik.github.io/SlidesCodeHighlighter/)
///  is a useful tool that lets you choose the color for each different style.
///  On the left side you put your example code and on the right you can choose
///  the colors you want the code viewer to display.
///    background => backgroundColor
///    plain text => baseStyle
///    Punctuation => punctuationStyle
///    String, values => stringStyle
///    Keywords, tags => keywordStyle
///    Comments => commentStyle
///    Types => classStyle
///    Numbers => numberStyle
///    Declarations => constantStyle
///  * [MediaQuery], from which the default height and width factor is obtained.
class DartCodeViewer extends StatelessWidget {
  /// DartCodeViewer requires a [String] that will be the code shown within the
  /// code viewer. This should be dart code and it is preferable if you use a raw
  /// string by adding an r before the string.
  const DartCodeViewer(
    this.data, {
    Key? key,
    this.baseStyle,
    this.classStyle,
    this.commentStyle,
    this.constantStyle,
    this.keywordStyle,
    this.numberStyle,
    this.punctuationStyle,
    this.stringStyle,
    this.backgroundColor,
    this.copyButtonText,
    this.showCopyButton,
    this.height,
    this.width,
  }) : super(key: key);

  /// Create a DartCodeViewer based of one [TextStyle]. Optional [Color] parameters
  /// which change the TextStyle color for that highlighter type.
  ///
  /// The default [TextStyle] is [RobotoMono].
  ///
  /// Useful parameter when you want to use one [TextStyle].
  factory DartCodeViewer.textColor(
    String data, {
    TextStyle? textStyle,
    Color? baseColor,
    Color? classColor,
    Color? commentColor,
    Color? constantColor,
    Color? keywordColor,
    Color? numberColor,
    Color? punctuationColor,
    Color? stringColor,
    Color? backgroundColor,
    Text? copyButtonText,
    bool? showCopyButton,
    double? height,
    double? width,
  }) {
    return DartCodeViewer(
      data,
      baseStyle: textStyle?.copyWith(color: baseColor),
      classStyle: textStyle?.copyWith(color: classColor),
      commentStyle: textStyle?.copyWith(color: commentColor),
      constantStyle: textStyle?.copyWith(color: constantColor),
      keywordStyle: textStyle?.copyWith(color: keywordColor),
      numberStyle: textStyle?.copyWith(color: numberColor),
      punctuationStyle: textStyle?.copyWith(color: punctuationColor),
      stringStyle: textStyle?.copyWith(color: stringColor),
      backgroundColor: backgroundColor,
      copyButtonText: copyButtonText,
      showCopyButton: showCopyButton,
      height: height,
      width: width,
    );
  }

  /// Common code viewer highlighter for [ThemeMode.light].
  factory DartCodeViewer.light(String data) {
    return DartCodeViewer.textColor(
      data,
      baseColor: Colors.blueGrey.shade800,
      classColor: Colors.purple.shade500,
      commentColor: Colors.pink.shade600,
      constantColor: Colors.indigo.shade500,
      keywordColor: Colors.indigo.shade500,
      numberColor: Colors.red.shade700,
      punctuationColor: Colors.blueGrey.shade800,
      stringColor: Colors.green.shade700,
      backgroundColor: Colors.grey.shade100,
    );
  }

  /// Code viewer light alternative for [ThemeMode.light].
  factory DartCodeViewer.lightAlt(String data) {
    return DartCodeViewer.textColor(
      data,
      baseColor: Colors.black,
      classColor: const Color(0xFF673AB7),
      commentColor: const Color(0xFF999999),
      constantColor: const Color(0xFFE67C73),
      keywordColor: const Color(0xFF4285F4),
      numberColor: const Color(0xFFDB4437),
      punctuationColor: const Color(0xFFA3A3A3),
      stringColor: const Color(0xFF0F9D58),
      backgroundColor: const Color(0xFFEEEEEE),
    );
  }

  /// Common code viewer highlighter for [ThemeMode.dark].
  factory DartCodeViewer.dark(String data) {
    return DartCodeViewer.textColor(
      data,
      baseColor: Colors.blueGrey.shade50,
      classColor: Colors.purple.shade200,
      commentColor: Colors.pink.shade300,
      constantColor: Colors.yellow.shade700,
      keywordColor: Colors.cyan.shade300,
      numberColor: Colors.yellow.shade700,
      punctuationColor: Colors.blueGrey.shade50,
      stringColor: Colors.lightGreen.shade400,
      backgroundColor: Colors.grey.shade900,
    );
  }

  /// Code viewer dark alternative for [ThemeMode.dark].
  factory DartCodeViewer.darkAlt(String data) {
    return DartCodeViewer.textColor(
      data,
      baseColor: Colors.white,
      classColor: const Color(0xFFFF8A65),
      commentColor: const Color(0xFFAAAAAA),
      constantColor: const Color(0xFFE67C73),
      keywordColor: const Color(0xFF7BAAF7),
      numberColor: const Color(0xFFF4B400),
      punctuationColor: const Color(0xFFA3A3A3),
      stringColor: const Color(0xFF57BB8A),
      backgroundColor: const Color(0xFF000000),
    );
  }

  /// Code viewer highlighter with a great dark design for [ThemeMode.dark].
  factory DartCodeViewer.designDark(String data) {
    return DartCodeViewer.textColor(
      data,
      baseColor: Colors.white,
      classColor: const Color(0xFFFF8A80),
      commentColor: const Color(0xFF607D8B),
      constantColor: const Color(0xFF90A4AE),
      keywordColor: const Color(0xFF26C6DA),
      numberColor: const Color(0xFFFFBC00),
      punctuationColor: const Color(0xFF90A4AE),
      stringColor: const Color(0xFF00BFA4),
      backgroundColor: const Color(0xFF263238),
    );
  }

  /// Code viewer highlighter for Google IO 2017.
  factory DartCodeViewer.io17(String data) {
    return DartCodeViewer.textColor(
      data,
      baseColor: Colors.white,
      classColor: const Color(0xFFFF8857),
      commentColor: const Color(0xFFFF5CB4),
      constantColor: const Color(0xFF90A4AE),
      keywordColor: const Color(0xFF00E4FF),
      numberColor: const Color(0xFFFFD500),
      punctuationColor: const Color(0xFF90A4AE),
      stringColor: const Color(0xFF1CE8b5),
      backgroundColor: const Color(0xFF263238),
    );
  }

  /// Code viewer highlighter for Google IO 2019.
  factory DartCodeViewer.io19(String data) {
    return DartCodeViewer.textColor(
      data,
      baseColor: Colors.white,
      classColor: const Color(0xFFEE675C),
      commentColor: const Color(0xFF9AA0A6),
      constantColor: const Color(0xFFFCC934),
      keywordColor: const Color(0xFF669DF6),
      numberColor: const Color(0xFFFCC934),
      punctuationColor: const Color(0xFF9AA0A6),
      stringColor: const Color(0xFF5BB974),
      backgroundColor: const Color(0xFF202124),
    );
  }

  /// Code viewer highlighter for Flutter Interact 2019.
  factory DartCodeViewer.flutterInteract19(String data) {
    return DartCodeViewer.textColor(
      data,
      baseColor: const Color(0xFFFAFBFB),
      classColor: const Color(0xFFD65BAD),
      commentColor: const Color(0xFF808080),
      constantColor: const Color(0xFFFF8383),
      keywordColor: const Color(0xFF1CDEC9),
      numberColor: const Color(0xFFBD93F9),
      punctuationColor: const Color(0xFF8BE9FD),
      stringColor: const Color(0xFFffa65c),
      backgroundColor: const Color(0xFF241e30),
    );
  }

  /// The string that is transformed into code. This is a required variable.
  final String data;

  /// The text style for the plain text in code.
  final TextStyle? baseStyle;

  /// The text style for the code types in the code.
  ///
  /// For example:
  /// * The class name.
  /// * StatelessWidget and StatefulWidget.
  final TextStyle? classStyle;

  /// The text style for the commented out code.
  final TextStyle? commentStyle;

  /// The text style for the constant style code.
  final TextStyle? constantStyle;

  /// The text style for keywords. For example:
  /// * else
  /// * enum
  /// * export
  /// * external
  /// * factory
  /// * false
  final TextStyle? keywordStyle;

  /// The text style for numbers within the code.
  final TextStyle? numberStyle;

  /// The text style for punctuation code like periods and commas.
  final TextStyle? punctuationStyle;

  /// The text style for Strings. For example the data when using the [Text] widget.
  final TextStyle? stringStyle;

  /// The background Color of the code. By default it is [Theme.of(context).colorScheme.background].
  final Color? backgroundColor;

  /// The text shown in the copy button by default it is 'COPY ALL'.
  final Text? copyButtonText;

  /// Shows copy button that lets user copy all the code as a raw string. By
  /// default the button is showing.
  final bool? showCopyButton;

  /// The height of the [DartCodeViewer] by default it uses the [MediaQuery.of(context).size.height]
  final double? height;

  /// The width of the [DartCodeViewer] by default it uses the [MediaQuery.of(context).size.width]
  final double? width;

  @override
  Widget build(BuildContext context) {
    final codeTextStyle = Theme.of(context).textTheme.bodyText1;

    final lightModeOn = Theme.of(context).brightness == Brightness.light;

    // These are defaults for the different types of text styles. The default
    // returns two different types of styles depending on the brightness of the
    // application.
    final defaultBaseStyle = codeTextStyle?.copyWith(
      color: lightModeOn ? Colors.blueGrey.shade800 : Colors.blueGrey.shade50,
    );
    final defaultClassStyle = codeTextStyle?.copyWith(
      color: lightModeOn ? Colors.purple.shade500 : Colors.purple.shade200,
    );
    final defaultCommentStyle = codeTextStyle?.copyWith(
      color: lightModeOn ? Colors.pink.shade600 : Colors.pink.shade300,
    );
    final defaultConstantStyle = codeTextStyle?.copyWith(
      color: lightModeOn ? Colors.indigo.shade500 : Colors.yellow.shade700,
    );
    final defaultKeywordStyle = codeTextStyle?.copyWith(
      color: lightModeOn ? Colors.indigo.shade500 : Colors.cyan.shade300,
    );
    final defaultNumberStyle = codeTextStyle?.copyWith(
      color: lightModeOn ? Colors.red.shade700 : Colors.yellow.shade700,
    );
    final defaultPunctuationalStyle = codeTextStyle?.copyWith(
      color: lightModeOn ? Colors.blueGrey.shade800 : Colors.blueGrey.shade50,
    );
    final defaultStringStyle = codeTextStyle?.copyWith(
      color: lightModeOn ? Colors.green.shade700 : Colors.lightGreen.shade400,
    );

    const defaultCopyButtonText = Icon(Icons.copy);
    const defaultShowCopyButton = true;

    var dartCodeViewerThemeData = DartCodeViewerTheme.of(context);
    dartCodeViewerThemeData = dartCodeViewerThemeData.copyWith(
      baseStyle:
          baseStyle ?? dartCodeViewerThemeData.baseStyle ?? defaultBaseStyle,
      classStyle:
          classStyle ?? dartCodeViewerThemeData.classStyle ?? defaultClassStyle,
      commentStyle: commentStyle ??
          dartCodeViewerThemeData.commentStyle ??
          defaultCommentStyle,
      constantStyle: constantStyle ??
          dartCodeViewerThemeData.constantStyle ??
          defaultConstantStyle,
      keywordStyle: keywordStyle ??
          dartCodeViewerThemeData.keywordStyle ??
          defaultKeywordStyle,
      numberStyle: numberStyle ??
          dartCodeViewerThemeData.numberStyle ??
          defaultNumberStyle,
      punctuationStyle: punctuationStyle ??
          dartCodeViewerThemeData.punctuationStyle ??
          defaultPunctuationalStyle,
      stringStyle: stringStyle ??
          dartCodeViewerThemeData.stringStyle ??
          defaultStringStyle,
      backgroundColor: backgroundColor ??
          dartCodeViewerThemeData.backgroundColor ??
          Theme.of(context).colorScheme.background,
      copyButtonText: copyButtonText ??
          dartCodeViewerThemeData.copyButtonText ??
          defaultCopyButtonText,
      showCopyButton: showCopyButton ??
          dartCodeViewerThemeData.showCopyButton ??
          defaultShowCopyButton,
      height: height ??
          dartCodeViewerThemeData.height ??
          MediaQuery.of(context).size.height,
      width: width ??
          dartCodeViewerThemeData.width ??
          MediaQuery.of(context).size.width,
    );

    return DartCodeViewerTheme(
      data: dartCodeViewerThemeData,
      child: Container(
        color: dartCodeViewerThemeData.backgroundColor,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        width: 500,
        constraints: const BoxConstraints(minHeight: 60),
        child: _DartCodeViewerPage(
          codifyString(data, dartCodeViewerThemeData),
        ),
      ),
    );
  }

  InlineSpan codifyString(
    String content,
    DartCodeViewerThemeData dartCodeViewerThemeData,
  ) {
    final textSpans = <TextSpan>[];
    final codeSpans = DartSyntaxPreHighlighter().format(content);
    // Converting CodeSpan to TextSpan by first converting to a string and then TextSpan.
    for (final span in codeSpans) {
      textSpans.add(stringToTextSpan(span.toString(), dartCodeViewerThemeData));
    }
    return TextSpan(children: textSpans);
  }

  TextSpan stringToTextSpan(
    String string,
    DartCodeViewerThemeData dartCodeViewerThemeData,
  ) {
    return TextSpan(
      style: () {
        final String? styleString =
            RegExp(r'codeStyle.\w*').firstMatch(string)?.group(0);
        final dartCodeViewerTheme = dartCodeViewerThemeData;

        switch (styleString) {
          case 'codeStyle.baseStyle':
            return dartCodeViewerTheme.baseStyle;
          case 'codeStyle.numberStyle':
            return dartCodeViewerTheme.numberStyle;
          case 'codeStyle.commentStyle':
            return dartCodeViewerTheme.commentStyle;
          case 'codeStyle.keywordStyle':
            return dartCodeViewerTheme.keywordStyle;
          case 'codeStyle.stringStyle':
            return dartCodeViewerTheme.stringStyle;
          case 'codeStyle.punctuationStyle':
            return dartCodeViewerTheme.punctuationStyle;
          case 'codeStyle.classStyle':
            return dartCodeViewerTheme.classStyle;
          case 'codeStyle.constantStyle':
            return dartCodeViewerTheme.constantStyle;
          default:
            return dartCodeViewerTheme.baseStyle;
        }
      }(),
      text: () {
        final textString = RegExp('\'.*\'').firstMatch(string)?.group(0);
        final subString = textString!.substring(1, textString.length - 1);
        return decodeString(subString);
      }(),
    );
  }

  /// Read raw string as regular String. Converts Unicode characters to actual
  /// numbers.
  String decodeString(String string) {
    return string
        .replaceAll(r'\u000a', '\n')
        .replaceAll(r'\u0027', '\'')
        .replaceAll(r'\u0009', '\t')
        .replaceAll(r'\u0022', '"');
  }
}

class _DartCodeViewerPage extends StatelessWidget {
  _DartCodeViewerPage(this.code);

  final InlineSpan code;

  final ValueNotifier<bool> hover = ValueNotifier(false);

  @override
  Widget build(BuildContext context) {
    final richTextCode = code;
    final plainTextCode = richTextCode.toPlainText();

    void showSnackBarOnCopySuccess(dynamic result) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Copied to Clipboard'),
        ),
      );
    }

    void showSnackBarOnCopyFailure(Object exception) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failure to copy to clipboard: $exception'),
        ),
      );
    }

    Widget res = MouseRegion(
      onEnter: (e) => hover.value = true,
      onExit: (e) => hover.value = false,
      child: Stack(
        children: [
          SizedBox(
            width: double.infinity,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: SizedBox(
                width: 500,
                child: RichText(
                  textDirection: TextDirection.ltr,
                  text: richTextCode,
                ),
              ),
            ),
          ),
          if (DartCodeViewerTheme.of(context).copyButtonText != null)
            Positioned(
                top: -5,
                right: -5,
                child: ValueListenableBuilder(
                    valueListenable: hover,
                    builder: (context, v, w) {
                      return Visibility(
                        maintainAnimation: true,
                        maintainState: true,
                        maintainInteractivity: true,
                        maintainSize: true,
                        visible: v,
                        child: IconButton(
                          icon: DartCodeViewerTheme.of(context).copyButtonText!,
                          onPressed: () {
                            Clipboard.setData(
                                    ClipboardData(text: plainTextCode))
                                .then(showSnackBarOnCopySuccess)
                                .catchError(showSnackBarOnCopyFailure);
                          },
                        ),
                      );
                    })),
        ],
      ),
    );
    return res;
  }
}

/// Holds the color, size, and text styles for a dart code viewer theme.
///
/// Use this class to configure a [DartCodeViewerThemeData] widget.
///
/// To obtain the current ambient dart code viewer theme, use [DartCodeViewerTheme.of].
///
/// The parts of the dart code viewer are:
/// * The 'data, which is the String that is supposed to be transformed into dart
/// highlighted code.
/// * The 'highlightedTextStyle' which the different type of highlighted code that
/// can be highlighted differently.
///
/// The simplest way to create a DartCodeThemeData is to use the [copyWith] on
/// the one you get from [DartCodeViewerTheme.of], or create an entirely new one
/// with [DartCodeViewerThemeData].
///
/// {@tool dartpad --template=stateless_widget_scaffold}
///
/// Here is an example of a small string that shows up as Dart code in a flutter
/// application. With [DartCodeViewerThemeData] applied
///
/// ```dart
/// @override
/// Widget build(BuildContext context) {
///   return DartCodeViewerTheme(
///     data: DartCodeViewerThemeData(
///       backgroundColor: Colors.pink,
///       child: DartCodeViewer(r'class DartCodeViewer extends StatelessWidget {}'),
///     );
///   );
/// }
/// ```
/// {@end-tool}
///
/// See also:
/// * [DartCodeViewerThemeData], which describes the actual configuration of a
/// [DartCodeViewerTheme]
///  * [Code viewer online tool](https://romannurik.github.io/SlidesCodeHighlighter/)
///  is a useful tool that lets you choose the color for each different style.
///  On the left side you put your example code and on the right you can choose
///  the colors you want the code viewer to display.
///    background => backgroundColor
///    plain text => baseStyle
///    Punctuation => punctuationStyle
///    String, values => stringStyle
///    Keywords, tags => keywordStyle
///    Comments => commentStyle
///    Types => classStyle
///    Numbers => numberStyle
///    Declarations => constantStyle
@immutable
class DartCodeViewerThemeData with Diagnosticable {
  const DartCodeViewerThemeData({
    this.baseStyle,
    this.classStyle,
    this.commentStyle,
    this.constantStyle,
    this.keywordStyle,
    this.numberStyle,
    this.punctuationStyle,
    this.stringStyle,
    this.backgroundColor,
    this.copyButtonText,
    this.showCopyButton,
    this.height,
    this.width,
    this.buttonStyle,
  });

  /// The text style for the plain text in code.
  final TextStyle? baseStyle;

  /// The text style for the code types in the code.
  ///
  /// For example:
  /// * The class name.
  /// * StatelessWidget and StatefulWidget.
  final TextStyle? classStyle;

  /// The text style for the commented out code.
  final TextStyle? commentStyle;

  /// The text style for the constant style code.
  final TextStyle? constantStyle;

  /// The text style for keywords. For example:
  /// * else
  /// * enum
  /// * export
  /// * external
  /// * factory
  /// * false
  final TextStyle? keywordStyle;

  /// The text style for numbers within the code.
  final TextStyle? numberStyle;

  /// The text style for punctuation code like periods and commas.
  final TextStyle? punctuationStyle;

  /// The text style for Strings. For example the data when using the [Text] widget.
  final TextStyle? stringStyle;

  /// The background Color of the code. By default it is [Theme.of(context).colorScheme.background].
  final Color? backgroundColor;

  /// The text shown in the copy button by default it is 'COPY ALL'.
  final Widget? copyButtonText;

  /// Shows copy button that lets user copy all the code as a raw string. By
  /// default the button is showing.
  final bool? showCopyButton;

  /// The height of the [DartCodeViewer] by default it uses the [MediaQuery.of(context).size.height]
  final double? height;

  /// The width of the [DartCodeViewer] by default it uses the [MediaQuery.of(context).size.width]
  final double? width;

  /// The buttonThemeData for the [DartCodeViewer]. Useful if you want the copy
  /// button to appear differently than the default.
  final ButtonStyle? buttonStyle;

  /// Creates a copy of this object but with the given fields replaced with the
  /// new values.
  DartCodeViewerThemeData copyWith({
    TextStyle? baseStyle,
    TextStyle? classStyle,
    TextStyle? commentStyle,
    TextStyle? constantStyle,
    TextStyle? keywordStyle,
    TextStyle? numberStyle,
    TextStyle? punctuationStyle,
    TextStyle? stringStyle,
    Color? backgroundColor,
    Widget? copyButtonText,
    bool? showCopyButton,
    double? height,
    double? width,
    ButtonStyle? buttonStyle,
  }) {
    return DartCodeViewerThemeData(
      baseStyle: baseStyle ?? this.baseStyle,
      classStyle: classStyle ?? this.classStyle,
      commentStyle: commentStyle ?? this.commentStyle,
      constantStyle: constantStyle ?? this.constantStyle,
      keywordStyle: keywordStyle ?? this.keywordStyle,
      numberStyle: numberStyle ?? this.numberStyle,
      punctuationStyle: punctuationStyle ?? this.punctuationStyle,
      stringStyle: stringStyle ?? this.stringStyle,
      backgroundColor: backgroundColor ?? this.backgroundColor,
      copyButtonText: copyButtonText ?? this.copyButtonText,
      showCopyButton: showCopyButton ?? this.showCopyButton,
      height: height ?? this.height,
      width: width ?? this.width,
    );
  }

  /// Linearly interpolate between two dart code viewer themes.
  ///
  /// The arguments must not be null.
  static DartCodeViewerThemeData lerp(
    DartCodeViewerThemeData a,
    DartCodeViewerThemeData b,
    double t,
  ) {
    return DartCodeViewerThemeData(
      baseStyle: TextStyle.lerp(a.baseStyle, b.baseStyle, t),
      classStyle: TextStyle.lerp(a.classStyle, b.classStyle, t),
      commentStyle: TextStyle.lerp(a.commentStyle, b.commentStyle, t),
      constantStyle: TextStyle.lerp(a.constantStyle, b.constantStyle, t),
      keywordStyle: TextStyle.lerp(a.keywordStyle, b.keywordStyle, t),
      numberStyle: TextStyle.lerp(a.numberStyle, b.numberStyle, t),
      punctuationStyle: TextStyle.lerp(
        a.punctuationStyle,
        b.punctuationStyle,
        t,
      ),
      stringStyle: TextStyle.lerp(a.stringStyle, b.stringStyle, t),
      backgroundColor: Color.lerp(a.backgroundColor, b.backgroundColor, t),
      height: lerpDouble(a.height, b.height, t),
      width: lerpDouble(a.width, b.width, t),
    );
  }

  @override
  int get hashCode {
    return Object.hash(
      baseStyle,
      classStyle,
      commentStyle,
      constantStyle,
      keywordStyle,
      numberStyle,
      punctuationStyle,
      stringStyle,
      backgroundColor,
      copyButtonText,
      showCopyButton,
      height,
      width,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (runtimeType != other.runtimeType) {
      return false;
    }
    return other is DartCodeViewerThemeData &&
        baseStyle == other.baseStyle &&
        classStyle == other.classStyle &&
        commentStyle == other.commentStyle &&
        constantStyle == other.constantStyle &&
        keywordStyle == other.keywordStyle &&
        numberStyle == other.numberStyle &&
        punctuationStyle == other.punctuationStyle &&
        stringStyle == other.stringStyle &&
        backgroundColor == other.backgroundColor &&
        copyButtonText == other.copyButtonText &&
        showCopyButton == other.showCopyButton &&
        height == other.height &&
        width == other.width;
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties.add(
      DiagnosticsProperty<TextStyle>(
        'baseStyle',
        baseStyle,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<TextStyle>(
        'classStyle',
        classStyle,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<TextStyle>(
        'commentStyle',
        commentStyle,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<TextStyle>(
        'constantStyle',
        constantStyle,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<TextStyle>(
        'keywordStyle',
        keywordStyle,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<TextStyle>(
        'numberStyle',
        numberStyle,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<TextStyle>(
        'punctuationStyle',
        punctuationStyle,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<TextStyle>(
        'stringStyle',
        stringStyle,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<TextStyle>(
        'stringStyle',
        stringStyle,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<Color>(
        'backgroundColor',
        backgroundColor,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<Widget>(
        'copyButtonText',
        copyButtonText,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<bool>(
        'showCopyButton',
        showCopyButton,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<double>(
        'height',
        height,
        defaultValue: null,
      ),
    );
    properties.add(
      DiagnosticsProperty<double>(
        'width',
        width,
        defaultValue: null,
      ),
    );
  }
}

/// Applies a DartCodeViewerTheme to [DartCodeViewer].
///
/// The dart code viewer theme describes the color, size, and text styles for the
/// dart code viewer it is attached to.
///
/// Descendant widget obtains the current theme's [DartCodeViewerThemeData]
/// object using [DartCodeViewerTheme.of]. When a widget uses
/// [DartCodeViewerTheme.of], it is automatically rebuilt if the theme later
/// changes.
///
/// See also:
/// * [DartCodeViewer], a code viewer for the dart language.
/// * [DartCodeViewerThemeData], which describes the actual configuration of a
/// dart code viewer theme.
/// * [ThemeData], which describes the overall theme information for the
///    application.
class DartCodeViewerTheme extends InheritedTheme {
  /// Applies the given theme [data] to [child].
  ///
  /// The [data] and [child] arguments must not be null.
  const DartCodeViewerTheme({
    Key? key,
    required this.data,
    required Widget child,
  }) : super(key: key, child: child);

  /// Specifies the color, size, and text styles for the descendant dart code
  /// viewer widgets.
  final DartCodeViewerThemeData data;

  /// Returns the data from the closest [DartCodeViewerTheme] instances the
  /// encloses the given context.
  ///
  /// The default parameters is set within the [DartCodeViewer].
  ///
  /// {@tool dartpad --template=stateless_widget_scaffold}
  ///
  /// Here is an example of a small string that shows up as Dart code in a flutter
  /// application. With [DartCodeViewerThemeData] applied
  ///
  /// ```dart
  /// @override
  /// Widget build(BuildContext context) {
  ///   return DartCodeViewerTheme(
  ///     data: DartCodeViewerThemeData(
  ///       backgroundColor: Colors.pink,
  ///       child: DartCodeViewer(r'class DartCodeViewer extends StatelessWidget {}'),
  ///     );
  ///   );
  /// }
  /// ```
  /// {@end-tool}
  ///
  /// See also:
  /// * [DartCodeViewerThemeData], which describes the actual configuration of a
  /// [DartCodeViewerTheme]
  ///  * [Code viewer online tool](https://romannurik.github.io/SlidesCodeHighlighter/)
  ///  is a useful tool that lets you choose the color for each different style.
  ///  On the left side you put your example code and on the right you can choose
  ///  the colors you want the code viewer to display.
  ///    background => backgroundColor
  ///    plain text => baseStyle
  ///    Punctuation => punctuationStyle
  ///    String, values => stringStyle
  ///    Keywords, tags => keywordStyle
  ///    Comments => commentStyle
  ///    Types => classStyle
  ///    Numbers => numberStyle
  ///    Declarations => constantStyle
  static DartCodeViewerThemeData of(BuildContext context) {
    final dartCodeViewerTheme =
        context.dependOnInheritedWidgetOfExactType<DartCodeViewerTheme>();
    return dartCodeViewerTheme?.data ?? const DartCodeViewerThemeData();
  }

  @override
  Widget wrap(BuildContext context, Widget child) {
    final ancestorTheme =
        context.findAncestorWidgetOfExactType<DartCodeViewerTheme>();
    return identical(this, ancestorTheme)
        ? child
        : DartCodeViewerTheme(data: data, child: child);
  }

  @override
  bool updateShouldNotify(DartCodeViewerTheme oldWidget) =>
      data != oldWidget.data;
}

abstract class SyntaxPreHighlighter {
  List<CodeSpan> format(String src);
}

class DartSyntaxPreHighlighter extends SyntaxPreHighlighter {
  DartSyntaxPreHighlighter() {
    _spans = <_HighlightSpan>[];
  }

  static const List<String> _keywords = <String>[
    'abstract',
    'as',
    'assert',
    'async',
    'await',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'default',
    'deferred',
    'do',
    'dynamic',
    'else',
    'enum',
    'export',
    'external',
    'extends',
    'factory',
    'false',
    'final',
    'finally',
    'for',
    'get',
    'if',
    'implements',
    'import',
    'in',
    'is',
    'library',
    'new',
    'null',
    'operator',
    'part',
    'rethrow',
    'return',
    'set',
    'static',
    'super',
    'switch',
    'sync',
    'this',
    'throw',
    'true',
    'try',
    'typedef',
    'var',
    'void',
    'while',
    'with',
    'yield',
  ];

  static const List<String> _builtInTypes = <String>[
    'int',
    'double',
    'num',
    'bool',
  ];

  late String _src;
  late StringScanner _scanner;

  late List<_HighlightSpan> _spans;

  @override
  List<CodeSpan> format(String src) {
    _src = src;
    _scanner = StringScanner(_src);

    if (_generateSpans()) {
      // Successfully parsed the code
      final formattedText = <CodeSpan>[];
      var currentPosition = 0;

      for (final span in _spans) {
        if (currentPosition != span.start) {
          formattedText.add(
            CodeSpan(
              text: _src.substring(currentPosition, span.start),
            ),
          );
        }

        formattedText.add(
          CodeSpan(
            type: span.type,
            text: span.textForSpan(_src),
          ),
        );

        currentPosition = span.end;
      }

      if (currentPosition != _src.length) {
        formattedText.add(
          CodeSpan(
            text: _src.substring(currentPosition, _src.length),
          ),
        );
      }

      return formattedText;
    } else {
      // Parsing failed, return with only basic formatting
      return [CodeSpan(type: HighlightType.base, text: src)];
    }
  }

  bool _generateSpans() {
    var lastLoopPosition = _scanner.position;

    while (!_scanner.isDone) {
      // Skip White space
      _scanner.scan(RegExp(r'\s+'));

      // Block comments
      if (_scanner.scan(RegExp(r'/\*(.|\n)*\*/'))) {
        _spans.add(_HighlightSpan(
          HighlightType.comment,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
        continue;
      }

      // Line comments
      if (_scanner.scan('//')) {
        final startComment = _scanner.lastMatch!.start;

        var eof = false;
        int endComment;
        if (_scanner.scan(RegExp(r'.*\n'))) {
          endComment = _scanner.lastMatch!.end - 1;
        } else {
          eof = true;
          endComment = _src.length;
        }

        _spans.add(_HighlightSpan(
          HighlightType.comment,
          startComment,
          endComment,
        ));

        if (eof) {
          break;
        }

        continue;
      }

      // Raw r"String"
      if (_scanner.scan(RegExp(r'r".*"'))) {
        _spans.add(_HighlightSpan(
          HighlightType.string,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
        continue;
      }

      // Raw r'String'
      if (_scanner.scan(RegExp(r"r'.*'"))) {
        _spans.add(_HighlightSpan(
          HighlightType.string,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
        continue;
      }

      // Multiline """String"""
      if (_scanner.scan(RegExp(r'"""(?:[^"\\]|\\(.|\n))*"""'))) {
        _spans.add(_HighlightSpan(
          HighlightType.string,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
        continue;
      }

      // Multiline '''String'''
      if (_scanner.scan(RegExp(r"'''(?:[^'\\]|\\(.|\n))*'''"))) {
        _spans.add(_HighlightSpan(
          HighlightType.string,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
        continue;
      }

      // "String"
      if (_scanner.scan(RegExp(r'"(?:[^"\\]|\\.)*"'))) {
        _spans.add(_HighlightSpan(
          HighlightType.string,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
        continue;
      }

      // 'String'
      if (_scanner.scan(RegExp(r"'(?:[^'\\]|\\.)*'"))) {
        _spans.add(_HighlightSpan(
          HighlightType.string,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
        continue;
      }

      // Double
      if (_scanner.scan(RegExp(r'\d+\.\d+'))) {
        _spans.add(_HighlightSpan(
          HighlightType.number,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
        continue;
      }

      // Integer
      if (_scanner.scan(RegExp(r'\d+'))) {
        _spans.add(
          _HighlightSpan(
            HighlightType.number,
            _scanner.lastMatch!.start,
            _scanner.lastMatch!.end,
          ),
        );
        continue;
      }

      // Punctuation
      if (_scanner.scan(RegExp(r'[\[\]{}().!=<>&\|\?\+\-\*/%\^~;:,]'))) {
        _spans.add(_HighlightSpan(
          HighlightType.punctuation,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
        continue;
      }

      // Meta data
      if (_scanner.scan(RegExp(r'@\w+'))) {
        _spans.add(_HighlightSpan(
          HighlightType.keyword,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
        continue;
      }

      // Words
      if (_scanner.scan(RegExp(r'\w+'))) {
        late HighlightType type;

        var word = _scanner.lastMatch![0];
        if (word!.startsWith('_')) {
          word = word.substring(1);
        }

        if (_keywords.contains(word)) {
          type = HighlightType.keyword;
        } else if (_builtInTypes.contains(word)) {
          type = HighlightType.keyword;
        } else if (_firstLetterIsUpperCase(word)) {
          type = HighlightType.klass;
        } else if (word.length >= 2 &&
            word.startsWith('k') &&
            _firstLetterIsUpperCase(word.substring(1))) {
          type = HighlightType.constant;
        } else {
          type = HighlightType.base;
        }

        _spans.add(_HighlightSpan(
          type,
          _scanner.lastMatch!.start,
          _scanner.lastMatch!.end,
        ));
      }

      // Check if this loop did anything
      if (lastLoopPosition == _scanner.position) {
        // Failed to parse this file, abort gracefully
        return false;
      }
      lastLoopPosition = _scanner.position;
    }

    _simplify();
    return true;
  }

  void _simplify() {
    for (var i = _spans.length - 2; i >= 0; i -= 1) {
      if (_spans[i].type == _spans[i + 1].type &&
          _spans[i].end == _spans[i + 1].start) {
        _spans[i] = _HighlightSpan(
          _spans[i].type,
          _spans[i].start,
          _spans[i + 1].end,
        );
        _spans.removeAt(i + 1);
      }
    }
  }

  bool _firstLetterIsUpperCase(String str) {
    if (str.isNotEmpty) {
      final first = str.substring(0, 1);
      return first == first.toUpperCase();
    }
    return false;
  }
}

enum HighlightType {
  number,
  comment,
  keyword,
  string,
  punctuation,
  klass,
  constant,
  base,
}

class _HighlightSpan {
  _HighlightSpan(this.type, this.start, this.end);

  final HighlightType type;
  final int start;
  final int end;

  String textForSpan(String src) {
    return src.substring(start, end);
  }
}

class CodeSpan {
  CodeSpan({this.type = HighlightType.base, required this.text});

  final HighlightType type;
  final String text;

  @override
  String toString() {
    return 'TextSpan('
        'style: codeStyle.${_styleNameOf(type)}, '
        "text: '${escape(text)}'"
        ')';
  }
}

String _styleNameOf(HighlightType type) {
  switch (type) {
    case HighlightType.number:
      return 'numberStyle';
    case HighlightType.comment:
      return 'commentStyle';
    case HighlightType.keyword:
      return 'keywordStyle';
    case HighlightType.string:
      return 'stringStyle';
    case HighlightType.punctuation:
      return 'punctuationStyle';
    case HighlightType.klass:
      return 'classStyle';
    case HighlightType.constant:
      return 'constantStyle';
    case HighlightType.base:
      return 'baseStyle';
  }
}

String escape(String text) {
  final escapedText = StringBuffer();

  for (final char in text.runes) {
    if (char < 0x20 ||
        char >= 0x7F ||
        char == 0x22 ||
        char == 0x24 ||
        char == 0x27 ||
        char == 0x5C) {
      if (char <= 0xffff) {
        escapedText.write('\\u${_encodeAndPad(char)}');
      } else {
        escapedText.write('\\u{${_encode(char)}}');
      }
    } else {
      escapedText.write(String.fromCharCode(char));
    }
  }

  return escapedText.toString();
}

String _encode(int charCode) {
  return charCode.toRadixString(16);
}

String _encodeAndPad(int charCode) {
  final encoded = _encode(charCode);
  return '0' * (4 - encoded.length) + encoded;
}
