import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API, Auth} from "aws-amplify";
import notifee from '@notifee/react-native';
import {CommonActions} from "@react-navigation/native";

const channelNameMaxMembers = 3;
const channelNameEllipsisLength = 32;
const maxUnreadMessageCount = 99;

export const ellipsis = (s, len) => {
    return s.length > len ? s.substring(0, len) + '..' : s;
};

export const createChannelName = (channel) => {
    if (channel.name === 'Group Channel' || channel.name.length === 0) {
        const nicknames = channel.members.map(m => m.nickname);
        if (nicknames.length > channelNameMaxMembers) {
            return ellipsis(
                `${nicknames.slice(0, channelNameMaxMembers + 1).join(', ')} and ${nicknames.length - channelNameMaxMembers} others`,
                channelNameEllipsisLength
            );
        } else {
            return ellipsis(`${nicknames.join(', ')}`, channelNameEllipsisLength);
        }
    }
    return ellipsis(channel.name, channelNameEllipsisLength);
};

export const createUnreadMessageCount = (channel) => {
    if (channel.unreadMessageCount > maxUnreadMessageCount) {
        return `${maxUnreadMessageCount}+`;
    } else {
        return `${channel.unreadMessageCount}`;
    }
};

export const onRemoteMessage = async (remoteMessage) => {
    const channelId = await notifee.createChannel ({
        id: 'SendbirdNotificationChannel',
        name: 'SwiftHire Chat'
    });

    if (remoteMessage && remoteMessage.data) {
        let pushActionId = 'SwiftHireNotification-';

        const message = JSON.parse(remoteMessage.data.sendbird);
        let channelUrl = null;
        if (message && message.channel) {
            channelUrl = message.channel['channel_url'];
        }
        pushActionId += channelUrl;

        await AsyncStorage.setItem(pushActionId, JSON.stringify(remoteMessage));

        await notifee.displayNotification({
            title: 'SwiftHire Chat',
            body: remoteMessage.data.message,
            android: {
                channelId,
                pressAction: {
                    id: pushActionId,
                    launchActivity: 'default'
                }
            }
        });
    }
};

export const handleNotificationAction = async (navigation, sendbird, currentUser) => {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification && initialNotification.pressAction) {
        const remoteMessage = JSON.parse(await AsyncStorage.getItem(initialNotification.pressAction.id));
        if (remoteMessage && remoteMessage.data) {
            const message = JSON.parse(remoteMessage.data.sendbird);
            if (message && message.channel) {
                const channel = await sendbird.groupChannel.getChannel(message.channel['channel_url']);
                navigation.dispatch(state => {
                    const channelsIndex = state.route.findIndex(route => route.name === 'Channels');
                    const newRoute = {name: 'Chat', params: {channel, currentUser}};
                    const routes = [...state.routes.slice(0, channelsIndex + 1), newRoute];
                    const action = CommonActions.reset({...state, routes, index: routes.length - 1});

                    const chatRoute = state.routes.find(route => route.name === 'Chat');
                    if (chatRoute && chatRoute.params && chatRoute.params.channel) {
                        if (chatRoute.params.channel.url === channel.url) {
                            return CommonActions.reset(state);
                        } else {
                            return action;
                        }
                    } else {
                        return action;
                    }
                });
                await AsyncStorage.removeItem(initialNotification.pressAction.id);
            }
        }
    }
};

export const getNameInitials = (name) => {
    return name.split(' ').map(n => n[0]);
};

export const getCameraImageAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
        alert('Permission to access camera is required');
        return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3]
    });
    console.log(pickerResult);
    if (!pickerResult.cancelled) {
        return pickerResult;
    }
};

export const getLibraryImageAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
        alert('Permission to access photo library is required');
        return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
    });
    console.log(pickerResult);
    if (!pickerResult.cancelled) {
        return pickerResult;
    }
};

export const getDocumentAsync = async () => {
    let result = await DocumentPicker.getDocumentAsync();
    console.log(result);
    return result;
};

export const downloadFileAsync = async (url) => {
    const callback = downloadProgress => {

    };

    const paths = url.split('/');
    const name = paths[paths.length - 1];

    const downloadResumable = FileSystem.createDownloadResumable(
        url,
        FileSystem.documentDirectory + name,
        {},
        callback
    );

    try {
        const uri = await downloadResumable.downloadAsync();
        console.log('Finished downloading to ' + uri);

        return uri;
    } catch (e) {
        console.error(e);
    }

    try {
        await downloadResumable.pauseAsync();
        console.log('Paused download operation, saving for future retrieval');
        await AsyncStorage.setItem('pausedDownload', JSON.stringify(downloadResumable.savable()));
    } catch (e) {
        console.error(e);
    }

    try {
        const uri = await downloadResumable.resumeAsync();
        console.log('Finished downloading to ', uri);
    } catch (e) {
        console.error(e);
    }
};

let nextToken;
export const listUsers = async (limit) => {
    let apiName = 'AdminQueries';
    let path = '/listUsers';
    let myInit = {
        queryStringParameters: {
            "limit": limit,
            "token": nextToken
        },
        headers: {
            'Content-Type' : 'application/json',
            Authorization: `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`
        }
    }
    const {NextToken, ...rest} = await API.get(apiName, path, myInit);
    nextToken = NextToken;
    return rest;
};
