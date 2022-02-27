import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { Input, Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../firebase';

const AddChat = ({ navigation }) => {

    const [input, setInput] = useState('');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add a new Chat',
            headerBackTitle: 'chats'
        })
    }, [])

    const createChat = async () => {
        await db.collection('chats').add({
            chatName: input
        }).then(() => {
            navigation.goBack()
        }).catch(err => {
            Alert.alert("Error", err.message)
        })
    }

  return (
    <View style={styles.container}>
      <Input
      placeholder='Enter a chat name'
      value={input}
      onChangeText={(text) => setInput(text)}
      leftIcon={
          <MaterialCommunityIcons name='chat-plus' size={24} color="#99A3A4" />
      }
      style={{ outlineStyle: 'none' }}
      />
      <Button onPress={createChat} title='Create a new chat' buttonStyle={{ backgroundColor: '#2c6bed' }} />
    </View>
  )
}

export default AddChat;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 30,
        flex: 1
    }
})