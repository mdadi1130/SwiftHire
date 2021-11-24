import React, {useState} from 'react';
import {StyleSheet, Dimensions} from 'react-native';

import {Text, Input, Button} from 'react-native-elements';

import * as WebBrowser from 'expo-web-browser';

import {Auth} from "aws-amplify";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {WINDOW_HEIGHT} from "../../utils/Constants";

export default function RegistrationScreen(props) {
    const role = props.route.params;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [companyName, setCompanyName] = useState('');
    const [companyPosition, setCompanyPosition] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const signUp = async () => {
        try {
            const {user} = await Auth.signUp({
                username: email,
                password: password,
                attributes: {
                    email: email,
                    name: name,
                    'custom:role': role,
                    'custom:companyName': role==='Recruiter' ? companyName : null,
                    'custom:companyPosition': role==='Recruiter' ? companyPosition : null,
                    'custom:picture': '',
                    'custom:firstSignIn': 'true'
                }
            });
            console.log(user);
            props.navigation.navigate('ConfirmRegister', email);
        } catch (error) {
            console.log('error signing up: ', error);

            if (email === '' || error.code === "InvalidParameterException") {
                setEmailError('Please enter a valid email address')
            } else if (error.code === "UsernameExistsException") {
                setEmailError('An account with this email already exists')
            }

            if (password === '' || password.length < 8 || error.code === "InvalidPasswordException" || error.code === "InvalidParameterException") {
                setPasswordError(true);
            }
        }
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
            <Text style={styles.title}>SwiftHire</Text>
            <Text style={styles.subtitle}>{role}</Text>

            <Input inputStyle={{color: 'white'}} placeholder="Email" keyboardType="email-address"
                   onChangeText={value => setEmail(value)} onChange={() => setEmailError('')}/>
            {(emailError !== '') && <Text style={{color: 'white', marginBottom: 15, marginStart: 10, textAlign: 'left'}}>{emailError}</Text>}

            <Input inputStyle={{color: 'white'}} placeholder="Password" keyboardType="default"
                   secureTextEntry onChangeText={value => setPassword(value)} onChange={() => setPasswordError(false)}/>
            {passwordError && <Text style={{color: 'white', marginBottom: 15, marginStart: 10}}>Please enter a password at least 8 characters long</Text>}

            <Input inputStyle={{color: 'white'}} placeholder="Full Name" keyboardType="default"
                   onChangeText={value => setName(value)}/>

            {(role === 'Recruiter') &&
            <Input inputStyle={{color: 'white'}} placeholder="Company Name" keyboardType="default"
                   onChangeText={value => setCompanyName(value)}/>}
            {(role === 'Recruiter') &&
            <Input inputStyle={{color: 'white'}} placeholder="Position in Company" keyboardType="default"
                   onChangeText={value => setCompanyPosition(value)}/>}

            <Button buttonStyle={styles.registerButton} titleStyle={styles.registerButtonText} title="Register"
                    onPress={() => signUp()}/>

            <Text style={{color: 'white', marginTop: 40}}>By creating an account, you agree to our <Text style={{color: 'white', fontWeight: 'bold'}} onPress={() => WebBrowser.openBrowserAsync('https://www.termsfeed.com/live/8bb88b16-30da-4df3-bf60-0beb2af69813')}>Terms & Conditions</Text> and <Text style={{color: 'white', fontWeight: 'bold'}} onPress={() => WebBrowser.openBrowserAsync('https://www.termsfeed.com/live/36d2f2a0-c840-4d9b-92b2-05a13f8888eb')}>Privacy Policy</Text>.</Text>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 20
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: WINDOW_HEIGHT
    },
    title: {
        fontSize: 60,
        fontFamily: 'Quicksand_600SemiBold',
        color: 'white',
        textAlign: 'center',
        marginTop: WINDOW_HEIGHT * 0.08
    },
    subtitle: {
        fontSize: 28,
        color: 'white',
        textAlign: 'center',
        margin: WINDOW_HEIGHT * 0.02,
        fontFamily: 'Quicksand_600SemiBold'
    },
    registerButton: {
        backgroundColor: '#ffffff',
        borderRadius: 35,
        marginTop: WINDOW_HEIGHT * 0.05,
        paddingTop: 12,
        paddingBottom: 12,
        width: WINDOW_HEIGHT * 0.35,
        alignSelf: 'center'
    },
    registerButtonText: {
        color: '#000000',
        fontWeight: 'bold'
    }
});
