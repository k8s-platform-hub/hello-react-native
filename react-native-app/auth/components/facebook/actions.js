import {Alert} from 'react-native';
import {storeSession} from '../../actions';
import {clusterName} from '../../../Hasura';

const tryFbLogin = async (token) => {

  const fbUrl = 'https://graph.facebook.com/me?access_token=' + token;
  let fbProfileInfo = null;
  try {
    fbResp = await fetch(fbUrl);
    fbProfileInfo = await fbResp.json();
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
            facebookProfileInfo: facebookProfileInfo.fb_profile_info,
            type: "facebook"
          });
          loginCallback({
            id: facebookProfileInfo.hasura_id,
            token: facebookProfileInfo.auth_token,
            facebookProfileInfo: facebookProfileInfo.fb_profile_info,
            type: "facebook"
          });
          return;
        }
        else {
          Alert.alert('Error', facebookProfileInfo.message);
          stopLoading();
        }
      } else {
        console.log("Facebook login failed: Type: " + type);
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
