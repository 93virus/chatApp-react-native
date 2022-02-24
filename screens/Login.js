import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../firebase';
import { Wave } from 'react-native-animated-spinkit'
import Spinner from 'react-native-loading-spinner-overlay';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [hidePassword, setHidePassword] = useState(true);

    const [passwordErr, setPasswordErr] = useState('');
    const [emailErr, setEmailErr] = useState('');

    const [loading, setLoading] = useState(false);
    const [render, setRender] = useState(false);

    useEffect(() => {
        setRender(false);
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                navigation.replace("Home");
            } else {
                setRender(true);
            }
        })

        return unsubscribe;
    }, [])

    const signIn = () => {
        setLoading(true);
        setEmailErr('');
        setPasswordErr('');
        let flag = 1;
        if (email == '') {
            setEmailErr("Email address is required!")
            flag = 0;
        }
        if (password == '') {
            setPasswordErr('Password is required!')
            flag = 0;
        }
        if (password.length <= 5 && password.length != 0) {
            setPasswordErr('Password length must be atleast 6 characters!');
            flag = 0;
        }
        if (flag == 0) {
            setLoading(false);
            return;
        }
        auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            switch(err.code) {
                case 'auth/wrong-password':
                    setPasswordErr("Password is incorrect! Try again");
                    break;
                case 'auth/user-not-found':
                    setEmailErr("Account does not exist with this email!");
                    break;
                case 'auth/invalid-email':
                    setEmailErr("Email address is invalid!");
                    break;
                default: alert(err.message);
            }    
        })
    }

    if (!render) {
        return (
            <Spinner
                visible={true}
                textContent={'Loading...'}
                textStyle={{ color: 'grey' }}
            />
        )
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{ alignItems: 'center'}}>
            <StatusBar style='light' />
            <Image source={require("../assets/signal.png")} style={{ width: 200, height: 200 }} />
            <View style={styles.inputContainer}>
                <Input
                placeholder='Email' 
                type="email" 
                autoCapitalize='none'
                value={email} 
                style={(Platform.OS == 'web') ? { outlineStyle: 'none' } : null}
                onChangeText={(text) => setEmail(text.trim())}
                leftIcon={
                    <MaterialIcons name="email" size={24} color="#99A3A4" />
                }
                errorMessage={emailErr}
                />

                <Input placeholder='Password' 
                secureTextEntry={hidePassword}
                autoCapitalize='none'
                type="Password" 
                value={password} 
                errorMessage={passwordErr}
                style={{ outlineStyle: 'none' }}
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
                />
            </View>
            
            <View style={{ height: 120, justifyContent: 'center'}}>
            {(loading) ? (
                <>
                <Wave size={48} color="#2C6BED" style={{ marginTop: 10 }} />
                </>
            ) : (
                <><Button title="Login" containerStyle={[styles.button]} onPress={signIn} buttonStyle={{ backgroundColor: '#2C6BED' }} />
                <Button title="Register" containerStyle={styles.button} type="outline" onPress={() => navigation.navigate('Register')} /></>
            )}
            </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    inputContainer: {
        marginTop: 50,
        width: 300
    },
    button: {
        marginTop: 10,
        width: 200
    }
});

export default Login;