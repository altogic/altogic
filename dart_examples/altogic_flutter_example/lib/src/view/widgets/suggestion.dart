import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/texts.dart';
import 'package:flutter/material.dart';

class BasicSuggestions extends StatefulWidget {
  const BasicSuggestions(
      {super.key,
      required this.values,
      required this.onSelected,
      this.title = "Expression Suggestions"});

  final List<String> values;
  final void Function(String value) onSelected;
  final String title;

  @override
  State<BasicSuggestions> createState() => _BasicSuggestionsState();

  static String _getValue({required String valueName, required bool string}) {
    return string ? '"$valueName"' : valueName;
  }

  static List<String> equalitySuggestions(String fieldName,
      {String valueName = 'value', bool string = false}) {
    var value = _getValue(valueName: valueName, string: string);
    return <String>[
      '$fieldName == $value',
      '$fieldName != $value',
    ];
  }

  static List<String> comparisonSuggestions(String fieldName,
      {String valueName = 'value',
      bool string = false,
      bool includeEqual = true}) {
    var value = _getValue(valueName: valueName, string: string);
    return <String>[
      '$fieldName > $value',
      if (includeEqual) '$fieldName >= $value',
      '$fieldName < $value',
      if (includeEqual) '$fieldName <= $value',
    ];
  }

  static List<String> stringMethodsSuggestions(String fieldName,
      {String valueName = 'value'}) {
    var value = _getValue(valueName: valueName, string: true);
    return <String>[
      'STARTSWITH($fieldName, $value)',
      'ENDSWITH($fieldName, $value)',
      'INCLUDES($fieldName, $value)',
    ];
  }

  static String arrayIn(String fieldName, {String valueName = 'value'}) {
    var value = _getValue(valueName: valueName, string: true);
    return 'IN($fieldName, $value)';
  }

  static const List<String> logicalOperators = <String>[' && ', ' || '];
}

class _BasicSuggestionsState extends State<BasicSuggestions> {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
        width: double.infinity,
        child: Column(
          children: [
            vSpace.doc(context),
            Header(widget.title, level: 3).doc(context),
            vSpace.doc(context),
            Wrap(
              runSpacing: 10,
              spacing: 10,
              children: widget.values
                  .map((e) => ActionChip(
                      label: Text(e), onPressed: () => widget.onSelected(e)))
                  .toList(),
            ),
            const SizedBox(
              height: 10,
            ),
          ],
        ));
  }
}
