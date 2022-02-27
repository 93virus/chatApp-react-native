import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Platform, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import CustomListItem from '../components/CustomListItem';
import { auth, db } from '../firebase';
import { registerForPushNotificationsAsync, sendNotificationToAllUsers } from '../ExpoNotification';

const Home = ({ navigation }) => {

    const [chats, setChats] = useState([]);
    
    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace("Login");
        })
    }

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
    

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Babble',
            headerLeft: () => <View style={(Platform.OS == "web") ? {marginLeft: 17} : (Platform.OS != "ios") ? {marginRight: 10} : {marginRight: 0}}>
                <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                <Avatar
                    rounded
                    source={{ uri: auth?.currentUser?.photoURL }}    
                />
                </TouchableOpacity>
            </View>,
            headerRight: () =>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 80,
                marginRight: (Platform.OS == "web") ? 20 : 0
            }}>
                <TouchableOpacity activeOpacity={0.5}>
                    <AntDesign name="camerao" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('AddChat')}>
                    <SimpleLineIcons name="pencil" size={24} color="white" />
                </TouchableOpacity>
            </View>
        })
    }, [navigation])

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

export default Home;

const styles = StyleSheet.create({
    container: {
        height: '100%'
    }
})