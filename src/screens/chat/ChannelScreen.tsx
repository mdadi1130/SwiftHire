import React, {useEffect, useLayoutEffect, useReducer, useState} from 'react';
import {StyleSheet, AppState, FlatList, RefreshControl, SafeAreaView, TouchableOpacity, View} from "react-native";
import {Icon, Overlay, SearchBar, Text} from "react-native-elements";
import {ChannelsReducer} from "../../redux/reducers/ChannelsReducer";
import GestureRecognizer from "react-native-swipe-gestures";
import Channel from "../../components/Channel";
import {withAppContext} from "../../utils/Context";
import {handleNotificationAction, listUsers} from "../../utils/Utils"
import {useSelector} from "react-redux";
import {StatusBar} from "expo-status-bar";

const ChannelScreen = props => {
    const {route, navigation, sendbird, currentUser} = props;

    const userAttrs = useSelector(state => state['AuthReducer'].user.attributes);
    const email = userAttrs['email'];

    const [query, setQuery] = useState(null);

    const [searchChats, setSearchChats] = useState('');
    const [searchUsers, setSearchUsers] = useState('');

    const [visible, setVisible] = useState(false);

    const [state, dispatch] = useReducer(ChannelsReducer, {
        sendbird,
        currentUser,
        channels: [],
        channelMap: {},
        loading: false,
        empty: '',
        error: null
    });

    useLayoutEffect(() => {
        const right = (
            <TouchableOpacity activeOpacity={0.85} onPress={toggleCreateChat}>
                <Icon name="create-outline" type='ionicon' color="#2a682a" size={28} tvParallaxProperties={true} />
            </TouchableOpacity>
        );
        const left = (
            <TouchableOpacity activeOpacity={0.85}>
                <Text style={{color: '#2a682a', fontSize: 16}}>Edit</Text>
            </TouchableOpacity>
        )

        navigation.setOptions({
            headerRight: () => right,
            headerLeft: () => left
        });
    });
    console.log(sendbird.currentUser)
    useEffect(() => {
        sendbird.addConnectionHandler('channels', connectionHandler);
        sendbird.addChannelHandler('channels', channelHandler);
        AppState.addEventListener('change', handleStateChange);

        if (!sendbird.currentUser) {
            sendbird.connect(email, (err, _) => {
                if (!err) {
                    refresh();
                } else {
                    dispatch({
                        type: 'end-loading',
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
            dispatch({type: 'end-loading'});
            sendbird.removeConnectionHandler('channels');
            sendbird.removeChannelHandler('channels');
            AppState.removeEventListener('change', handleStateChange);
        };
    }, []);

    useEffect(() => {
        if (route.params && route.params.action) {
            const {action, data} = route.params;
            switch (action) {
                case 'leave':
                    data.channel.leave(err => {
                        if (err) {
                            dispatch({
                                type: 'error',
                                payload: {
                                    error: 'Failed to leave the channel.'
                                }
                            });
                        }
                    });
                    break;
            }
        }
    }, [route.params]);

    useEffect(() => {
        if (query) next();
    }, [query]);

    const connectionHandler = new sendbird.ConnectionHandler();
    connectionHandler.onReconnectStarted = () => {
        dispatch({
            type: 'error',
            payload: {
                error: 'Connecting..'
            }
        });
    };
    connectionHandler.onReconnectStarted = () => {
        dispatch({type: 'error', payload: {error: null}});
        refresh();

        handleNotificationAction(navigation, sendbird, currentUser).catch(err => console.error(err));
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
    channelHandler.onUserJoined = (channel, user) => {
        if (user.userId === sendbird.currentUser.userId) {
            dispatch({type: 'join-channel', payload: {channel}});
        }
    };
    channelHandler.onUserLeft = (channel, user) => {
        if (user.userId === sendbird.currentUser.userId) {
            dispatch({type: 'leave-channel', payload: {channel}});
        }
    };
    channelHandler.onChannelChanged = channel => {
        dispatch({type: 'update-channel', payload: {channel}});
    };
    channelHandler.onChannelDeleted = channel => {
        dispatch({type: 'delete-channel', payload: {channel}});
    };

    const handleStateChange = newState => {
        if (newState === 'active') {
            sendbird.setForegroundState();
        } else {
            sendbird.setBackgroundState();
        }
    };
    const toggleCreateChat = () => {
        setVisible(!visible);
    };
    const chat = channel => {
        navigation.navigate('ChatDetails', {
            channel,
            currentUser
        });
    };
    const refresh = () => {
        setQuery(sendbird.GroupChannel.createMyGroupChannelListQuery());
        dispatch({type: 'refresh'});
    };
    const next = () => {
        if (query.hasNext) {
            dispatch({type: 'start-loading'});
            query.limit = 20;
            query.next((err, fetchedChannels) => {
                dispatch({type: 'end-loading'});
                if (!err) {
                    dispatch({
                        type: 'fetch-channels',
                        payload: {channels: fetchedChannels}
                    });
                } else {
                    dispatch({
                        type: 'error',
                        payload: {
                            error: 'Failed to get the channels.'
                        }
                    });
                }
            });
        }
    };
    return (
        <>
            <StatusBar backgroundColor="#742ddd" />
            <SafeAreaView style={styles.container}>
                {/* @ts-ignore */}
                <SearchBar inputContainerStyle={{borderRadius: 24, height: 40}} containerStyle={{backgroundColor: 'transparent'}} placeholder="Search" onChangeText={value => setSearchChats(value)} value={searchChats} lightTheme />
                <FlatList
                    data={state.channels}
                    renderItem={({ item }) => <Channel key={item.url} channel={item} onPress={channel => chat(channel)} />}
                    keyExtractor={item => item.url}
                    refreshControl={
                        <RefreshControl refreshing={state.loading} colors={['#2a682a']} tintColor={'#338a33'} onRefresh={refresh} />
                    }
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListHeaderComponent={
                        state.error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.error}>{state.error}</Text>
                            </View>
                        )
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.empty}>{state.empty}</Text>
                        </View>
                    }
                    onEndReached={() => next()}
                    onEndReachedThreshold={0.5}
                />
                <GestureRecognizer onSwipeDown={toggleCreateChat}>
                    <Overlay presentationStyle='pageSheet' fullScreen={true} backdropStyle={{backgroundColor: 'white'}} transparent={false} isVisible={visible} onBackdropPress={toggleCreateChat} animationType='slide' style={{alignSelf: 'flex-start'}}>
                        <View style={{flexDirection: 'row', margin: 20}}>
                            <Text style={{fontWeight: 'bold', fontSize: 16, flex: 1, alignItems: 'center', paddingStart: 115}}>New Chat</Text>
                            <TouchableOpacity onPress={() => setVisible(false)} style={{flex: 1, alignItems: 'flex-end'}}>
                                <Text style={{fontSize: 16, color: '#2a682a'}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        {/* @ts-ignore */}
                        <SearchBar lightTheme placeholder='Search' inputContainerStyle={{borderRadius: 24, height: 40}} containerStyle={{backgroundColor: 'transparent'}} onChangeText={value => setSearchUsers(value)} value={searchUsers} />
                    </Overlay>
                </GestureRecognizer>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    errorContainer: {
        backgroundColor: '#333',
        opacity: 0.8,
        padding: 10
    },
    error: {
        color: '#fff'
    },
    loading: {
        position: 'absolute',
        right: 20,
        bottom: 20
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
    }
});

export default withAppContext(ChannelScreen);
