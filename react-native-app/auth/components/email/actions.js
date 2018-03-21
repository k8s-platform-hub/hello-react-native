import {clusterName} from '../../../Hasura';

const authUrl = `https://auth.${clusterName}.hasura-app.io/v1/`;

const tryEmailSignup = async (email, password) => {
  const signupUrl = authUrl + 'signup';
  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify({
      'provider': 'email',
      'data': {
        'email': email,
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
    return {
      message: e
    }
  }
}

const tryEmailLogin = async (email, password) => {
  const loginUrl = authUrl + 'login';
  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify({
      'provider': 'email',
      'data': {
        'email': email,
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
    return {
      message: e
    }
  }
}

const forgotPassword = async (email) => {
  const fpUrl = authUrl + 'providers/email/forgot-password';

  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify({
      'email': email
    })
  };
  try {
    const response = await fetch(fpUrl, options);
    const respObj = await response.json();
    if (response.status == 200) {
      respObj['success'] = true;
    }
    return respObj;
  } catch (e) {
    console.log(e);
    return {
      message: e
    }
  }
}

const resendVerification = async (email) => {
  const rvUrl = authUrl + 'providers/email/resend-verification';
  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
    },
    'body': JSON.stringify({
      'email': email
    })
  };
  try {
    const response = await fetch(rvUrl, options);
    const respObj = await response.json();
    if (response.status == 200) {
      respObj['success'] = true;
    }
    return respObj;
  } catch (e) {
    console.log(e);
    return {
      message: e
    };
  }
}

export {
  tryEmailSignup,
  tryEmailLogin,
  resendVerification,
  forgotPassword
};
