import React, {useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import {Button, Image, Text} from 'react-native-elements';

import {withOAuth} from "aws-amplify-react-native";
import {COLOR_PRIMARY, WINDOW_HEIGHT} from "../../utils/Constants";
import {Auth} from "aws-amplify";
import {CognitoHostedUIIdentityProvider} from "@aws-amplify/auth";

const RegistrationLandingScreen = (props) => {
    const googleSignIn = useCallback(() => {
        Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google});
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>SwiftHire</Text>
            <Text style={styles.subtitleText}>Registration</Text>

            <TouchableOpacity style={styles.googleButton} onPress={googleSignIn}>
                <Image style={styles.googleLogo} source={require('../../../assets/images/google-logo.png')} />
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <Button buttonStyle={styles.registerButton} titleStyle={styles.registerText} title='Register'
                    onPress={() => props.navigation.navigate('Select Role')} />

            <Text style={styles.gotoSigninText}>Already have an account?
                <Text style={{fontWeight: 'bold', color: COLOR_PRIMARY}} onPress={() => props.navigation.goBack()}> Sign In</Text>
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
        color: COLOR_PRIMARY,
        textAlign: 'center',
        marginTop: WINDOW_HEIGHT * 0.2
    },
    subtitleText: {
        fontSize: 30,
        color: COLOR_PRIMARY,
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
        color: COLOR_PRIMARY,
        fontSize: 18,
        marginTop: WINDOW_HEIGHT * 0.1,
        textAlign: 'center'
    }
});

export default withOAuth(RegistrationLandingScreen);
