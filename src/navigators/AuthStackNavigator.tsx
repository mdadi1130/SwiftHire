import React from 'react';

import {createNativeStackNavigator} from "@react-navigation/native-stack";

import LoginScreen from "../screens/auth/LoginScreen";
import RegistrationLandingScreen from "../screens/auth/RegistrationLandingScreen";
import RoleSelectionScreen from "../screens/auth/RoleSelectionScreen";
import RegistrationScreen from "../screens/auth/RegistrationScreen";
import ProfileSetupScreen from "../screens/auth/ProfileSetupScreen";
import RegistrationConfirmationScreen from "../screens/auth/RegistrationConfirmationScreen";

export default function AuthStackNavigator(props) {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login">
                {navigation => (
                    <LoginScreen {...navigation} screenProps={{updateAuthState: props.updateAuthState}} />
                )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegistrationLandingScreen} />
            <Stack.Screen name="Select Role" component={RoleSelectionScreen} />
            <Stack.Screen name="RegisterDetails" component={RegistrationScreen} />
            <Stack.Screen name="ConfirmRegister" component={RegistrationConfirmationScreen} />
            <Stack.Screen name="Profile Setup" component={ProfileSetupScreen} />
        </Stack.Navigator>
    );
}
