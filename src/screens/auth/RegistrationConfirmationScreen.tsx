import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

import {Text, Button, Input} from 'react-native-elements';

import {Auth} from "aws-amplify";

import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {COLOR_PRIMARY, WINDOW_HEIGHT} from "../../utils/Constants";

export default function RegistrationConfirmationScreen(props) {
    const username = props.route.params;
    const [authCode, setAuthCode] = useState('');

    const confirmRegistration = async () => {
        try {
            await Auth.confirmSignUp(username, authCode);
            console.log('Auth code confirmed');
            props.navigation.navigate('Login');
        } catch (error) {
            console.log('Verification code does not match, please try again.', error.code);
        }
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
            <Text style={styles.title}>SwiftHire</Text>

            <Text style={{color: '#ffffff', margin: 25}}>Confirm the registration code sent to your email</Text>
            <Input inputStyle={{textAlign: 'center', color: 'white'}} placeholder="Enter verification code" keyboardType='numeric' onChangeText={text => setAuthCode(text)} />
            <Button title="Confirm" buttonStyle={styles.button} titleStyle={styles.buttonText} onPress={confirmRegistration} />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
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
        color: COLOR_PRIMARY,
        textAlign: 'center',
        marginTop: WINDOW_HEIGHT * 0.08
    },
    button: {
        backgroundColor: '#ffffff',
        borderRadius: 35,
        marginTop: WINDOW_HEIGHT * 0.05,
        paddingTop: 12,
        paddingBottom: 12,
        width: WINDOW_HEIGHT * 0.35,
        alignSelf: 'center'
    },
    buttonText: {
        color: '#000000',
        fontWeight: 'bold'
    },
});
