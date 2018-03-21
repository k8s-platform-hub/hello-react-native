import {clusterName} from '../../../Hasura';

const authUrl = `https://auth.${clusterName}.hasura-app.io/v1/`;

const trySignup = async (username, password) => {
  const signupUrl = authUrl + 'signup';
  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify({
      'provider': 'username',
      'data': {
        'username': username,
        'password': password
      }
    })
  };
  try {
    const response = await fetch(signupUrl, options);
    const respObj = await response.json();
    if (response.status == 200) {
      respObj['success'] = true;
    }
    return respObj;
  } catch (e) {
    console.log(e);
    return e;
  }
}

const tryLogin = async (username, password) => {
  const loginUrl = authUrl + 'login';
  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify({
      'provider': 'username',
      'data': {
        'username': username,
        'password': password
      }
    })
  };
  try {
    const response = await fetch(loginUrl, options);
    const respObj = await response.json();
    if (response.status == 200) {
      respObj['success'] = true;
    }
    return respObj;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export {
  trySignup,
  tryLogin
};
