import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = () => {

    }

    return (
        <KeyboardAvoidingView>
            <ScrollView contentContainerStyle={styles.container}>
            <StatusBar style='light' />
            <Image source={require("../assets/signal.png")} style={{ width: 200, height: 200}} />
            <View style={styles.inputContainer}>
                <Input
                placeholder='Email' 
                autoFocus type="email" 
                value={email} 
                onChangeText={(text) => setEmail(text)}
                />

                <Input placeholder='Password' 
                secureTextEntry 
                type="Password" 
                value={password} 
                onChangeText={(text) => setPassword(text)}
                />
            </View>

            <Button title="Login" containerStyle={styles.button} onPress={signIn} />
            <Button title="Register" containerStyle={styles.button} type="outline" />
            <View style={{height: 50}} />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
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