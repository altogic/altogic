import 'package:altogic/altogic.dart';
import 'package:altogic_flutter_example/main.dart';
import 'package:altogic_flutter_example/src/service/service_base.dart';
import 'package:altogic_flutter_example/src/view/pages/database/cases.dart';
import 'package:flutter/material.dart';

class RealtimeService extends ServiceBase {
  static RealtimeService of(BuildContext context) {
    return InheritedService.of<RealtimeService>(context);
  }

  RealtimeManager get realtime => altogic.realtime;

  Future<void> open() async {
    realtime.open();
  }

  Future<void> close() async {
    realtime.close();
  }

  void on(String event, Function(dynamic) callback) {
    realtime.on(event, callback);
    response.message('on $event');
  }

  void off(String event, Function(dynamic) callback) {
    realtime.off(event, callback);
    response.message('off $event');
  }

  void broadcast(String event, dynamic data) {
    realtime.broadcast(event, data);
    response.message("Sent to $event");
  }

  void send(String channel, String event, dynamic data) {
    realtime.send(channel, event, data);
    response.message("Sent message to $event only $channel members");
  }

  void join(String room) {
    realtime.join(room);
    response.message("Joined $room");
  }

  void leave(String room) {
    realtime.leave(room);
    response.message("Left $room");
  }

  // void getMembers(String room) async {
  //   var res = await realtime.getMembers(room);
  //   response.message("Members of $room : \n$res");
  // }

  void updateUserData(String data) async {
    realtime.updateProfile(MemberData(
        id: currentUser.user.id,
        data: {'name': currentUser.user.name, 'data': data}));
    response.message("Updated user data");
  }

  void message() {}
}
