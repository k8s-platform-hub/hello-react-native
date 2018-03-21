import {Alert} from 'react-native';
import {storeSession} from '../../actions';
import {clusterName} from '../../../Hasura';

const tryFbLogin = async (token) => {

  const fbUrl = 'https://graph.facebook.com/me?access_token=' + token;
  let fbProfileInfo = null;
  try {
    fbProfileInfo = await fetch(fbUrl);
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
      "provider": "facebook",
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
      respObj['fb_profile_info'] = fbProfileInfo;
    }
    return respObj;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const handleFacebookAuth = async(appId, loginCallback, loading, stopLoading) => {
    try {
      loading();
      const {type, token}= await Expo.Facebook.logInWithReadPermissionsAsync(appId, { permissions: ['public_profile']});
      if (type === 'success') {
        const facebookProfileInfo = await tryFbLogin(token);
        if (facebookProfileInfo.success) {
          await storeSession({
            id: facebookProfileInfo.hasura_id,
            token: facebookProfileInfo.auth_token,
            facebookProfileInfo: facebookProfileInfo.facebook_profile_info
          });
          loginCallback({
            id: facebookProfileInfo.hasura_id,
            token: facebookProfileInfo.auth_token,
            facebookProfileInfo: facebookProfileInfo.facebook_profile_info
          });
          return;
        }
        else {
          Alert.alert('Error', facebookProfileInfo.message);
          stopLoading();
        }
      } else {
        Alert.alert('Error', 'Facebook login failed');
        stopLoading();
      }
    } catch (e) {
      console.log(e);
      stopLoading();
    }
  }

export {
  handleFacebookAuth
};
