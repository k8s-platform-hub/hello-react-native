import {AsyncStorage} from 'react-native';
import React from 'react';
import {clusterName} from '../Hasura';
import Expo from 'expo';

const fetchAuthConf = async () => {
  const url = `https://auth.${clusterName}.hasura-app.io/ui/conf`;
  const options = {
    'method': 'GET'
  }
  try {
    const response = await fetch(url, options);
    const respObj = await response.json();
    if (response.status == 200) {
      respObj["success"] = true;
    }
    return respObj;
  }
  catch (error) {
    console.log(error);
    return {
      message: error
    };
  }
};

const storeSession = async (sessionObj) => {
  try {
    await AsyncStorage.setItem(`@${clusterName}:myapp`, JSON.stringify(sessionObj));
  } catch (e) {
  }
}

const fetchSession = async () => {
  try {
    const sessionString = await AsyncStorage.getItem(`@${clusterName}:myapp`);
    const sessionObj = await JSON.parse(sessionString);
    return sessionObj;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const loadFonts = async () => {
  await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
}

export {
  fetchAuthConf,
  storeSession,
  fetchSession,
  loadFonts
};
