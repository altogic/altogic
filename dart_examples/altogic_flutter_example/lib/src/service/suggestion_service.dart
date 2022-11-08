import 'package:flutter/material.dart';

class SuggestionService {
  List<Map<String, dynamic>> values = [];

  bool hasMore = true;

  int page = 1;

  int limit = 10;

  void getSuggestions(
      Future<List<Map<String, dynamic>>?> Function(int limit, int page) fetcher,
      StateSetter setter) async {
    var res = await fetcher(limit, page);
    if (res != null) {
      if (res.isEmpty) {
        page--;
        hasMore = false;
      } else {
        values.clear();
        values.addAll(res);
        hasMore = res.length == limit;
      }

      setter(() {});
    }
  }

  List<Widget> getWidget(
      BuildContext context,
      Future<List<Map<String, dynamic>>?> Function(int limit, int page) fetcher,
      String Function(Map<String, dynamic> map) builder,
      StateSetter setter,
      void Function(String id) onIdSelected) {
    return [
      if (values.isNotEmpty)
        SizedBox(
          width: MediaQuery.of(context).size.width,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              if (page > 1)
                IconButton(
                    onPressed: () {
                      page--;
                      getSuggestions(fetcher, setter);
                    },
                    icon: const Icon(Icons.arrow_back_ios_new)),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                        alignment: Alignment.center,
                        width: MediaQuery.of(context).size.width,
                        child: const Text(
                            'Tap to fill id field or type it manually')),
                    const SizedBox(height: 10),
                    Wrap(
                      runSpacing: 10,
                      spacing: 10,
                      crossAxisAlignment: WrapCrossAlignment.start,
                      runAlignment: WrapAlignment.start,
                      alignment: WrapAlignment.start,
                      children: [
                        for (var value in values)
                          ActionChip(
                            label: Text(builder(value)),
                            onPressed: () {
                              onIdSelected(value['_id'] as String);
                              setter(() {});
                            },
                          )
                      ],
                    ),
                  ],
                ),
              ),
              if (hasMore)
                IconButton(
                    onPressed: () {
                      page++;
                      getSuggestions(fetcher, setter);
                    },
                    icon: const Icon(Icons.arrow_forward_ios)),
            ],
          ),
        )
    ];
  }
}
