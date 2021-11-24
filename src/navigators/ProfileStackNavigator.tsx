import React from 'react';

import {createNativeStackNavigator} from "@react-navigation/native-stack";

import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/profile/settings/SettingsScreen";
import CheckoutScreen from "../screens/profile/CheckoutScreen";

export default function ProfileStackNavigator(props) {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Profile" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings">
                {navigation => (
                    <SettingsScreen {...navigation} screenProps={{updateAuthState: props.updateAuthState}} />
                )}
            </Stack.Screen>
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
        </Stack.Navigator>
    )
}
