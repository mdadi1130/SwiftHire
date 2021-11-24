import React, {useEffect, useState} from 'react';
import {Linking, Platform, StyleSheet, Text, View} from 'react-native';

import {Amplify, Auth} from "aws-amplify";
import config from './src/aws-exports';
import SendBird from "sendbird";
import * as WebBrowser from "expo-web-browser";
import {Quicksand_600SemiBold, useFonts} from '@expo-google-fonts/quicksand';
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

Amplify.configure(config);

const appId = '8815EA3C-68EF-4C3B-9579-06145DDED3A3';
const sendbird = new SendBird({appId});
sendbird.setErrorFirstCallback(true);

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

  const updateAuthState = (authenticated) => {
    setAuth(authenticated);
  };

  const Initializing = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Progress.Circle indeterminate color="#999" />
        </View>
    )
  }

  useEffect(() => {
    checkAuthState();
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
    return <AppLoading />;
  } else {
    return (
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <ActionSheetProvider>
              <NavigationContainer>
                <AppContext.Provider value={initialState}>
                  {isAuth === 'initializing' && <Initializing />}
                  {isAuth === 'true' && (<TabNavigator updateAuthState={updateAuthState} />)}
                  {isAuth === 'false' && (<AuthStackNavigator updateAuthState={updateAuthState} />)}
                </AppContext.Provider>
              </NavigationContainer>
            </ActionSheetProvider>
          </PersistGate>
        </Provider>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
