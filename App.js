import { Alert, Platform, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import * as Updates from 'expo-updates';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Chat from './screens/Chat';
import './firebase';
import { sendLocalNotification } from './ExpoNotification';
import MyTabs from './screens/Home';
import UserContextProvider from './context/UserContext';
import Friends from './screens/Friends';

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#2C6BED" },
  headerTitleStyle: { color: "#fff" },
  headerTintColor: "#fff",
  headerShadowVisible: false
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {

  useEffect(() => {
    if (Platform.OS != 'web') {
      reactToUpdates();
    }
  })

  const reactToUpdates = async () => {
    Updates.addListener((event) => {
      if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        Alert.alert("Reload", "Reload the app to automatically update!", [
          {
            text: "Later",
            style: "cancel"
          },
          {
            text: "Reload",
            onPress: () => {
              sendLocalNotification({title: "Hurray! Babble is Updated..", body: ""});
              Updates.reloadAsync()
            }
          }
        ]);
      }
    })
  }

  return (
    <UserContextProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='MyTabs' component={MyTabs} />
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Friends' component={Friends} />
        <Stack.Screen name='Chat' component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
    </UserContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
