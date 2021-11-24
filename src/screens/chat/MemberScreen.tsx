import React, {useEffect, useLayoutEffect, useReducer} from 'react';
import {AppState, StyleSheet, FlatList, SafeAreaView, StatusBar, TouchableOpacity, View} from 'react-native';
import User from "../../components/User";
import {Icon, Text} from "react-native-elements";
import {MemberReducer} from "../../redux/reducers/MemberReducer";
import {withAppContext} from "../../utils/Context";

const MemberScreen = props => {
    const {route, navigation, sendbird} = props;
    const {currentUser, channel} = route.params;
    const [state, dispatch] = useReducer(MemberReducer, {
        members: channel.members,
        error: ''
    });

    useLayoutEffect(() => {

        const right = (
            // @ts-ignore
            <View style={styles.headerRightContainer}>
                <TouchableOpacity activeOpacity={0.85} style={styles.inviteButton} onPress={invite}>
                    <Icon name="person-add" color="#fff" size={28} tvParallaxProperties={true} />
                </TouchableOpacity>
            </View>
        );
        navigation.setOptions({
            headerRight: () => right
        });
    });

    useEffect(() => {
        sendbird.addConnectionHandler('member', connectionHandler);
        sendbird.addChannelHandler('member', channelHandler);
        AppState.addEventListener('change', handleStateChange);

        if (!sendbird.currentUser) {
            sendbird.connect(currentUser.userId, (err, _) => {
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
            sendbird.removeConnectionHandler('member');
            sendbird.removeChannelHandler('member');
            AppState.removeEventListener('change', handleStateChange);
        };
    }, []);

    const connectionHandler = new sendbird.ConnectionHandler();
    connectionHandler.onReconnectStarted = () => {
        dispatch({
            type: 'error',
            payload: {
                error: 'Connecting..'
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
    channelHandler.onUserJoined = (_, user) => {
        if (user.userId !== currentUser.userId) {
            dispatch({type: 'add-member', payload: {user} });
        }
    };
    channelHandler.onUserLeft = (_, user) => {
        if (user.userId !== currentUser.userId) {
            dispatch({type: 'remove-member', payload: {user} });
        } else {
            navigation.goBack();
        }
    };

    const handleStateChange = newState => {
        if (newState === 'active') {
            sendbird.setForegroundState();
        } else {
            sendbird.setBackgroundState();
        }
    };
    const invite = () => {
        navigation.navigate('Invite', {channel, currentUser});
    };
    const refresh = () => {
        dispatch({type: 'refresh', payload: {members: channel.members} });
    };

    return (
        <>
            <StatusBar backgroundColor="#742ddd" barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={state.members}
                    renderItem={({ item }) => <User user={item} />}
                    keyExtractor={item => item.userId}
                    contentContainerStyle={{ flexGrow: 1 }}
                    ListHeaderComponent={
                        state.error && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.error}>{state.error}</Text>
                            </View>
                        )
                    }
                />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inviteButton: {
        marginRight: 12
    },
    errorContainer: {
        backgroundColor: '#333',
        opacity: 0.8,
        padding: 10
    },
    error: {
        color: '#fff'
    }
});

export default withAppContext(MemberScreen);
