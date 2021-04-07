import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

const getIgAppAccountUrl = (username: string): string => `instagram://user?username=${username}`;
const getIgWebAccountUrl = (username: string): string => `https://www.instagram.com/${username}`;

export async function openExternalIgAccount(username: string): Promise<void> {
  const appUrl = getIgAppAccountUrl(username);
  const webUrl = getIgWebAccountUrl(username);
  try {
    const supported = await Linking.canOpenURL(getIgAppAccountUrl(username));
    Linking.openURL(supported ? appUrl : webUrl);
  } catch (err) {
    Alert.alert('Не удалось открыть Instagram');
  }
}
