import React, {useEffect, useState} from 'react';
import {Linking, Platform, View} from 'react-native';

import {Amplify, Auth} from "aws-amplify";
import config from './src/aws-exports';
import SendBird from "sendbird";
import * as WebBrowser from "expo-web-browser";
import {Quicksand_600SemiBold} from '@expo-google-fonts/quicksand';
import * as Progress from "react-native-progress";
import AppLoading from "expo-app-loading";
import {Provider} from "react-redux";
import {persistor, store} from "./src/redux/Store";
import {PersistGate} from "redux-persist/integration/react";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import {NavigationContainer} from "@react-navigation/native";
import AuthStackNavigator from "./src/navigators/AuthStackNavigator";
import TabNavigator from "./src/navigators/TabNavigator";
import { AppContext } from './src/utils/Context';
import {PTSans_400Regular, PTSans_700Bold} from "@expo-google-fonts/pt-sans";
import {Raleway_500Medium} from "@expo-google-fonts/raleway";
import {Montserrat_400Regular, Montserrat_600SemiBold} from "@expo-google-fonts/montserrat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import {onRemoteMessage} from "./src/utils/Utils";
import {useFonts} from "expo-font";
import OneSignal from 'react-native-onesignal';
import {Analytics, AWSKinesisProvider} from '@aws-amplify/analytics';

import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://21852623793a4e8285b9194fb7836dcf@o1077479.ingest.sentry.io/6080485',
  enableInExpoDevelopment: true,
  debug: true, // Set false for production
});

Amplify.configure(config);

Analytics.addPluggable(new AWSKinesisProvider());
Analytics.configure({
  AWSKinesis: {
    region: config.aws_project_region
  }
});

const appId = 'C583A4EA-6CB0-4D55-A0A8-F7518E00E922';
const sendbird = new SendBird({appId});
sendbird.setErrorFirstCallback(true);

// Initialize OneSignal
OneSignal.setLogLevel(6, 0);
OneSignal.setAppId("c5e15aaf-0dce-48b8-9b56-845407c874f7");

// Prompt push notifications for iOS
OneSignal.promptForPushNotificationsWithUserResponse(response => {
  console.log('Prompt response:', response);
});

// Handle notifications received with app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  console.log('notification: ', notification);
  const data = notification.additionalData;
  console.log('additionalData: ', data);
  notificationReceivedEvent.complete(notification);
});

// Handle notification opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log('OneSignal: notification opened', notification);
});

const savedUserKey = 'savedUser';

const initialState = {
  user: {},
  isLoading: true,
  sendbird
};

const urlOpener = async (url, redirectUrl) => {
  // @ts-ignore
  const {type, url: newUrl} = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

  if (type === 'success' && Platform.OS === 'ios') {
    WebBrowser.dismissBrowser();
    return Linking.openURL(newUrl);
  }
};

const App = () => {
  const [isAuth, setAuth] = useState('initializing');

  const checkAuthState = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('User signed in');
      setAuth('true');
    } catch (error) {
      console.log('User not signed in');
      setAuth('false');
    }
  };

  const updateAuthState = (isAuth) => {
    setAuth(isAuth);
  };

  const Initializing = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Progress.Circle indeterminate color="#999"/>
        </View>
    )
  }

  useEffect(() => {
    checkAuthState();

    AsyncStorage.getItem(savedUserKey)
        .then(async (user) => {
          try {
            if (user) {
              const authStatus = await messaging().requestPermission();
              if (authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                  authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
                if (Platform.OS === 'ios') {
                  const token = await messaging().getToken();
                  await sendbird.registerAPNSPushTokenForCurrentUser(token);
                } else {
                  const token = await messaging().getToken();
                  await sendbird.registerGCMPushTokenForCurrentUser(token);
                }
              }
            }
          } catch (err) {
            console.error(err);
          }
        }).catch(err => console.error(err));

    if (Platform.OS !== 'ios') {
      return messaging().onMessage(onRemoteMessage);
    }
  }, []);

  let [fontsLoaded] = useFonts({
    Quicksand_600SemiBold,
    PTSans_700Bold,
    PTSans_400Regular,
    Raleway_500Medium,
    Montserrat_400Regular,
    Montserrat_600SemiBold
  });

  if (!fontsLoaded) {
    return <AppLoading/>;
  } else {
    return (
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <ActionSheetProvider>
              <NavigationContainer>
                <AppContext.Provider value={initialState}>
                  {isAuth === 'initializing' && <Initializing/>}
                  {isAuth === 'true' && (<TabNavigator updateAuthState={updateAuthState}/>)}
                  {isAuth === 'false' && (<AuthStackNavigator updateAuthState={updateAuthState}/>)}
                </AppContext.Provider>
              </NavigationContainer>
            </ActionSheetProvider>
          </PersistGate>
        </Provider>
    );
  }
};

export default App;
