import { StyleSheet, Text, View, TouchableOpacity, Platform, SafeAreaView, KeyboardAvoidingView, ScrollView, TextInput, Keyboard } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import firebase from 'firebase';
import { sendMessagePushNotification } from '../ExpoNotification';

export default function Chat({ navigation, route }) {

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View>
          
        </View>
      ),
      headerLeft: () => (
        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: (Platform.OS == 'web') ? 20 : 0 }}>
        <TouchableOpacity
        style={{ marginLeft: 0, marginRight: 10 }} 
        onPress={() => navigation.goBack()}>
          <AntDesign name='arrowleft' size={24} color="#fff" />
        </TouchableOpacity>
        <View
        style={{flexDirection: 'row', alignItems: 'center'}}>
          <Avatar rounded source={{ uri: auth.currentUser.photoURL }} placeholderStyle={{ backgroundColor: 'transparent' }} />
          <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 10, fontSize: 18 }}>{route.params.chatName}</Text>
        </View>
        </View>
      ),
      headerBackVisible: false,
      headerRight: () => (
        <View 
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: 80,
          marginRight: (Platform.OS == 'web' || Platform.OS == 'ios') ? 20 : 0
        }}>
          <TouchableOpacity>
            <FontAwesome name='video-camera' color='#fff' size={24} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name='call' size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )
    });
  }, [])

  useLayoutEffect(() => {
    const unsubscribe = db.collection('chats').doc(route.params.id).collection('messages')
    .orderBy('timestamp', 'asc').onSnapshot(snapshot => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })

    return unsubscribe;
  }, [route])

  const sendMessage = () => {
    Keyboard.dismiss();
    db.collection('chats').doc(route.params.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input.trim(),
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL
    }).then(() => {
      sendMessagePushNotification({title: route.params.chatName, body: auth.currentUser.displayName + " : " + input.trim()})
    })
    setInput('')
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : null}
        style={styles.container}
        keyboardVerticalOffset={60}
      >
        <>
        <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
          {
            messages.map(({id, data}) => (
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.receiver}>
                  <Avatar 
                  rounded
                  source={{
                    uri: data.photoURL
                  }}
                  position='absolute'
                  right={-5}
                  size={30}
                  bottom={-15}
                  containerStyle={{
                    position: 'absolute',
                    right: -5,
                    bottom: -15
                  }}
                  placeholderStyle={{backgroundColor: 'transparent'}}
                  />
                  <Text style={styles.receiverText}>{data.message}</Text>
                </View>
              ) : (
                <View style={styles.sender} id={id}>
                  <Text style={{ color: '#000', fontSize: 12, backgroundColor: '#fff', borderRadius: 10, paddingTop: 3, paddingLeft: 10, paddingRight: 10, paddingBottom: 3, marginLeft: 5, alignSelf: 'flex-start' }}>{data.displayName}</Text>
                  <Avatar 
                  rounded
                  source={{
                    uri: data.photoURL
                  }}
                  position='absolute'
                  left={-5}
                  size={30}
                  bottom={-15}
                  containerStyle={{
                    position: 'absolute',
                    left: -5,
                    bottom: -15,
                  }}
                  placeholderStyle={{backgroundColor: 'transparent'}}
                  />
                  <Text style={styles.senderText}>{data.message}</Text>
                  <Text style={{
                    color: '#fff',
                    alignSelf: 'flex-end',
                    fontSize: 12
                  }}>{new Date(data.timestamp.seconds * 1000 + data.timestamp.nanoseconds/1000000).getHours() + ":" + new Date(data.timestamp.seconds * 1000 + data.timestamp.nanoseconds/1000000).getMinutes()}</Text>
                </View>
              )
            ))
          }
        </ScrollView>
        <View style={styles.footer}>
          <TextInput 
          placeholder='Type your message'
          style={styles.textInput} 
          onChangeText={(text) => setInput(text)} 
          value={input} 
          onSubmitEditing={sendMessage}
          />

          <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
            <Ionicons name='send' color='#2c6be6' size={30} />
          </TouchableOpacity>
        </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20
  },
  textInput: {
    bottom: 0,
    height: 50,
    flex: 1,
    marginRight: 15,
    borderColor: 'transparent',
    backgroundColor: '#ececec',
    borderWidth: 1,
    padding: 15,
    color: 'grey',
    borderRadius: 30,
    fontSize: 17,
  }, 
  receiver: {
    alignSelf: 'flex-end',
    padding: 15,
    backgroundColor: '#ececec',
    borderRadius: 20,
    maxWidth: '80%',
    position: 'relative',
    marginRight: 15,
    marginBottom: 20
  },
  sender: {
    padding: 15,
    backgroundColor: '#2C6BED',
    borderRadius: 20,
    maxWidth: '80%',
    position: 'relative',
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginBottom: 20,
    minWidth: 120
  },
  senderText: {
    color: '#F0F3F4',
    fontWeight: '500',
    marginLeft: 10,
    marginBottom: 15,
    marginTop: 5
  },
  receiverText: {
    color: '#000',
    fontWeight: '500',
    marginRight: 10,
  }
})