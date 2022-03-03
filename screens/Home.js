import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect, useEffect, useState, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, Platform, TouchableOpacity, Image, StyleSheet } from 'react-native';
import CustomListItem from '../components/CustomListItem';
import { auth, db } from '../firebase';
import { registerForPushNotificationsAsync } from '../ExpoNotification';
import * as Notifications from 'expo-notifications';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { UserContext } from '../context/UserContext';
import Friends from './Friends';

const Tab = createMaterialTopTabNavigator();

export default function MyTabs({ navigation }) {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerLeft: () => 
                <View style={(Platform.OS == "web") ? {marginLeft: 17} : (Platform.OS != "ios") ? {marginRight: 10} : {marginRight: 0}, { flexDirection: 'row' , alignItems: 'center' }}>
                    <Image source={require('../assets/signal-96.png')} style={{ width: 20, height: 20}} />
                    <Text style={{ color: '#fff', marginLeft: 10, fontSize: 22}}>Babble</Text>
                </View>,
            headerRight: () =>
                <TouchableOpacity onPress={() => auth.signOut().then(() => navigation.replace('Login'))}>
                    <Text style={{ color: "#fff" }}>Logout</Text>
                </TouchableOpacity>
        })
    }, [navigation])

  return (
    <Tab.Navigator screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarIndicatorStyle: {
            backgroundColor: '#fefdfa',
            height: 5,
            borderRadius: 10,
        },
        tabBarIndicatorContainerStyle: {
            backgroundColor: '#2c6bed',
        },
        tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: 'bold'
        },
      }}>
      <Tab.Screen name="Home" component={Home} options={{
          tabBarBadge: () => <Text style={{
            color: "#2c6bed",
            backgroundColor: '#fff',
            width: 20,
            height: 20,
            borderRadius: 20,
            textAlign: 'center',
            fontWeight: 'bold'
          }}>2</Text>,
      }} />
      <Tab.Screen name="Friends" component={Friends} />
    </Tab.Navigator>
  );
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
});


const Home = ({ navigation }) => {

    const { user, saveUser } = useContext(UserContext);

    const [chats, setChats] = useState([]);

    const signOutUser = () => {
        auth.signOut().then(() => {
            saveUser(null);
            navigation.replace("Login");
        })
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chats',
            headerStyle: { backgroundColor: '#000'},
            headerStyle: {
                backgroundColor: '#2c6bed',
                shadowColor: 'transparent'
              },
        })
    }, [])

    useEffect(() => {
        registerForPushNotificationsAsync();
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => {
            setChats(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })

        return unsubscribe;
    }, [])
    

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', {
            id: id,
            chatName: chatName
        });
    }
    
    return (
        <SafeAreaView>
            <StatusBar style='light' />
            <ScrollView style={styles.container}>
            {
                chats.map(({id, data: {chatName}}) => (
                    <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat} />
                ))
            }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#fff'
    }
})