import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import ProfileStackNavigator from "./ProfileStackNavigator";
import ChatStackNavigator from "./ChatStackNavigator";
import HomeScreen from "../screens/HomeScreen";
import NotificationScreen from "../screens/NotificationScreen";

export default function TabNavigator(props) {
    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,

            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                    iconName = focused
                        ? 'home'
                        : 'home-outline';
                } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                } else if(route.name === 'Notifications') {
                    iconName = focused ? 'notifications' : 'notifications-outline';
                } else if (route.name === 'Chat') {
                    iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2a682a',
            tabBarInactiveTintColor: '#808080',
        })}>
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Chat" component={ChatStackNavigator} />
            <Tab.Screen name="Notifications" component={NotificationScreen} />
            <Tab.Screen name="Profile">
                {navigation => (
                    <ProfileStackNavigator {...navigation} screenProps={{updateAuthState: props.updateAuthState}} />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}
