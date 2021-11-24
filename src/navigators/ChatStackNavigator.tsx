import React from 'react';

import {createNativeStackNavigator} from "@react-navigation/native-stack";

import ChatScreen from "../screens/chat/ChatScreen";
import ChannelScreen from "../screens/chat/ChannelScreen";
import MemberScreen from "../screens/chat/MemberScreen";

export default function ChatStackNavigator() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Chats" screenOptions={{headerShown: true}}>
            <Stack.Screen name="Chats" component={ChannelScreen} />
            <Stack.Screen name="ChatDetails" component={ChatScreen} />
            <Stack.Screen name="Members" component={MemberScreen} />
        </Stack.Navigator>
    )
}
