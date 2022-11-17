import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {
  constructor() {
    this.KEY_AUTH = '@auth';
    this.KEY_SESSION = '@session';
  }

  set = async (key, value) => {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  };

  get = async (key) => {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  };

  remove = async (key) => {
    await AsyncStorage.removeItem(key);
  };
}

export default new Storage();
