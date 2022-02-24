import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ListItem, Avatar } from 'react-native-elements'

const CustomListItem = ({ id, chatName, enterChat }) => {
  return (
    <ListItem>
      <Avatar
        rounded
        source={{
            uri: "https://avatars.githubusercontent.com/u/12928248?v=4"
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: 'bold' }}>Itachi</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
        Those who cannot acknowledge themselves, will eventually fail
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  )
}

export default CustomListItem

const styles = StyleSheet.create({})