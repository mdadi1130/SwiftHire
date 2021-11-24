import React, {useEffect, useState} from 'react';
import {StyleSheet, Animated, View} from "react-native";

import {Icon, Image, Text} from "react-native-elements";

import {Swipeable, TouchableOpacity} from "react-native-gesture-handler";
import * as Progress from "react-native-progress";

import {createChannelName, createUnreadMessageCount, ellipsis} from "../utils/Utils";

import moment from "moment";
import {withAppContext} from "../utils/Context";

const LAST_MESSAGE_ELLIPSIS = 45;

const Channel = (props) => {
    const {sendbird, channel, onPress} = props;

    const [name, setName] = useState('');
    const [lastMessage, setLastMessage] = useState('');
    const [unreadMessageCount, setUnreadMessageCount] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');

    const channelHandler = new sendbird.ChannelHandler();
    channelHandler.onChannelChanged = (updatedChannel) => {
        if (updatedChannel.url === channel.url) {
            updateChannelName(updatedChannel);
            updateLastMessage(updatedChannel);
            updateUnreadMessageCount(updatedChannel);
            updateUpdatedAt(updatedChannel);
        }
    };
    channelHandler.onUserJoined = (updatedChannel, user) => {
        if (updatedChannel.url === channel.url) {
            if (user.userId !== sendbird.currentUser.userId) {
                updateChannelName(updatedChannel);
            }
        }
    };
    channelHandler.onUserLeft = (updatedChannel, user) => {
        if (updatedChannel.url === channel.url) {
            if (user.userId !== sendbird.currentUser.userId) {
                updateChannelName(updatedChannel);
            }
        }
    };

    const updateChannelName = (channel) => {
        setName(createChannelName(channel));
    };

    const updateLastMessage = (channel) => {
        if (channel.lastMessage) {
            const message = channel.lastMessage;
            if (message.isUserMessage()) {
                setLastMessage(message.message);
            } else if (message.isFileMessage()) {
                setLastMessage(message.name);
            }
        }
    };

    const updateUnreadMessageCount = (channel) => {
        setUnreadMessageCount(createUnreadMessageCount(channel));
    };

    const updateUpdatedAt = (channel) => {
        setUpdatedAt(moment(channel.lastMessage ? channel.lastMessage.createdAt : channel.createdAt).fromNow());
    };

    useEffect(() => {
        sendbird.addChannelHandler(`channel_${channel.url}`, channelHandler);

        updateChannelName(channel);
        updateLastMessage(channel);
        updateUnreadMessageCount(channel);
        updateUpdatedAt(channel);

        return () => {
            sendbird.removeChannelHandler(`channel_${channel.url}`);
        }
    }, []);

    const swipeRight = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-200, 0],
            outputRange: [1, 0.5],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View style={styles.swipeableContainer}>
                <Animated.View style={{...styles.swipeableIconContainer, backgroundColor: '#cc0000'}}>
                    <Icon name='close-outline' type='ionicon' color='#fff' tvParallaxProperties={true} />
                    <Animated.Text style={{...styles.swipeableText, transform: [{scale}], marginEnd: '17%'}}>Delete</Animated.Text>
                </Animated.View>
                <Animated.View style={{...styles.swipeableIconContainer, backgroundColor: '#a9a9a9'}}>
                    <Icon name='ellipsis-horizontal' type='ionicon' color='#fff' tvParallaxProperties={true} />
                    <Animated.Text style={{...styles.swipeableText, transform: [{scale}], marginEnd: '25%'}}>More</Animated.Text>
                </Animated.View>
            </Animated.View>
        );
    };

    return (
        <Swipeable renderRightActions={swipeRight} rightThreshold={-200}>
            <Animated.View>
                <TouchableOpacity style={styles.container} activeOpacity={0.75} onPress={() => onPress(channel)}>
                    <Image
                        style={styles.profileImage}
                        source={{uri: channel.coverUrl}}
                        PlaceholderContent={<Progress.Circle size={10} indeterminate color='#2a682a'/>}
                    />
                    <View style={styles.contentContainer}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.lastMessage}>{ellipsis(lastMessage.replace(/\n/g, ' '), LAST_MESSAGE_ELLIPSIS)}</Text>
                    </View>
                    <View style={styles.propertyContainer}>
                        <Text style={styles.updatedAt}>{updatedAt}</Text>
                        {channel.unreadMessageCount > 0 ? (
                            <View style={styles.unreadMessageCountContainer}>
                                <Text style={styles.unreadMessageCount}>{unreadMessageCount}</Text>
                            </View>
                        ) : null}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#f1f2f6',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    profileImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 15
    },
    contentContainer: {
        flex: 1,
        position: 'relative',
        alignSelf: 'center',
        paddingBottom: 2
    },
    name: {
        fontSize: 16,
        fontWeight: '100',
        color: '#333',
        marginBottom: 2
    },
    lastMessage: {
        fontSize: 14,
        color: '#999'
    },
    propertyContainer: {
        alignItems: 'center'
    },
    unreadMessageCountContainer: {
        minWidth: 20,
        padding: 3,
        borderRadius: 10,
        backgroundColor: '#2a682a',
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    unreadMessageCount: {
        fontSize: 12,
        color: '#fff'
    },
    updatedAt: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
        marginBottom: 4
    },
    swipeableText: {
        marginLeft: 'auto',
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold'
    },
    swipeableContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '40%'
    },
    swipeableIconContainer: {
        justifyContent: 'center',
        width: '50%'
    }
});

export default withAppContext(Channel);
