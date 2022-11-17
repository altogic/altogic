import { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import altogic from '../configs/altogic';
import { useAuthContext } from '../contexts/Auth.context';

function Sessions() {
  const { session } = useAuthContext();
  const [sessions, setSessions] = useState([]);

  const getAllSessions = async () => {
    const { sessions: sessionList } = await altogic.auth.getAllSessions();
    const formattedSessions = sessionList?.map((s) =>
      s.token === session?.token ? { ...s, isCurrent: true } : s
    );
    setSessions(formattedSessions || []);
  };

  const logoutSession = async (selectedSession) => {
    const { errors } = await altogic.auth.signOut(selectedSession.token);
    if (!errors) {
      setSessions(sessions.filter((s) => s.token !== selectedSession.token));
    }
  };

  useEffect(() => {
    getAllSessions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>All Sessions</Text>
      <View>
        {sessions?.map((sessionItem) => (
          <View key={sessionItem.token} style={styles.itemContainer}>
            <View style={styles.flex}>
              {sessionItem.isCurrent && <Text> Current Session </Text>}
              <Text>
                {' '}
                <Text>Device name: </Text>
                {sessionItem?.userAgent.device.family}
              </Text>
            </View>
            <View style={styles.itemDate}>
              <Text>{new Date(sessionItem.creationDtm).toLocaleDateString('en-US')}</Text>
              {!sessionItem.isCurrent && (
                <Button onPress={() => logoutSession(sessionItem)} title="X" />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 12,
    marginTop: 12
  },
  text: {
    width: '100%',
    textAlign: 'center',
    fontSize: 25
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flex: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemDate: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});

export default Sessions;
