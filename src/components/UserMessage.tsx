import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from "react-native";

import {Avatar, Text} from "react-native-elements";
import  * as Progress from "react-native-progress";

import {getNameInitials} from "../utils/Utils";
import moment from "moment";
import {withAppContext} from "../utils/Context";

const UserMessage = (props) => {
    const {sendbird, channel, message, onPress = () => {}, onLongPress = () => {} } = props;
    const isMyMessage = message.sender.userId === sendbird.currentUser.userId;
    const [readReceipt, setReadReceipt] = useState(channel.members.length - 1);

    useEffect(() => {
        sendbird.addChannelHandler(`message-${message.reqId}`, channelHandler);
        setReadReceipt(channel.getReadReceipt(message));
        return () => {
            sendbird.removeChannelHandler(`message-${message.reqId}`);
        };
    }, []);

    const channelHandler = new sendbird.ChannelHandler();
    channelHandler.onReadReceiptUpdated = (targetChannel) => {
        if (targetChannel.url === channel.url) {
            const newReadReceipt = channel.getReadReceipt(message);
            if (newReadReceipt !== readReceipt) {
                setReadReceipt(newReadReceipt);
            }
        }
    }

    return (
        <TouchableOpacity
            style={{...styles.container, flexDirection: isMyMessage ? 'row-reverse' : 'row'}}
            activeOpacity={0.75}
            onPress={() => onPress(message)}
            onLongPress={() => onLongPress(message)}
        >
            <View style={styles.profileImageContainer}>
                {!message.hasSameSenderAbove && (
                    <Avatar
                        title={getNameInitials(message.sender.nickname)}
                        source={{ uri: message.sender.profileUrl }}
                        // @ts-ignore
                        style={styles.profileImage}
                        PlaceholderContent={<Progress.Circle size={10} indeterminate color='#2a682a'/>}/>
                )}
            </View>
            <View style={{ ...styles.content, alignItems: isMyMessage ? 'flex-end' : 'flex-start' }}>
                {!message.hasSameSenderAbove && <Text style={styles.nickname}>{message.sender.nickname}</Text>}
                <View style={{ ...styles.messageBubble, backgroundColor: isMyMessage ? '#2a682a' : '#ddd' }}>
                    <Text style={{ ...styles.message, color: isMyMessage ? '#fff' : '#333' }}>{message.message}</Text>
                </View>
            </View>
            <View style={{ ...styles.status, alignItems: isMyMessage ? 'flex-end' : 'flex-start' }}>
                {message.sendingStatus === 'pending' && (
                    <Progress.Circle size={10} indeterminate={true} color="#999" />
                )}
                {message.sendingStatus === 'succeeded' && readReceipt > 0 && (
                    <Text style={styles.readReceipt}>{readReceipt}</Text>
                )}
                <Text style={styles.updatedAt}>{moment(message.createdAt).fromNow()}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 4,
        marginVertical: 2
    },
    profileImageContainer: {
        width: 32,
        height: 32,
        marginHorizontal: 8
    },
    profileImage: {
        width: 32,
        height: 32,
        borderWidth: 0,
        borderRadius: 16,
        marginTop: 20,
        backgroundColor: '#bdbec2'
    },
    content: {
        alignSelf: 'center',
        marginHorizontal: 4
    },
    nickname: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#888',
        marginHorizontal: 8
    },
    messageBubble: {
        maxWidth: 240,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginTop: 2
    },
    message: {
        fontSize: 18
    },
    status: {
        alignSelf: 'flex-end',
        marginHorizontal: 3,
        marginBottom: 3
    },
    readReceipt: {
        fontSize: 12,
        color: '#f89'
    },
    updatedAt: {
        fontSize: 12,
        color: '#999'
    }
});

export default withAppContext(UserMessage);
