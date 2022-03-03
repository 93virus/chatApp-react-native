import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react'

const UserListItem = () => {
    
    const [requestSent, setRequestSent] = useState(false);

  return (
    <ListItem bottomDivider>
        <Avatar 
        rounded
        source={{
            uri: "https://avatars.githubusercontent.com/u/12928248?v=4"
        }}
        placeholderStyle="transparent"
        size={35}
        rightComponent={
            <View>
                <Text>Hello</Text>
            </View>
        }
        />
        <ListItem.Content>
            <ListItem.Title>Mohit Kumawat</ListItem.Title>
            <ListItem.Subtitle>Gaitonde</ListItem.Subtitle>
        </ListItem.Content>
        <TouchableOpacity onPress={() => setRequestSent(!requestSent)}>
            {(!requestSent) ? (
                <Ionicons name="md-person-add" size={30} color="#99A3A4" />
            ) : (
                <MaterialIcons name="pending" size={30} color="#2c6bed" />
            )}
        </TouchableOpacity>
    </ListItem>
  )
}

export default UserListItem

const styles = StyleSheet.create({})