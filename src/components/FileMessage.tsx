import React, {useEffect, useState} from 'react';
import {StyleSheet, Image, TouchableOpacity, View} from 'react-native';

import {Icon, Text} from "react-native-elements";
import * as Progress from "react-native-progress";

import {Video} from 'expo-av';

import moment from "moment";
import {withAppContext} from "../utils/Context";

const IMAGE_MAX_SIZE = 240;
const DEFAULT_IMAGE_WIDTH = 240;
const DEFAULT_IMAGE_HEIGHT = 160;

const FileMessage = (props) => {
    const {sendbird, channel, message, onPress = () => {}, onLongPress = () => {}} = props;

    const isMyMessage = message.sender.userId === sendbird.currentUser.userId;
    const [readReceipt, setReadReceipt] = useState(0);
    const [width, setWidth] = useState(DEFAULT_IMAGE_WIDTH);
    const [height, setHeight] = useState(DEFAULT_IMAGE_HEIGHT);

    const isImage = () => {
        return message.type.match(/^image\/.+$/);
    };
    const isVideo = () => {
        return message.type.match(/^video\/.+$/);
    };
    const isFile = () => {
        return !isImage() && !isVideo();
    };

    useEffect(() => {
        sendbird.addChannelHandler(`message-${message.reqId}`, channelHandler);
        setReadReceipt(channel.getReadReceipt(message));

        if (isImage()) {
            Image.getSize(message.url, (measureWidth, measureHeight) => {
                const scaleWidth = IMAGE_MAX_SIZE / measureWidth;
                const scaleHeight = IMAGE_MAX_SIZE / measureHeight;
                const scale = Math.min(scaleWidth <= scaleHeight ? scaleWidth : scaleHeight, 1);
                setWidth(measureWidth * scale);
                setHeight(measureHeight * scale);
            });
        }
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
    };

    return (
        <TouchableOpacity
            style={{...styles.container, flexDirection: isMyMessage ? 'row-reverse' : 'row'}}
            activeOpacity={0.75}
            onPress={() => onPress(message)}
            onLongPress={() => onLongPress(message)}
        >
            <View style={styles.profileImageContainer}>
                {!message.hasSameSenderAbove && (
                    <Image source={{uri: message.sender.profileUrl}} style={styles.profileImage} />
                )}
            </View>
            <View style={{...styles.content, alignItems: isMyMessage ? 'flex-end' : 'flex-start'}}>
                {!message.hasSameSenderAbove && <Text style={styles.nickname}>{message.sender.nickname}</Text>}
                {isImage() && <Image source={{ uri: message.url }} style={{ ...styles.image, width, height }} />}
                {isVideo() && <Video source={{ uri: message.url }} isLooping={true} isMuted={true} style={styles.video} />}
                {isFile() && (
                    <View style={{...styles.messageBubble, backgroundColor: isMyMessage ? '#2a682a' : '#ddd'}}>
                        <Icon name="attach-file" color={isMyMessage ? '#fff' : '#333'} size={18} tvParallaxProperties={true} />
                        <Text style={{...styles.message, color: isMyMessage ? '#fff' : '#333'}}>{message.name}</Text>
                    </View>
                )}
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
        paddingHorizontal: 4
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
        marginTop: 20
    },
    content: {
        alignSelf: 'flex-end',
        marginHorizontal: 4
    },
    nickname: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#888',
        marginHorizontal: 8
    },
    image: {

        borderRadius: 8,
        marginTop: 6
    },
    video: {
        width: DEFAULT_IMAGE_WIDTH,
        height: DEFAULT_IMAGE_HEIGHT,
        borderRadius: 8,
        marginTop: 6
    },
    messageBubble: {
        maxWidth: 240,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginTop: 4
    },
    message: {
        fontSize: 18
    },
    status: {
        alignSelf: 'flex-end',
        marginHorizontal: 3,
        marginBottom: 2
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

export default withAppContext(FileMessage);
