import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableHighlight, TouchableOpacity, Alert } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage, db } from '../firebase';
import { Wave } from 'react-native-animated-spinkit'

const Register = ({ navigation }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back to Login"
        })
    }, [navigation])

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUri, setImageUri] = useState('');
    const [username, setUsername] = useState('');
    
    const [hidePassword, setHidePassword] = useState(true);

    const [loading, setLoading] = useState(false);
    const [nameErr, setNameErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [usernameErr, setUsernameErr] = useState('');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7
        });
        if (!result.cancelled) {
            setImageUri(result.uri);
        }
    }

    const uploadImage = async (imageUri) => {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        var ref = await storage.ref().child('profileImg/'+email);
        await ref.put(blob);
        const url = await storage.ref().child('profileImg/'+email).getDownloadURL();
        return url;
    }

    const userExists = async (username) => {
        let userExists = true;
        await db.collection('users')
        .where('username', '==', username)
        .limit(1)
        .get()
        .then(snapshot => {
            if (snapshot.docs.length == 0) {
                userExists = false;
            } else {
                setUsernameErr("Username already exists!")
                userExists = true;
            }
        })
        return userExists;
    }

    const register = async () => {
        setEmailErr('');
        setNameErr('');
        setPasswordErr('');
        setUsernameErr('');
        setLoading(true);
        let flag = 1;
        if (name == '') {   
            setNameErr("Name is required!");
            flag = 0;
        }
        if (email == '') {
            setEmailErr("Email address is required!");
            flag = 0;
        }
        if (password == '') {
            setPasswordErr("Password is required!");
            flag = 0;
        }
        if (username == '') {
            setPhoneErr("Username is required!");
            flag = 0;
        }
        if (flag == 0) {
            setLoading(false);
            return;
        }
        if (await userExists(username.toLowerCase())) {
            setLoading(false)
            return;
        } else {
        await auth.createUserWithEmailAndPassword(email, password)
        .then(async (authUser) => {
            auth.currentUser.sendEmailVerification();
            let url = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?20170328184010"
            if (imageUri) {
                url = await uploadImage(imageUri);
            }
            await authUser.user.updateProfile({
                displayName: name.trim(),
                photoURL: url
            })
            await db.collection('users').doc(authUser.user.uid)
            .set({
                'uid': authUser.user.uid,
                'name': name.trim(),
                'profileImg': url,
                'email': email.trim(),
                'username': username.trim().toLowerCase(),
                'friends': [],
                'friendRequests': []
            })
        })
        .then(async() => {
            await auth.signOut();
            setLoading(false);
            navigation.navigate('Login')
        })
        .catch(err => {
            setLoading(false);
            switch(err.code) {
                case 'auth/email-already-in-use':
                    setEmailErr("Email address already in use!");
                    break;
                case 'auth/invalid-email':
                    setEmailErr("Email address is invalid!");
                    break;
                case 'auth/weak-password':
                    setPasswordErr("Password is not strong enough!");
                    break;
                default: alert(err.message);
            }
        })
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}
        behavior={(Platform.OS == 'ios') ? "padding" : "height"}
        keyboardVerticalOffset={150}>
            <StatusBar style='light' />

            <Text style={{ marginBottom: 40, fontSize: 30, color: '#566573' }}>Create an Account</Text>

            <View style={styles.inputContainer}>
                <View style={styles.profileImgContainer}>
                    <Image style={styles.profileImg} source={(!imageUri) ? require('../assets/profile.png') : {uri: imageUri}} />
                    <TouchableHighlight activeOpacity={0.6} underlayColor="#fff" onPress={() => pickImage()} style={styles.addIconContainer}>
                    <Ionicons name="add-circle" size={70} color="#2c6bed" style={styles.addIcon} />
                    </TouchableHighlight>
                </View>
                <Input type="text" placeholder='Full Name' 
                value={name} onChangeText={(text) => setName(text)} 
                leftIcon={
                    <MaterialCommunityIcons name="account" size={24} color="#99A3A4" />
                }
                errorMessage={nameErr}
                />

                <Input type="email" autoCapitalize='none'
                placeholder='Email' value={email} 
                onChangeText={(text) => setEmail(text.trim())} 
                leftIcon={
                    <MaterialIcons name="email" size={24} color="#99A3A4" />
                }
                errorMessage={emailErr}
                />

                <Input type="text" autoCapitalize='none'
                placeholder='Username' 
                value={username.trim()} 
                onChangeText={(text) => setUsername(text.trim())}
                leftIcon={
                    <FontAwesome5 name="user-tag" size={20} color="#99A3A4" />
                }
                errorMessage={usernameErr}
                maxLength={20}
                />

                <Input type="text" autoCapitalize='none' 
                secureTextEntry={hidePassword} placeholder='Password' value={password} 
                onChangeText={(text) => setPassword(text)} 
                leftIcon={
                    <MaterialIcons name="lock" size={24} color="#99A3A4" />
                }
                rightIcon={
                    (hidePassword) ?
                    <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name="eye" size={24} color="#99A3A4" />
                    </TouchableOpacity> 
                    :
                    <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name="eye-off" size={24} color="#99A3A4" />
                    </TouchableOpacity>
                }
                onSubmitEditing={register} 
                errorMessage={passwordErr}
                />
            </View>
            {(loading) ? (
                <Wave size={48} color="#2C6BED" style={{ marginTop: 10 }} />
            ) : (
                <><Button raised title="Register" onPress={() => register()} containerStyle={styles.button} buttonStyle={{ backgroundColor: '#2C6BED'}} /></>
            )}
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    inputContainer: {
        width: 300
    },
    profileImgContainer: {
        alignItems: 'center',
        marginBottom: 30
    },
    profileImg: {
        borderRadius: 100,
        width: 150,
        height: 150,
        borderColor: '#CCD1D1',
        borderWidth: 1
    },
    addIconContainer: {
        width: 70,
        height: 70,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        right: 50,
        borderRadius: 50
    },
    addIcon: {
        position: 'absolute',
        left: 2,
        top: -2
    },
    button: {
        width: 200,
        marginTop: 20
    }
})

export default Register;