import 'dart:convert';

import 'package:altogic_flutter_example/src/service/realtime.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/view/widgets/base_viewer.dart';
import 'package:altogic_flutter_example/src/view/widgets/button.dart';
import 'package:altogic_flutter_example/src/view/widgets/case.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/base.dart';
import 'package:altogic_flutter_example/src/view/widgets/documentation/code.dart';
import 'package:altogic_flutter_example/src/view/widgets/input.dart';
import 'package:flutter/material.dart';

import '../../widgets/documentation/texts.dart';
import '../database/cases.dart';

class RealtimePage extends StatefulWidget {
  const RealtimePage({Key? key}) : super(key: key);

  @override
  State<RealtimePage> createState() => _RealtimePageState();
}

///
/// - `echoMessages` -  This boolean parmeter enables or prevents realtime
/// messages originating from this connection being echoed back on the same
/// connection. By default messsages are echoed back.
/// - `bufferMessages` -  By default, any event emitted while the realtime
/// socket is not connected will be buffered until reconnection. You can turn
/// on/off the message buffering using this parameter. While enabling this
/// feature is useful in most cases (when the reconnection delay is short), it
/// could result in a huge spike of events when the connection is restored.
/// - `autoJoinChannels` -  This parameter enables or disables automatic join
/// to channels already subscribed in case of websocket reconnection. When
/// websocket is disconnected, it automatically leaves subscribed channels.
/// This parameter helps re-joining to already joined channels when the
/// connection is restored. If this parameter is set to false, you need to
/// listen to `connect` and `disconnect` events to manage your channel
/// subscriptions.

class _RealtimePageState extends State<RealtimePage> {
  RealtimeService service = RealtimeService();

  final widgets = [
    ConnectMethod.new,
    DisconnectMethod.new,
    OnMessage.new,
    BroadcastMethod.new,
    JoinChannel.new,
    LeaveChannel.new,
    SendMethod.new,
    UpdateUserData.new,
  ];

  _set() {
    setState(() {});
  }

  @override
  void initState() {
    service.realtime.onConnect((p0) {
      debugPrint("On connect : $p0");
      _set();
    });
    service.realtime.onDisconnect((p0) {
      debugPrint("On disconnect : $p0");
      _set();
    });

    WidgetsBinding.instance.addObserver(LifecycleEventHandler(
      detachedCallBack: () async {
        RealtimeService.of(context).realtime.close();
      },
    ));
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return InheritedService(
        service: service,
        child: BaseViewer(
          body: Column(
            children: [
              Container(
                width: double.infinity,
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                color:
                    service.realtime.isConnected() ? Colors.green : Colors.red,
                child: Text(
                  service.realtime.isConnected() ? "Connected" : "Disconnected",
                  style: const TextStyle(color: Colors.white),
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding:
                      const EdgeInsets.symmetric(vertical: 30, horizontal: 16),
                  child: Column(
                    children: [
                      const Documentation(children: [
                        Header('Realtime Manager'),
                        vSpace,
                        AutoSpan(
                            'The realtime manager allows realtime publish and subscribe (pub/sub)'
                            ' messaging through websockets.'
                            '\n\n'
                            'Realtime makes it possible to open a two-way interactive communication'
                            ' session between the user\'s device (e.g., browser, smartphone) and a server.'
                            ' With realtime, you can send messages to a server and receive event-driven'
                            ' responses without having to poll the server for a reply.'
                            '\n\n'
                            'The configuration parameters of the realtime module is specified when'
                            ' creating the Altogic client library instance. In particular three key'
                            ' parameters affect how realtime messaging works in your apps.'),
                        vSpace,
                      ]),
                      ...widgets.map((e) => MethodWidget(
                            create: e,
                            response: service.response,
                          ))
                    ],
                  ),
                ),
              ),
            ],
          ),
        ));
  }
}

