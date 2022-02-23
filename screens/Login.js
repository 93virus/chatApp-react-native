import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [hidePassword, setHidePassword] = useState(true);

    const signIn = () => {
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
                onChangeText={(text) => setEmail(text)}
                leftIcon={
                    <MaterialIcons name="email" size={24} color="#99A3A4" />
                }
                />

                <Input placeholder='Password' 
                secureTextEntry={hidePassword}
                autoCapitalize='none'
                type="Password" 
                value={password} 
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

            <Button title="Login" containerStyle={[styles.button]} onPress={signIn} buttonStyle={{backgroundColor: '#2C6BED'}} />
            <Button title="Register" containerStyle={styles.button} type="outline" onPress={() => navigation.navigate('Register')} />
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