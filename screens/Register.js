import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Register = ({ navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back to Login"
        })
    }, [navigation])

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    
    const [hidePassword, setHidePassword] = useState(true);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [5, 5],
            quality: 0.7
        });
        if (!result.cancelled) {
            setImageUrl(result.uri);
            console.log(imageUrl);
        }
    }

    const uploadImage = async (imageUrl) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
    }

    const register = async () => {
        
    }

    return (
        <KeyboardAvoidingView style={styles.container}
        behavior={(Platform.OS == 'ios') ? "padding" : "height"}
        keyboardVerticalOffset={90}>
            <StatusBar style='light' />

            <Text style={{ marginBottom: 40, fontSize: 30, color: '#566573' }}>Create an Account</Text>

            <View style={styles.inputContainer}>
                <View style={styles.profileImgContainer}>
                    <Image style={styles.profileImg} source={require('../assets/profile.png')} />
                    <TouchableHighlight activeOpacity={0.6} underlayColor="#fff" onPress={() => pickImage()} style={styles.addIconContainer}>
                    <Ionicons name="add-circle" size={70} color="#2c6bed" style={styles.addIcon} />
                    </TouchableHighlight>
                </View>
                <Input type="text" placeholder='Full Name' 
                value={name} onChangeText={(text) => setName(text)} 
                leftIcon={
                    <MaterialCommunityIcons name="account" size={24} color="#99A3A4" />
                }/>

                <Input type="email" autoCapitalize='none'
                placeholder='Email' value={email} 
                onChangeText={(text) => setEmail(text)} 
                leftIcon={
                    <MaterialIcons name="email" size={24} color="#99A3A4" />
                }/>

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
                onSubmitEditing={register} />
            </View>

            <Button raised title="Register" onPress={() => register()} containerStyle={styles.button} buttonStyle={{ backgroundColor: '#2C6BED'}} />
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