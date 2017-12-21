Hello React Native
==================

Introduction
------------

This is a fully working react-native app with a [Hasura](https://hasura.io) backend. You can clone it and modify as per your requirements. It has basic BaaS features implemented. Also, it uses [NativeBase](https://nativebase.io) for better UI.

- When you clone this quickstart project, there are two tables (article and author) in your database populated with some data.

```:bash
Note: This is just to get you familiar with the system. You can delete these tables whenever you like.
```

- There is a login screen in this app where the authentication is managed by the Hasura Auth APIs.
- Then we make data API calls to get the list of articles and their authors.
- The functions that make these calls are in the `react-native/src/hasuraApi.js` file. Modify it as you like and the changes will reflect in the app.

In order to get this app running, you must have the following:
1. [hasura CLI tool](https://docs.hasura.io/0.15/manual/install-hasura-cli.html) (hasura).

2. Expo client (XDE). Download from https://expo.io/tools

3. NodeJS

(For more such apps, check out https://hasura.io/hub)

Pushing the project to the cluster
-----------------------------------

- To get cluster information, run `hasura cluster status`. Info will be of the following form.

```
INFO Reading cluster status...
INFO Status:
Cluster Name:       athlete80
Cluster Alias:      hasura
Kube Context:       athlete80
Platform Version:   v0.15.3
Cluster State:      Synced
```

- Set the cluster name in your project by modifying `react-native -> src -> hasuraApi.js`

```:javascript
const clusterName = athlete80;
```

- Install the required node modules. Run the following command from the project directory.

```
$ cd react-native && npm install
```

- Run the following commands from your project directory your project to your Hasura cluster.
```
$ git add .
$ git commit -m "Commit message"
$ git push hasura master
```
**The app is now ready to use!!**

Opening the app
---------------
- Open Expo XDE, do a login/signup and click on `Open existing project...`. Browse to the hello-react-native directory and open the react-native folder.
- Once the project loads, click on Share.
- Scan the QR code using the Expo app from your phone (Install from Playstore/Appstore)
- Fully working app will open on your phone

```
Note: You can open the app with any of your desired react-native simulators. We prefer Expo because of its simple onboarding for beginners.
```

(*Shoutout to [NativeBase](https://nativebase.io) for their excellent UI components.*)

Using a database
---------------- 
- Hasura provides instant data APIs over Postgres to make powerful data queries. For example, to select "id" and "title" of all rows from the article table, make this query to `https://data.<cluster-name>.hasura-app.io/v1/query/`

```:json
{
    "type":"select",
    "args":{
        "table":"article",
        "columns":[
            "title",
            "id"
        ],
        "where":{
            "author_id":4
        }
    }
}
```

- This app uses the above query and renders the list of articles as shown below.

![List of articles](https://github.com/hasura/hello-react-native/raw/master/readme-assets/list.png)

- You can also exploit relationships. In the pre-populated schema, the author table has a relationship to the article table. The app uses the following query to render the article page.
```:json
{
    "type":"select",
    "args":{
        "table":"article",
        "columns":[
            "title",
            "content"
            "id",
            {
                "name": "author",
                "columns":[
                    "name",
                    "id"
                ]
            }
        ],
        "where":{
            "author_id":4
        }
    }
}
```
![List of articles](https://github.com/hasura/hello-react-native/raw/master/readme-assets/article.png)

- You can build such queries easily using the query builder on API-Console.

![QueryBuilder](https://media.giphy.com/media/3oFzmaJy6xGNehrGUg/giphy.gif)

- Also, there are ready made code snippets generated for the query that you build with the query builder. You can instantly copy and paste them in your code.

![CodeGen](https://media.giphy.com/media/3o7524EoojncABE5Ve/giphy.gif)

```
$ hasura api-console
```

Adding authentication
---------------------
- Every app almost always requires some form of authentication. Hasura gives you a flexibility to implement almost every popular login mechanism (mobile, email, facebook, google etc) in your app.
- In this application, we are using just the normal username password login. You can implement whichever login you need. The auth screen looks like this.

![List of articles](https://github.com/hasura/hello-react-native/raw/master/readme-assets/auth.png)

- You can try out all the auth APIs in the API console. Check out.

```
$ hasura api-console
```

Migrating an existing project
-----------------------------
- Replace react-native directory with your pre-existing react-native project directory.
- run `npm install` from this new directory
- Make changes in your backend with API-Console
- App is ready

Custom microservices
--------------------
- Sometimes you might need to add new microservices/APIs as per your requirements. In such cases, you can deploy your microservices with Hasura using git push or docker.
- This quickstart comes with one such custom microservice written in nodejs using the express framework. Check it out in action at `https://api.<cluster-name>.hasura-app.io`. Currently, it just returns a "Hello-React" at that endpoint.
- This microservice is in the microservices folder of the project directory. You can add your custom microservice there.
- To generate your own custom microservice, run
```
$ hasura microservice generate --help
```
