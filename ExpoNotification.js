import { Alert, Platform } from 'react-native';
import { auth, db } from './firebase';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const registerForPushNotificationsAsync = async () => {
    let token;
    if (Platform.OS == 'web') return;
    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus != 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus != 'granted') {
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        alert('Physical device must be used for push notifications!');
    }
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        })
    }
    try {
        db.collection('users').doc(auth.currentUser.uid)
        .update({
            'expoToken': token
        })
        .then(() => {
  
        })
    } catch(e) {
        console.log(e);
    }
}

const sendNotification = async (token, msg) => {
    const message = {
        to: token,
        sound: 'default',
        title: msg.title,
        body: msg.body,
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

const sendNotificationToAllUsers = async (msg) => {
    const users = await db.collection('users').get();
    users.docs.map(user => {
        sendNotification(user.data().expoToken, msg)
    })
}

const sendLocalNotification = async (msg) => {
    Notifications.scheduleNotificationAsync({
        content: {
            title: msg.title,
            body: msg.body
        },
        trigger: {
            seconds: 2
        }
    })
}

const sendMessagePushNotification = async (msg) => {
    const users = await db.collection('users').get();
    users.docs.map(user => {
        if (user.data().uid != auth.currentUser.uid) {
            sendNotification(user.data().expoToken, msg)
        }
    })
}

export { registerForPushNotificationsAsync, 
    sendNotification, 
    sendNotificationToAllUsers,
    sendLocalNotification,
    sendMessagePushNotification };