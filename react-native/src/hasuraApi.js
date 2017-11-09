const clusterName = "clarification20"

const dataUrl = "https://data." + clusterName + ".hasura-app.io/v1/query";
const loginUrl = "https://auth." + clusterName + ".hasura-app.io/v1/login";
const signupUrl = "https://auth." + clusterName + ".hasura-app.io/v1/signup";

export async function trySignup(username, password) {
  console.log('Makign API Call')
  let requestOptions = {
    "method": "POST",
    "headers": {
      "Content-Type":"application/json"
    }
  }

  let body = {
    "provider":"username",
    "data": {
      "username": username,
      "password": password
    }
  }

  requestOptions["body"] = JSON.stringify(body);

  let resp = await fetch(signupUrl, requestOptions);
  console.log("Auth Response ---------------------")
  console.log(resp);
  return resp;
}

export async function tryLogin(username, password) {
  console.log('Makign API Call')
  let requestOptions = {
    "method": "POST",
    "headers": {
      "Content-Type":"application/json"
    }
  }

  let body = {
    "provider":"username",
    "data": {
      "username": username,
      "password": password
    }
  }

  requestOptions["body"] = JSON.stringify(body);

  let resp = await fetch(loginUrl, requestOptions);
  console.log("Auth Response ---------------------")
  console.log(resp);
  return resp;
}

export async function getArticleList() {
	console.log('Makign API Call')
  let requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  let body = {
      "type": "select",
      "args": {
          "table": "article",
          "columns": [
              "id",
              "title",
          ]
      }
  };

  requestOptions["body"] = JSON.stringify(body);

  try {
  	let resp = await fetch(dataUrl, requestOptions);
    console.log(resp)
  	return resp; 
  }
  catch(e) {
  	console.log("Request Failed: " + e)
  }
}

export async function getArticle(id) {
  console.log('Makign API Call')
  let requestOptions = {
      "method": "POST",
      "headers": {
          "Content-Type": "application/json"
      }
  };

  let body = {
      "type": "select",
      "args": {
          "table": "article",
          "columns": [
              "content",
              "id",
              "title",
              {
                "name": "author",
                "columns":[
                  "name"
                ]
              }
          ],
          "where": {
              "id": {
                  "$eq": id
              }
          }
      }
  };

  requestOptions["body"] = JSON.stringify(body);

  try{
  	let resp = await fetch(dataUrl, requestOptions);
    console.log(resp)
  	return resp;
  }
  catch (e) {
  	console.log("Request failed: " + e);
  }
};
