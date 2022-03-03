import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import UserListItem from '../components/UserListItem';

const Friends = ({ navigation }) => {

    const [searchTxt, setSearchTxt] = useState('');
    const [users, setUsers] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Friends'
        })
    }, [navigation])

    useEffect(() => {
        
    })

  return (
    <View style={styles.container}>
        <Input 
        placeholder='Search'
        leftIcon={() =>
            <MaterialCommunityIcons name='account-search' size={30} color="#99A3A4" />
        }
        rightIcon={() =>
            <TouchableOpacity>
                <Ionicons name="search" size={30} color="#99A3A4" />
            </TouchableOpacity>
        }
        value={searchTxt}
        onChangeText={(text) => setSearchTxt(text.trim())}
        />

        <View>
            <UserListItem />
            <UserListItem />
        </View>
    </View>
  )
}

export default Friends;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 30,
        flex: 1
    }
})