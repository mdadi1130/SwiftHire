import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Button, Image, Text} from 'react-native-elements';

import {withOAuth} from "aws-amplify-react-native";
import {WINDOW_HEIGHT} from "../../utils/Constants";

const RegistrationLandingScreen = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>SwiftHire</Text>
            <Text style={styles.roleText}>Registration</Text>

            <TouchableOpacity style={styles.googleButton} onPress={props}>
                <Image style={styles.googleLogo} source={require('../../../assets/images/google-logo.png')} />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <Button buttonStyle={styles.registerButton} titleStyle={styles.registerText} title='Register'
                    onPress={() => props.navigation.navigate('Select Role')} />

            <Text style={styles.gotoSigninText}>Already have an account?
                <Text style={{fontWeight: 'bold', color: '#ffffff'}} onPress={() => props.navigation.goBack()}> Sign In</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: WINDOW_HEIGHT
    },
    titleText: {
        fontSize: 60,
        fontFamily: 'Quicksand_600SemiBold',
        color: '#ffffff',
        textAlign: 'center',
        marginTop: WINDOW_HEIGHT * 0.2
    },
    roleText: {
        fontSize: 30,
        color: '#ffffff',
        textAlign: 'center',
        marginTop: WINDOW_HEIGHT * 0.04,
        fontFamily: 'Quicksand_600SemiBold'
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: 'center',
        marginTop: WINDOW_HEIGHT * 0.1,
        backgroundColor: '#ffffff',
        paddingStart: 15,
        paddingEnd: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 35,
        width: WINDOW_HEIGHT * 0.35
    },
    googleLogo: {
        height: 30,
        width: 30,
        marginEnd: 40
    },
    googleButtonText: {
        color: '#808080',
        fontWeight: 'bold'
    },
    registerButton: {
        backgroundColor: '#ffffff',
        borderRadius: 35,
        marginTop: WINDOW_HEIGHT * 0.1,
        width: WINDOW_HEIGHT * 0.35
    },
    registerText: {
        paddingTop: 5,
        paddingBottom: 5,
        color: '#36454f',
        fontWeight: 'bold'
    },
    gotoSigninText: {
        color: '#ffffff',
        fontSize: 18,
        marginTop: WINDOW_HEIGHT * 0.1,
        textAlign: 'center'
    }
});

export default withOAuth(RegistrationLandingScreen);