class ConnectMethod extends MethodWrap {
  ConnectMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Open',
          onPressed: () {
            asyncWrapper(() async {
              RealtimeService.of(context).open();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const Description(
            'Manually open the realtime connection, connects the socket.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            const DartCode("""
altogic.realtime.open();
    """)
          ];

  @override
  String get name => "Open";
}

class DisconnectMethod extends MethodWrap {
  DisconnectMethod();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicButton(
          body: 'Close',
          onPressed: () {
            asyncWrapper(() async {
              RealtimeService.of(context).close();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const Description(
            'Manually closes the realtime connection. In this case, the socket '
            'will not try to reconnect.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            const DartCode("""
altogic.realtime.close();
    """)
          ];

  @override
  String get name => "Close";
}

class LiveWidget extends StatefulWidget {
  const LiveWidget({Key? key}) : super(key: key);

  @override
  State<LiveWidget> createState() => _LiveWidgetState();
}

class _LiveWidgetState extends State<LiveWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    );
    _controller.repeat();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
        animation: _controller,
        builder: (context, v) {
          return Container(
            width: 20,
            height: 20,
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(_controller.value),
              shape: BoxShape.circle,
            ),
          );
        });
  }
}

class MessageArea extends StatelessWidget {
  final List<Map<String, dynamic>> messages;

  const MessageArea({super.key, required this.messages, required this.event});

  final String event;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const LiveWidget(),
              const SizedBox(
                width: 30,
              ),
              Text('Event : $event'),
            ],
          ),
          Text('Message Count: ${messages.length}'),
          const Text('Messages: '),
          if (messages.isNotEmpty)
            Container(
              decoration: BoxDecoration(
                  border: Border.all(), borderRadius: BorderRadius.circular(0)),
              height: 400,
              child: ListView.builder(
                itemCount: messages.length,
                itemBuilder: (c, i) {
                  return Text(
                      const JsonEncoder.withIndent('  ').convert(messages[i]));
                },
                reverse: true,
              ),
            )
          else
            const Text('No messages')
        ],
      ),
    );
  }
}

class OnMessage extends MethodWrap {
  OnMessage();

  final TextEditingController nameController = TextEditingController();
  String? listener;
  final ValueNotifier<int> messageCount = ValueNotifier<int>(0);
  final List<Map<String, dynamic>> messages = [];

  onMessage(p0) {
    messages.insert(0, p0);
    messageCount.value++;
  }

  @override
  List<Widget> children(BuildContext context) {
    return [
      (listener == null)
          ? Column(
              children: [
                AltogicInput(
                    hint: 'Event Name', editingController: nameController),
                vSpace.doc(context),
                AltogicButton(
                    body: 'On Message',
                    listenable: nameController,
                    enabled: () => nameController.text.isNotEmpty,
                    onPressed: () {
                      asyncWrapper(() async {
                        RealtimeService.of(context)
                            .on(nameController.text, onMessage);
                        listener = nameController.text;
                        setState(() {});
                        var v = nameController.text;
                        WidgetsBinding.instance
                            .addObserver(LifecycleEventHandler(
                          detachedCallBack: () async {
                            RealtimeService.of(context).off(v, onMessage);
                            listener = null;
                          },
                        ));
                      });
                    }),
              ],
            )
          : AltogicButton(
              body: 'Off Message',
              onPressed: () {
                asyncWrapper(() async {
                  RealtimeService.of(context).off(
                    nameController.text,
                    onMessage,
                  );
                  messages.clear();
                  messageCount.value = 0;
                  listener = null;
                  setState(() {});
                });
              }),
      if (listener != null)
        ValueListenableBuilder(
          valueListenable: messageCount,
          builder: (c, v, w) {
            return MessageArea(
              messages: messages,
              event: listener!,
            );
          },
        )
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const Description(
            'Register a new listener function for the given event.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            DartCode("""
altogic.realtime.on("${nameController.text}", (data) {
  // do something with data
});
    """)
          ];

  @override
  String get name => "On Message";
}

class LifecycleEventHandler extends WidgetsBindingObserver {
  LifecycleEventHandler({this.resumeCallBack, this.detachedCallBack});

  final Future<void> Function()? resumeCallBack;
  final Future<void> Function()? detachedCallBack;

  @override
  Future<void> didChangeAppLifecycleState(AppLifecycleState state) async {
    switch (state) {
      case AppLifecycleState.inactive:
      case AppLifecycleState.paused:
      case AppLifecycleState.detached:
        await detachedCallBack?.call();
        break;
      case AppLifecycleState.resumed:
        await resumeCallBack?.call();
        break;
    }
  }
}

class BroadcastMethod extends MethodWrap {
  TextEditingController eventNameController = TextEditingController();
  TextEditingController messageController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Event Name', editingController: eventNameController),
      vSpace.doc(context),
      AltogicInput(hint: 'Message', editingController: messageController),
      vSpace.doc(context),
      AltogicButton(
          body: 'Broadcast',
          listenable: Listenable.merge([
            eventNameController,
            messageController,
          ]),
          enabled: () =>
              eventNameController.text.isNotEmpty &&
              messageController.text.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              RealtimeService.of(context)
                  .broadcast(eventNameController.text, messageController.text);
              messageController.clear();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Sends the message identified by the `eventName` to all connected members'
            ' of the app. All serializable datastructures are supported for the'
            ' `message`, including `Buffer`.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            DartCode("""
altogic.realtime.broadcast("${eventNameController.text}", "${messageController.text}");
    """)
          ];

  @override
  String get name => "Broadcast";
}

class SendMethod extends MethodWrap {
  TextEditingController eventNameController = TextEditingController();
  TextEditingController channelName = TextEditingController();
  TextEditingController messageController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Channel Name', editingController: channelName),
      vSpace.doc(context),
      AltogicInput(hint: 'Event Name', editingController: eventNameController),
      vSpace.doc(context),
      AltogicInput(hint: 'Message', editingController: messageController),
      vSpace.doc(context),
      AltogicButton(
          body: 'Broadcast to Channel',
          listenable: Listenable.merge([
            eventNameController,
            messageController,
            channelName,
          ]),
          enabled: () =>
              eventNameController.text.isNotEmpty &&
              messageController.text.isNotEmpty &&
              channelName.text.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              RealtimeService.of(context).send(channelName.text,
                  eventNameController.text, messageController.text);
              messageController.clear();
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Sends the message identified by the `eventName` to the provided channel'
            ' members only. All serializable datastructures are supported for the'
            ' `message`, including `Buffer`.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            DartCode("""
altogic.realtime.send("${channelName.text}", "${eventNameController.text}", "${messageController.text}");
    """)
          ];

  @override
  String get name => "Send";
}

class JoinChannel extends MethodWrap {
  TextEditingController channelNameController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((timeStamp) {});

    return [
      AltogicInput(
          hint: 'Channel Name', editingController: channelNameController),
      AltogicButton(
          body: 'Join',
          listenable: channelNameController,
          enabled: () => channelNameController.text.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              RealtimeService.of(context).join(channelNameController.text);

              setState(() {});
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Adds the realtime socket to the specified channel. As a result of this'
            ' action a `channel:join` event is sent to all members of the channel'
            ' notifying the new member arrival.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            DartCode("""
altogic.realtime.join("${channelNameController.text}");
    """)
          ];

  @override
  String get name => "Join Channel";
}

class LeaveChannel extends MethodWrap {
  TextEditingController channelNameController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(
          hint: 'Channel Name', editingController: channelNameController),
      AltogicButton(
          body: 'Leave',
          listenable: channelNameController,
          enabled: () => channelNameController.text.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              RealtimeService.of(context).leave(channelNameController.text);
              setState(() {});
            });
          })
    ];
  }

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Removes the realtime socket from the specified channel. As a result of'
            ' this action a `channel:leave` event is sent to all members of the channel'
            ' notifying the departure of existing member.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            DartCode("""
altogic.realtime.leave("${channelNameController.text}");
    """)
          ];

  @override
  String get name => "Leave Channel";
}

// class GetMembers extends MethodWrap {
//   TextEditingController channelNameController = TextEditingController();
//
//   @override
//   List<Widget> children(BuildContext context) {
//     return [
//       AltogicInput(
//           hint: 'Channel Name', editingController: channelNameController),
//       AltogicButton(
//           body: 'Get Members',
//           listenable: channelNameController,
//           enabled: () => channelNameController.text.isNotEmpty,
//           onPressed: () {
//             asyncWrapper(() async {
//               RealtimeService.of(context)
//                   .getMembers(channelNameController.text);
//             });
//           })
//     ];
//   }
//
//   @override
//   List<DocumentationObject> get description => [
//         const Description('Get members of channel'),
//       ];
//
//   @override
//   List<DocumentationObject> Function(BuildContext context)?
//       get documentationBuilder => null;
//
//   @override
//   String get name => "Get Members";
// }

class UpdateUserData extends MethodWrap {
  TextEditingController dataController = TextEditingController();

  @override
  List<Widget> children(BuildContext context) {
    return [
      AltogicInput(hint: 'Data', editingController: dataController),
      AltogicButton(
          body: 'Update User Data',
          listenable: dataController,
          enabled: () => dataController.text.isNotEmpty,
          onPressed: () {
            asyncWrapper(() async {
              RealtimeService.of(context).updateUserData(dataController.text);
            });
          })
    ];
  }

  var r =
      'Update the current realtime socket member data and broadcast an update'
      ' event to each joined channel so that other channel members can get the'
      ' information about the updated member data. Whenever the socket joins a'
      ' new channel, this updated member data will be broadcasted to channel'
      ' members. As a result of this action a `channel:update` event is sent to'
      ' all members of the subscribed channels notifying the member data update.'
      ''
      'As an example if you are developing a realtime chat application it might'
      ' be a good idea to store the username and user profile picture URL in'
      ' member data so that joined chat channels can get updated user information.';

  @override
  List<DocumentationObject> get description => [
        const AutoSpan(
            'Update the current realtime socket member data and broadcast an update'
            ' event to each joined channel so that other channel members can get the'
            ' information about the updated member data. Whenever the socket joins a'
            ' new channel, this updated member data will be broadcasted to channel'
            ' members. As a result of this action a `channel:update` event is sent to'
            ' all members of the subscribed channels notifying the member data update.'),
      ];

  @override
  List<DocumentationObject> Function(BuildContext context)?
      get documentationBuilder => (c) => [
            ...description,
            vSpace,
            const AutoSpan(
                'As an example if you are developing a realtime chat application it might'
                ' be a good idea to store the username and user profile picture URL in'
                ' member data so that joined chat channels can get updated user information.'),
            vSpace,
            LeftSpace.enforceSession,
            vSpace,
            DartCode("""
altogic.realtime.updateProfile(MemberData(
        id: ${currentUser.user.id},
        data: {'name': ${currentUser.user.name}, 'data': ${dataController.text}));
    """)
          ];

  @override
  String get name => "Update User Data";
}
