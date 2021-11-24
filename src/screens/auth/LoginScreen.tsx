import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from "react-native";

import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useDispatch} from "react-redux";
import {authenticate} from "../../redux/Actions";
import {Button, Input, Overlay, Text, Image} from "react-native-elements";
import {COLOR_PRIMARY, WINDOW_HEIGHT, WINDOW_WIDTH} from "../../utils/Constants";
import {withAppContext} from "../../utils/Context";

const LoginScreen = (props) => {
    const {sendbird, googleSignIn} = props;

    const [visible, setVisible] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const signIn = async () => {
        try {
            dispatch(authenticate(email, password));

            await sendbird.connect(email, (user, err) => {
                if (!err) {
                    if (user.nickname !== email) {
                        sendbird.updateCurrentUserInfo(email, '', (user, err) => {
                            if (!err) {
                                // start(user);
                            } else {
                                console.log(err.message);
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.log('error signing in', error);
        }
    };

    return (
        <KeyboardAwareScrollView scrollEnabled={false}>
            <Text style={styles.titleText}>SwiftHire</Text>
            <Input containerStyle={styles.input} inputStyle={styles.inputText} placeholder="Email" keyboardType="email-address" onChangeText={value => setEmail(value)}/>
            <Input containerStyle={styles.input} inputStyle={styles.inputText} placeholder="Password"
                   keyboardType="default" secureTextEntry={true} onChangeText={value => setPassword(value)}/>
            <Button buttonStyle={styles.loginButton} titleStyle={styles.loginButtonText} title='Sign In' onPress={() => signIn()}/>

            <Text style={styles.forgotPasswordText} onPress={toggleOverlay}>Forgot Password? Click Here</Text>
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} animationType='fade'>
                <Text style={styles.forgotPasswordPrompt}>Enter your email to reset your password</Text>
                <Input containerStyle={styles.input} placeholder="Email" keyboardType="email-address" />
                <Button title='Reset Password' buttonStyle={{backgroundColor: COLOR_PRIMARY}} />
            </Overlay>

            <TouchableOpacity style={styles.googleButton} onPress={googleSignIn}>
                <Image style={styles.googleLogo} source={require('../../../assets/images/google-logo.png')}/>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <Text style={styles.gotoSignupText}>Don't have an account yet?
                <Text style={{fontWeight: 'bold', color: COLOR_PRIMARY}} onPress={() => props.navigation.navigate('Register')}> Sign Up</Text>
            </Text>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    titleText: {
        fontSize: 60,
        fontFamily: 'Quicksand_600SemiBold',
        color: COLOR_PRIMARY,
        textAlign: 'center',
        marginTop: WINDOW_HEIGHT * 0.2,
        marginBottom: WINDOW_HEIGHT * 0.01
    },
    input: {
        width: WINDOW_WIDTH * 0.8,
        margin: 10,
        alignSelf: 'center'
    },
    inputText: {
        color: '#000'
    },
    loginButton: {
        backgroundColor: '#ffffff',
        borderRadius: 35,
        marginTop: WINDOW_HEIGHT * 0.05,
        paddingTop: 12,
        paddingBottom: 12,
        width: WINDOW_HEIGHT * 0.35,
        alignSelf: 'center'
    },
    loginButtonText: {
        color: '#000000',
        fontWeight: 'bold'
    },
    forgotPasswordText: {
        color: COLOR_PRIMARY,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: WINDOW_HEIGHT * 0.025
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
    gotoSignupText: {
        color: COLOR_PRIMARY,
        fontSize: 18,
        marginTop: WINDOW_HEIGHT * 0.05,
        textAlign: 'center'
    },
    forgotPasswordPrompt: {
        textAlign: 'center',
        marginBottom: 20
    }
});

export default withAppContext(LoginScreen);
