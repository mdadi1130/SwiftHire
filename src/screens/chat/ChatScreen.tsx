import React, {useEffect, useLayoutEffect, useReducer, useState} from 'react';
import {
    StyleSheet,
    Alert,
    AppState,
    Platform,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Modal,
    FlatList, TextInput
} from "react-native";

import {Icon, Text} from "react-native-elements";

import {useSelector} from "react-redux";
import {ChatReducer} from "../../redux/reducers/ChatReducer";

import {
    createChannelName,
    downloadFileAsync,
    getCameraImageAsync,
    getDocumentAsync,
    getLibraryImageAsync
} from "../../utils/Utils";

import {connectActionSheet, useActionSheet} from "@expo/react-native-action-sheet";
import * as Sharing from 'expo-sharing';
import {StatusBar} from "expo-status-bar";
import {useHeaderHeight} from "react-native-screens/native-stack";
import ImageViewer from "react-native-image-zoom-viewer";
import Message from "../../components/Message";
import {COLOR_PRIMARY} from "../../utils/Constants";
import {withAppContext} from "../../utils/Context";

const ChatScreen = props => {
    const {route, navigation, sendbird} = props;
    const {currentUser, channel} = route.params;

    const {showActionSheetWithOptions} = useActionSheet();
    const [msg, setMsg] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const [query, setQuery] = useState(null);
    const [state, dispatch] = useReducer(ChatReducer, {
        sendbird,
        channel,
        messages: [],
        messageMap: {},
        loading: false,
        input: '',
        empty: '',
        error: ''
    });

    const userAttrs = useSelector(state => state['AuthReducer'].user.attributes);
    const email = userAttrs['email'];

    useLayoutEffect(() => {
        const right = (
            <View style={styles.headerRightContainer}>
                {
                    channel['members_count'] === 1 &&
                    [
                        <TouchableOpacity activeOpacity={0.85} style={styles.headerRightButton}
                                          onPress={props.navigation.navigate('VideoCall')}>
                            <Icon name="" color="#2a682a" size={28} tvParallaxProperties={true} />
                        </TouchableOpacity>,
                        <TouchableOpacity activeOpacity={0.85} style={styles.headerRightButton}
                                          onPress={props.navigation.navigate('VoiceCall')}>
                            <Icon name="" color="#2a682a" size={28} tvParallaxProperties={true} />
                        </TouchableOpacity>
                    ]
                };
                <TouchableOpacity activeOpacity={0.85} style={styles.headerRightButton} onPress={member}>
                    <Icon name="people" color="#2a682a" size={28} tvParallaxProperties={true} />
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.85} style={styles.headerRightButton} onPress={leave}>
                    <Icon name="directions-walk" color="#2a682a" size={28} tvParallaxProperties={true} />
                </TouchableOpacity>
            </View>
        );

        navigation.setOptions({
            title: createChannelName(channel),
            headerRight: () => right
        });
    });

    useEffect(() => {
        sendbird.addConnectionHandler('chat', connectionHandler);
        sendbird.addChannelHandler('chat', channelHandler);
        AppState.addEventListener('change', handleStateChange);

        if (!sendbird.currentUser) {
            sendbird.connect(email, (err, _) => {
                if (!err) {
                    refresh();
                } else {
                    dispatch({
                        type: 'error',
                        payload: {
                            error: 'Connection failed. Please check the network status.'
                        }
                    });
                }
            });
        } else {
            refresh();
        }

        return () => {
            sendbird.removeConnectionHandler('chat');
            sendbird.removeChannelHandler('chat');
            AppState.removeEventListener('change', handleStateChange);
        };
    }, []);

    useEffect(() => {
        if (query) next();
    }, [query]);

    const connectionHandler = new sendbird.ConnectionHandler();
    connectionHandler.onReconnectStarted = () => {
        dispatch({
            type: 'error',
            payload: {
                error: 'Connecting...'
            }
        });
    };
    connectionHandler.onReconnectSucceeded = () => {
        dispatch({
            type: 'error',
            payload: {
                error: ''
            }
        });
        refresh();
    };
    connectionHandler.onReconnectFailed = () => {
        dispatch({
            type: 'error',
            payload: {
                error: 'Connection failed. Please check the network status.'
            }
        });
    };

    const channelHandler = new sendbird.ChannelHandler();
    channelHandler.onMessageReceived = (targetChannel, message) => {
        if (targetChannel.url === channel.url) {
            dispatch({type: 'receive-message', payload: {message}});
        }
    };
    channelHandler.onMessageUpdated = (targetChannel, message) => {
        if (targetChannel.url === channel.url) {
            dispatch({type: 'update-message', payload: {message}});
        }
    };
    channelHandler.onMessageDeleted = (targetChannel, messageId) => {
        if (targetChannel.url === channel.url) {
            dispatch({type: 'delete-message', payload: {messageId}});
        }
    };
    channelHandler.onUserLeft = (channel, user) => {
        if (user.userId === currentUser.userId) {
            navigation.navigate('Chat', {
                action: 'leave',
                data: {channel}
            });
        }
    };
    channelHandler.onChannelDeleted = (channelUrl, channelType) => {
        navigation.navigate('Chat', {
            action: 'delete',
            data: {channel}
        });
    };

    const handleStateChange = newState => {
        if (newState === 'active') {
            sendbird.setForegroundState();
        } else {
            sendbird.setBackgroundState();
        }
    };
    const member = () => {
        navigation.navigate('Members', {channel, currentUser});
    };
    const leave = () => {
        Alert.alert('Leave', 'Are you sure you want to leave this channel?', [
            {text: 'No'},
            {
                text: 'Yes',
                onPress: () => {
                    navigation.navigate('Chats', {
                        action: leave,
                        data: {channel}
                    });
                }
            }
        ]);
    };
    const refresh = () => {
        channel.markAsRead();
        setQuery(channel.createPreviousMessageListQuery());
        dispatch({type: 'refresh'});
    };
    const next = () => {
        if (query.hasMore) {
            dispatch({type: 'error', payload: {error: ''}});
            query.limit = 50;
            query.reverse = true;
            query.load((err, fetchedMessages) => {
                if (!err) {
                    dispatch({type: 'fetch-messages', payload: {messages: fetchedMessages}});
                } else {
                    dispatch({type: 'error', payload: {error: 'Failed to get the messages.'}});
                }
            });
        }
    };
    const sendUserMessage = () => {
        if (state.input.length > 0) {
            const params = new sendbird.UserMessageParams();
            params.message = state.input;

            const pendingMessage = channel.sendUserMessage(params, (err, message) => {
                if (!err) {
                    dispatch({type: 'send-message', payload: {message}});
                } else {
                    setTimeout(() => {
                        dispatch({type: 'error', payload: {error: 'Failed to send message.'}});
                        dispatch({type: 'delete-message', payload: {reqId: pendingMessage.reqId}});
                    }, 500);
                }
            });
            dispatch({type: 'send-message', payload: {message: pendingMessage, clearInput: true}});
        }
    };
    const selectFile = async () => {
        try {
            if (Platform.OS === 'android') {

            }
        } catch (err) {
            console.log(err);
        }
    };
    const viewDetail = async message => {
        if (message.isFileMessage()) {
            setMsg(message);
            // @ts-ignore
            console.log(msg.url);
            if (message.type !== 'file') {
                setModalVisible(!modalVisible)
            } else {
                const uri = await downloadFileAsync(message.url)
                console.log(message.url)
                // @ts-ignore
                await Sharing.shareAsync(uri)
            }
        }
    };

    const uploadImage = (params) => {
        const uri = params.uri;

        const paths = uri.split('/');
        const name = paths[paths.length - 1];

        const type = params.type;
        const fileExtension = uri.substr(uri.lastIndexOf('.') + 1);

        const pendingMessage = channel.sendFileMessage({
            uri: uri,
            name: name,
            type: `image/${fileExtension}`
        }, (err, message) => {
            if (!err) {
                dispatch({type: 'send-message', payload: {message}});
            } else {
                setTimeout(() => {
                    dispatch({type: 'error', payload: {error: 'Failed to send message.'}});
                    dispatch({type: 'delete-message', payload: {reqId: pendingMessage.reqId}});
                }, 500);
            }
        });
    }

    const showMessageContextMenu = message => {
        if (message.sender && message.sender.userId === sendbird.currentUser.userId) {
            const options = ['Edit', 'Delete', 'Cancel'];
            const destructiveButtonIndex = 1;
            const cancelButtonIndex = 2;

            showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex,
                    destructiveButtonIndex
                },
                buttonIndex => {
                    switch (buttonIndex) {
                        case 0: // edit
                            break;
                        case 1: // delete
                            break;
                        case 2: // cancel
                            break;
                    }
                }
            );
        }
    };

    const showMessageOptionsContextMenu = () => {
        const options = ['Camera', 'Photo Library', 'Document', 'Cancel'];
        const icons = [<Icon name='delete' tvParallaxProperties={true} />, <Icon name='save' tvParallaxProperties={true} />, <Icon name='share' tvParallaxProperties={true} />]
        const cancelButtonIndex = 3;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                icons
            },
            async buttonIndex => {
                switch (buttonIndex) {
                    case 0: // camera
                        const paramsCamera = getCameraImageAsync();

                        uploadImage(paramsCamera)
                        break;
                    case 1: // library
                        const params = await getLibraryImageAsync();

                        uploadImage(params);
                        break;
                    case 2: // document
                        const docParams = await getDocumentAsync();

                        if (docParams.type !== "cancel") {
                            const uri2 = docParams.uri
                            const name2 = docParams.name

                            const pendingDocumentMessage = channel.sendFileMessage({
                                uri: uri2,
                                name: name2,
                                type: `file`
                            }, (err, message) => {
                                if (!err) {
                                    dispatch({type: 'send-message', payload: {message}});
                                } else {
                                    setTimeout(() => {
                                        dispatch({type: 'error', payload: {error: 'Failed to send message.'}});
                                        dispatch({
                                            type: 'delete-message',
                                            payload: {reqId: pendingDocumentMessage.reqId}
                                        });
                                    }, 500);
                                }
                            });
                        }
                        break;
                    case 3:
                        break; // cancel
                }
            }
        );
    };

    return (
        <>
            <StatusBar backgroundColor='#742ddd' />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={useHeaderHeight()}
            >
                <Modal visible={modalVisible} transparent animationType='fade'>
                    {/* @ts-ignore */}
                    <ImageViewer imageUrls={{msg}} enableSwipeDown onSwipeDown={() => setModalVisible(false)} />
                </Modal>

                <FlatList
                    data={state.messages}
                    renderItem={({item}) => (
                        <Message
                            key={item.reqId}
                            channel={channel}
                            message={item}
                            onPress={(message) => viewDetail(message)}
                            onLongPress={(message) => showMessageContextMenu(message)}
                        />
                    )}
                    keyExtractor={(item) => `${item.messageId}` || item.reqId}
                    contentContainerStyle={{flexGrow: 1, paddingVertical: 10}}
                    ListHeaderComponent={state.error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.error}>{state.error}</Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.empty}>{state.empty}</Text>
                        </View>
                    }
                    onEndReached={() => next()}
                    onEndReachedThreshold={0.5}
                />

                <View style={styles.inputContainer}>

                    <TouchableOpacity activeOpacity={0.85} style={styles.uploadButton} onPress={selectFile}>
                        <Icon name='add' color={COLOR_PRIMARY} size={28} onPress={showMessageOptionsContextMenu} tvParallaxProperties={true}/>
                    </TouchableOpacity>

                    <TextInput
                        value={state.input}
                        style={styles.input}
                        multiline={true}
                        numberOfLines={2}
                        onChangeText={(content) => {
                            content.length > 0 ? channel.startTyping() : channel.endTyping();
                            dispatch({type: 'typing', payload: {input: content}});
                        }}
                    />

                    <TouchableOpacity activeOpacity={0.85} style={styles.sendButton} onPress={sendUserMessage}>
                        <Icon name='send' color={state.input.length > 0 ? COLOR_PRIMARY : '#ddd'} size={28} tvParallaxProperties={true} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerRightContainer: {
        flexDirection: 'row'
    },
    headerRightButton: {
        marginRight: 10
    },
    errorContainer: {
        backgroundColor: '#333',
        opacity: 0.8,
        padding: 10
    },
    error: {
        color: '#fff'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    empty: {
        fontSize: 24,
        color: '#999',
        alignSelf: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 4,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    input: {
        flex: 1,
        fontSize: 20,
        color: '#555'
    },
    uploadButton: {
        marginRight: 10
    },
    sendButton: {
        marginLeft: 10
    }
});

const connectedChatScreen = connectActionSheet(ChatScreen);
export default withAppContext(connectedChatScreen);
