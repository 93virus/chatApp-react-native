import { StyleSheet, Text, View, TouchableOpacity, Platform, SafeAreaView, KeyboardAvoidingView, ScrollView, TextInput, Keyboard } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebase';
import firebase from 'firebase';

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
    .orderBy('timestamp', 'desc').onSnapshot(snapshot => {
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
        <ScrollView>
          {
            messages.map(({id, data}) => (
              data.email === auth.currentUser.email ? (
                <View>

                </View>
              ) : (
                <View>

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
    fontSize: 17
  }
})