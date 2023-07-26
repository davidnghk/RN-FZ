/**
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import 'intl'
import 'intl/locale-data/jsonp/en'


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  ('Message handled in the background!', remoteMessage);
  console.log('Counter: ', remoteMessage.data.counter);

  // let counter = parseInt(remoteMessage.data.counter);

});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}



AppRegistry.registerComponent(appName, () => HeadlessCheck);
