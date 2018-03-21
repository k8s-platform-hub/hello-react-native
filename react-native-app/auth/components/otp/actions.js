import {clusterName} from '../../../Hasura';

const authUrl = `https://auth.${clusterName}.hasura-app.io/v1/`

const sendOtp = async (countryCode, number) => {
  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'mobile': number,
      'country_code': countryCode
    })
  };
  try {
    const response = await fetch(authUrl + 'providers/mobile/send-otp', options);
    const respObj = await response.json();
    if (response.status == 200) {
      respObj['success'] = true;
      return respObj;
    } else {
      return respObj;
    }
  } catch (e) {
    return {
      message: e
    };
  }
}

const verifyOtp = async (countryCode, number, otp, task) => {
  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'provider': 'mobile',
      'data': {
        'mobile': number,
        'country_code': countryCode,
        'otp': otp
      }
    })
  };
  try {
    const response = await fetch(authUrl + task, options);
    const respObj = await response.json();
    if (response.status == 200) {
      respObj['success'] = true;
    }
    return respObj;
  } catch (e) {
    return {
      message: e
    };
  }
}

export {
  sendOtp,
  verifyOtp
};
