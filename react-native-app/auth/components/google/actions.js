import {Alert} from 'react-native';
import {storeSession} from '../../actions';
import {clusterName} from '../../../Hasura';


const tryGoogleLogin = async (token) => {
  let googleInfo = null;
  try {
    googleInfo = fetch ('https://www.googleapis.com/userinfo/v2/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (e) {
    console.log(e);
    return {
      message: e.toString()
    }
  }
  const hasuraAuthUrl = `https://auth.${clusterName}.hasura-app.io/v1/signup`;
  const options = {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "provider": "google",
      "data": {
        "access_token": token
      }
    })
  };
  try {
    const response = await fetch(hasuraAuthUrl, options);
    const respObj = await response.json();
    if (response.status == 200) {
      respObj['success'] = true;
      respObj['google_profile_info'] = googleInfo;
    }
    return respObj;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const handleGoogleAuth = async(androidClientId, iosClientId, loginCallback, startLoadingIndicator, stopLoadingIndicator) => {
  try {
    startLoadingIndicator();
    const result = await Expo.Google.logInAsync({
      androidClientId,
      iosClientId,
      scopes: ['profile', 'email']
    });
    if (result.type === 'success') {
      const googleSignupResp =  await tryGoogleLogin(result.accessToken);
      if (googleSignupResp.success) {
        await storeSession({
          id: googleSignupResp.hasura_id,
          token: googleSignupResp.auth_token,
          googleInfo: googleSignupResp.google_profile_info
        });
        loginCallback({
          id: googleSignupResp.hasura_id,
          token: googleSignupResp.auth_token,
          googleInfo: googleSignupResp.google_profile_info
        });
        return;
      } else {
        Alert.alert('Error', googleSignupResp.message);
        stopLoadingIndicator();
      }
    } else {
      Alert.alert('Error', 'Google login failed');
      stopLoadingIndicator();
    }
  } catch (e) {
    Alert.alert('Request failed', e.message);
    stopLoadingIndicator();
  }
}

export {
  handleGoogleAuth
};
