import { StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { auth, db } from '../firebase';

const CustomListItem = ({ id, chatName, enterChat }) => {

  const [chatMessage, setChatMessage] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('chats').doc(id).collection('messages').
    orderBy('timestamp', 'desc').onSnapshot(snapshot => (
      setChatMessage(snapshot.docs[0].data())
    ))

    return unsubscribe;
  }, [])

  return (
    <ListItem key={id} bottomDivider onPress={() => enterChat(id, chatName)}>
      <Avatar
        rounded
        source={{
            uri: "https://avatars.githubusercontent.com/u/12928248?v=4"
        }}
        placeholderStyle={{ backgroundColor: 'transparent'}}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: 'bold' }}>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
        {chatMessage?.displayName}: {chatMessage?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  )
}

export default CustomListItem

const styles = StyleSheet.create({})