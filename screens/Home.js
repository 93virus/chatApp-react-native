import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, Platform, TouchableOpacity } from 'react-native';
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { Avatar } from 'react-native-elements';
import CustomListItem from '../components/CustomListItem';
import { auth } from '../firebase';

const Home = ({ navigation }) => {

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace("Login");
        })
    }

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
                <TouchableOpacity activeOpacity={0.5}>
                    <SimpleLineIcons name="pencil" size={24} color="white" />
                </TouchableOpacity>
            </View>
        })
    }, [navigation])

    return (
        <SafeAreaView>
            <StatusBar style='light' />
            <ScrollView>
                <CustomListItem />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home;