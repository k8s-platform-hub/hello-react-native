# Pre-requisites

- Basic knowledge of React Native application development.
- A basic knowledge of Javascript or atleast the readiness to pick it up.
- A basic understanding of relational databases.
- `git` installed on your local machine and also a basic knowledge of using `git`

# Getting started

Before you begin, ensure that you have the **Hasura CLI** installed on your local machine. If not, you can find the instructions to install it [here](https://docs.hasura.io/0.15/manual/install-hasura-cli.html). Once you have the CLI tool installed, login or signup into Hasura by running the following command on your terminal:

```bash
$ hasura login
```

There are two steps required to get started with Hasura.

**Step 1**: Get a Hasura project and a Hasura cluster

>A **hasura project** is a folder on your filesystem that contains all the source code and configuration for your application. A hasura project has a particular structure and the best way to create a hasura project is by cloning one from hasura.io/hub. Every project you see on hasura.io/hub is a `Hasura Project` with particular services or data added to it based on the type of project it is. To know more about a Hasura Project, check out the [docs](https://docs.hasura.io/0.15/manual/project/index.html).

We are going to clone the `hello-react-native` project which consists of:
- Boilerplate code for a nodejs server to handle push notifications and a websocket connection
- A basic React Native application with working code implementing the various backend features covered in this tutorial

To get the project,

```bash
$ hasura quickstart hasura/hello-react-native
```

The above command does the following:
- Creates a new directory in your current directory called `hello-react-native` and clones the content of the `hello-react-native` project from Hasura Hub into it.
- Makes this new directory a `git` repository and adds a remote called `hasura` to it.
- It also creates a free `Hasura Cluster` for you and `adds` this cluster to the cloned hasura project.

>A **Hasura cluster** is a cluster of nodes (VMs) on the cloud that can host any Hasura project. It has all the Hasura microservices running and the necessary tooling for you to deploy your Hasura project. Every Hasura cluster comes with a name and a domain attached to it as well. Eg: `awesome45.hasura-app.io`. Know more [here](https://docs.hasura.io/0.15/manual/cluster/index.html).

**Step 2**: Deploy the project to your cluster

```bash
$ # cd into the project directory
$ cd hello-react-native
$ # Make your initial commit
$ git add . && git commit -m "Initial Commit"
$ # Push to the hasura remote
$ git push hasura master
```

>

## Setting the cluster name in the client apps

- Open the `react-native-app` directory present in the root directory of the project.
- Navigate to a file named `Hasura.js`.
- Replace the value for the variable `clusterName` with the name of your cluster.

```javascript
  const clusterName = 'yourclustername43';
```

# The API Console

Every Hasura cluster comes with an `API Console` that you can use to explore the various backend features provided by Hasura. To access the API console,

```bash
$ # Run the following inside the project directory
$ hasura api-console
```

This will open up the console on your browser. You can access it at http://localhost:9695. We will be using the `API Console` extensively during this tutorial.

# Database with GraphQL

Most apps require a database to store and retrieve information from. Hasura provides instant GraphQL APIs over Postgres. This means, you can create a table and immediately get an endpoint to make GraphQL queries and mutations.

Let's explore how to do this. Open the API Console and click on the `Data` tab:

```bash
$ hasura api-console
```

![Data Tab](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-tab.png)

## Creating a table

Click on the `Create Table` button. Let's start off with a table called `user_details` which we will use to store extra information about a user, like their name and gender. We will also be adding an additional column `user_id` to store the `hasura_id` of the user. `user_id` will also be our primary key as the `hasura_id` for every user is always unique.

![Data CreateTable](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-createtable.png)

Click the `Create` button to create the table.

## Making queries as admin

Go to the `API-Explorer` in the console and select `GraphQL` in the left panel. Try writing a mutation to insert an entry to the `user_details` table that we just created.

> Please Make sure you add the `Admin token` in the request headers. By default, only `Admin` can perform operations on the tables. We will later learn how to enable these operations for `logged in users` and `anonymous users`.

![Data GraphQL Mutation](https://raw.githubusercontent.com/hasura/hello-react-native/graphql-revamp/assets/graphql_mutation.png)

Now that we have inserted data into the table, lets try to fetch this information.

![Data GraphQL Query](https://raw.githubusercontent.com/hasura/hello-react-native/graphql-revamp/assets/graphql_query.png)


To learn more about using GraphQL with Hasura, [check the docs](https://docs.hasura.io/0.15/manual/data/graphql.html).

## Setting up the Apollo Client

This section covers how to set up Apollo client for efficiently using GraphQL in your React Native apps.

### Configuration

1. Install the required dependencies

  ```bash
  $ npm install apollo-boost react-apollo graphql --save
  ```

2. Create an [ApolloClient](https://www.apollographql.com/docs/react/basics/setup.html#ApolloClient) instance and point it to the Hasura Data GraphQL URL via [Apollo Link](https://www.apollographql.com/docs/link/).

  ```javascript
  import { ApolloClient } from 'apollo-client';
  import { HttpLink } from 'apollo-link-http';
  import { InMemoryCache } from 'apollo-cache-inmemory';

  const GRAPHQL_URL = "https://data.<cluster-name>.hasura-app.io/v1alpha1/graphql";

  const client = new ApolloClient({
    link: new HttpLink({uri: GRAPHQL_URL}),
    cache: new InMemoryCache({
      addTypename: false
    })
  });
  ```

> Important: You have to configure ``addTypename`` to false in the ``InMemoryCache`` constructor.*

3. Connect the client to your component tree using the ``ApolloProvider`` component. It is important to put ``ApolloProvider`` above every component where you need the GraphQL data. For example, it could be before registering your root component.

```javascript
  import { ApolloProvider } from 'react-apollo';
  import { ApolloClient } from 'apollo-client';
  import { HttpLink } from 'apollo-link-http';
  import { InMemoryCache } from 'apollo-cache-inmemory';
  import { App } from './App';

  const GRAPHQL_URL = "https://data.<cluster-name>.hasura-app.io/v1alpha1/graphql";

  const client = new ApolloClient({
    link: new HttpLink({uri: GRAPHQL_URL}),
    cache: new InMemoryCache()
  });

  const AppWithClient= () => (
    <ApolloProvider client={client}>
      <App/>
    </ApolloProvider>
  );

  AppRegistry.registerComponent('MyApplication', () => AppWithClient);
```

That's it. You can now make queries and mutations in all the children components.

## Mobile App Reference

The React Native app in this project uses Apollo client to make GraphQL queries and mutations. You can check the configuration in `react-native-app/src/AppScreen.js` file.

# Authentication

Every modern app almost always requires some form of authentication. This is useful to identify a user and provide some sort of personalized experience to the user. Hasura provides various types of authentication methods (username/password, mobile/otp, email/password, Google, Facebook etc).

In this tutorial, we are going to take a look at a simple username/password based authentication. Start by opening up the `API Console`. Ensure that you are on the `API Explorer` tab.

## Signup

Let's first take a look at the signup endpoint. From the panel on the left, click on `SignUp` under `Username/Password`. Next, fill up your required username and password.

![Auth SignUp](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/auth-signup.png)

We are going with the username "jacksniper" and password "jack@sniper". You can choose any username and password combination. Once you have decided on your username and password, hit on the `Send` button to Sign Up. Your response would look like:

```json
{
    "auth_token": "9cea876c07de13d8336c4a6d80fa9f64648506bc20974fd2",
    "username": "jacksniper",
    "hasura_id": 2,
    "hasura_roles": [
        "user"
    ]
}
```

- **auth_token** is the authorization token for this particular user, which we will use later to access authorized information. You should save this offline in your app to avoid making your user login each time.
- **hasura_id** is the id of the user that is automatically assigned by Hasura on signing up. You should save this offline as well.
- **hasura_roles** are the roles associated with this user. Keep in mind that the role associated with this user is `user`. This is default behaviour. We will get to where this comes into play in a bit.


## Login

Now that we have created a user using the signup endpoint, we can login with the same credentials. Click on `Login` under `Username/Password`. Enter in the same username and password that you used to sign up above and click on `Send`.

![Auth Login](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/auth-login.png)

In the response that you get, you will see that the `hasura_id` key has the same value as the one you got after you signed up. In this case, that value is 2.

## Authenticated user requests

To perform any authenticated request, you need the user's authentication token (auth_token from the login/signup endpoint) and pass that as a header.

You can find a list of these APIs under the `Logged in User Actions` title on the left panel.

Let's check out one such API. In the `API Explorer` of the `API Console`, click on `User Information` under `Logged in User Actions` and hit the `Send` button.

![Auth UserInfo Fail](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/auth-info-fail.png)

We get the following response:

```json
{
    "code": "unauthorized",
    "message": "you have to be a logged in user",
    "detail": null
}
```

This is because we have not passed the auth_token in the header. Add a new header to the request with key `Authorization` and value `Bearer <auth_token>` (replace `<auth_token>` with the auth_token that you received from your login/signup request. If you did not save it, perform a login request with the same username and password to get an auth_token again)

Hit the `Send` button after adding the `Authorization` header. You will receive a response similar to the one you received after login/signup.

![Auth UserInfo](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/auth-info.png)


## Authentication in Apollo client

To add request headers in ApolloCleint, you have to use a Middleware in [Apollo Link](https://www.apollographql.com/docs/link/).

> This has already been implemented in this project. See `react-native-app/src/AppScreen.js` for reference.

```javascript
const graphqlUrl = `https://data.${clusterName}.hasura-app.io/v1alpha1/graphql`
const httpLink = new HttpLink({ uri: graphqlUrl });

// adding auth headers
const authMiddleware = new ApolloLink((operation, forward) => {
  AsyncStorage.getItem('tokenKey').then((session) => {
    operation.setContext({
      headers: {
        authorization: session ? "Bearer " + session.token : null
      }
    });
  })
  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({
    addTypename: false
  })
});
```

## Code Generator

A nifty feature of the `API Console` is the `Code Generator`. For every request that you want to try out on the `API Console`, you can generate the client side code for it.As an example, let's generate the code to make a `login` request. Click on the login endpoint and then click on the `Generate API Code` button the top right corner.

![Auth CodeGen Button](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/auth-codegen-button.png)

Select your required language and library from the drop down on the left.
- For React Native select `Javascript React Native`

![Auth CodeGen](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/auth-codegen.png)

You can now copy and paste this into your client.

## React Native Auth Boilerplate

If you do not wish to write auth code, you can get a headstart by starting with the [React Native Auth Boilerplate](https://github.com/hasura/react-native-auth-boilerplate).

It has authentication using:
  - Username/Password
  - Mobile OTP
  - Email
  - Google
  - Facebook

## Mobile App Reference

  - Add your clusterName in the `Hasura.js` file in the `react-native-app` directory.
  - Authentication for React Native is implemented using the [React Native Auth Boilerplate](https://github.com/hasura/react-native-auth-boilerplate).
  - You can find the code in the `auth` directory of the `react-native-app`

>Advanced use cases:
- [Other authentication providers](https://docs.hasura.io/0.15/manual/auth/providers/index.html)
- [Understanding how the auth session works](https://docs.hasura.io/0.15/manual/auth/sessions.html)
- [Auth Configuration](https://docs.hasura.io/0.15/manual/auth/config.html)
- [Admin user actions](https://docs.hasura.io/0.15/manual/auth/admin-actions/index.html)
- [Authentication user actions](https://docs.hasura.io/0.15/manual/auth/user-actions/index.html)


## Table Permissions & User Roles

By default, every table created on Hasura can only be accessed by users with an `admin` role. Ergo, nobody will be able to access the `user_details` table without have an admin token. This is done to ensure security on all tables, so that nobody can randomly access data from your database unless you specifically allow that.

In our case, `user_details` table is used to store user specific data. We want to give every logged in user permission to insert and select their own data from the `user_details` table. Moreover, as an extra security measure, they should not be able to fetch another users data either.

Under the `Data` tab of the `API Console`, select `user_details` from the left panel and then click on the `Permissions` tab on the right to set permissions for the table. As you can see, an `admin` role has complete permission over the table. No other role has any permission.

![Data Permissions](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-permissions.png)

**First**, lets give the `user` role permission to insert data into the table. To do this, click on insert next to user row, check the `with custom check` option, choose `user_id` from the drop down and then select `$eq` and finally click on `X-Hasura-User-Id`. Click on `Save Permissions`.

![Data Permissions Insert](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-permissions-insert.png)

The permissions set above translates to: *Allow a user to insert into the `user_details` table only if the `user_id` being inserted is the same as the `hasura_id` associated with the user's `auth_token` which is passed as the Authorization token in the header*

**Second**, lets give the `user` role permission to get their data from the table. Click on select next to the user row, check the `with same checks as insert`, also click on the `Toggle All` button next to `With Access to columns`. Click on `Save Permissions`.

![Data Permissions Select](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-permissions-select.png)

The permissions set above translates to: *Let the user only read rows from the `user_details` table where the `user_id` is equal to the `hasura_id` of the user which is passed as the Authorization token in the header. Moreover, allow the user to only read the selected columns, in this case, user_id, name and gender*

**Third**, update permissions

![Data Permissions Update](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-permissions-update.png)

Translation: *Let the user only update rows from the `user_details` table where the `user_id` is equal to the `hasura_id` of the user which is passed as the Authorization token in the header. Moreover, allow the user to only update the selected columns, in this case, the user cannot modify the `user_id`*

Click on `Save Permissions`.

**Finally**, delete permissions

![Data Permissions Delete](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-permissions-delete.png)

Translation: *Let the user only delete rows from the `user_details` table where the `user_id` is equal to the `hasura_id` of the user which is passed as the Authorization token in the header.*

Click on `Save Permissions`.

## Inserting data into the table

Now that we have created `user permissions` for the `user_details` table, logged in users will be able to enter their information. Following is an example of a button that inserts user information to `user_details` table.

```javascript

const INSERT_USER_DETAILS = gql`
  mutation insert_user_details($objects: [user_details_input!]){
    insert_user_details(objects: $objects) {
      affected_rows
    }
  }
`;

export default graphql (INSERT_USER_DETAILS)(props => {
  return (
    <Button
      title="Update details"
      onPress = {() => {
        props.mutate({
          variables: {
            objects: [{
              name: props.name,
              gender: props.gender,
              user_id: props.userId
            }]
          }
        })
      }}
    />
  )
})
```

Check `react-native-app/src/InputComponent.js` for reference.

# More about data

## Selecting data from the table using Apollo client

Following is an example of fetching and rendering this user information

```javascript

const FETCH_USER_DETAILS = gql`
  query fetch_user_details{
    user_details {
      user_id
      name
      gender
    }
  }
`;

export default graphql(FETCH_USER_DETAILS)((props) => {
  if (props.data.error) {
    return (
      <View style={styles.container}>
        <Text>Unexpected.</Text>
      </View>
    );
  }
  if (props.data.loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator/>
      </View>
    )
  }
  if (props.data.user_details.length === 0) {
    return (
      <View>No data</View>
    )
  }
  return (
    <View style={styles.container}>
      <Text>
        Name: {props.data.user_details[0].name}
      </Text>
      <Text>
        Gender: {props.data.user_details[0].gender}
      </Text>
    </View>
  )
})
```

The app in this project implements this operation. Check ``react-native-app/src/components/DataComponent`` to see the implementation.

## Relationships and Foreign Keys

You can also create connections between various tables through foreign key constraints. These can be used to build more complex relationships, which can be used to fetch related data alongside the columns queried, as pseudo columns.

To explore this feature, let's create a new table called `user_education` to store information about each user's educational background like `institution_name` and `degree`. We will also have an additional column `id` of type `Integer (auto increment)` and a `user_id` column to store the `hasura_id` of the user. `id` will be the primary key for this table.

> It is not a good idea to set `user_id` as the primary key as a user can have multiple addresses and setting `user_id` as the primary key will not let us enter more than address for a particular user.

![Data CreateTable Edu](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-createtable-edu.png)

Click on the `Create` button.

Similar to `user_details` table, add `user` permissions on the `user_education` table.

![Data Permissions Edu Insert](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-permissions-edu-insert.png)

![Data Permissions Edu Select](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-permissions-edu-select.png)

![Data Permissions Edu Update](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-permissions-edu-update.png)

![Data Permissions Edu Delete](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-permissions-edu-delete.png)

What we want to achieve now is that when we fetch user details from the `user_details` table, we should also get the respective education data for the user.

For this, we are going to create an array relationship from the `user_details` table to the `user_education` table. To create a relationship:

**First**, add a foreign key constraint from the `user_id` column of the `user_education` table to the `user_id` column of the `user_details` table. To do this, under the `Modify` tab, click on `edit` next to `user_id`, choose `user_details` as the reference table and `user_id` as the reference column. Click on `Save` to add this foreign key constraint.

![Data Edu FK](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-edu-fk.png)

**Next**, open up the `user_details` table from the left panel and click on the `Relationships` tab. If you have followed the instructions above correctly, you will now have an entry under the `Suggested Array Relationship` column. Click on `Add` and name the relationship `education` and hit `Save`.

![Data UserDetails REL](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-userdetails-rel.png)

Click on `Browse Rows` and you will now see another column called `education` for the `user_details` table.

>`education` is not really a column, but a pseudo column. You can now use the Data APIs to fetch data from this table which includes education data as well.

![Data UserDetails BrowseRows](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/data-userdetails-browserows.png)

## Fetching relationship data

We can now fetch the education details for each user from the `user_details` table using the following query:

```
query fetch_user_details{
  user_details {
    user_id
    name
    gender
    education {
      id
      institution_name
      degree
    }
  }
}
```

Your response will look like the following:

```json
[
    {
        "user_id": 2,
        "name": "Jack Sniper",
        "gender": "Male",
        "education": [
            {
                "institution_name": "XYZ University",
                "degree": "BE",
                "id": 1,
                "user_id": 2
            },
            {
                "institution_name": "ABC University",
                "degree": "MS",
                "id": 2,
                "user_id": 2
            }
        ]
    }
]
```

## Mobile App Reference

  - Add your clusterName in the `Hasura.js` file in the `react-native-app` directory.
  - Run the app
  - Login or signup
  - Click on `Data` in the landing screen to see a working example of fetching user details.
  - The code for Data can be found in the `DataComponent.js`
>For advanced use cases, it is recommended to go through our [docs](https://docs.hasura.io/0.15/manual/data/index.html).


# Image Upload and Download

Some apps require the ability to upload and download files, for eg: storing user profile pictures or if you are building an app like google drive. Hasura provides easy to use APIs to upload and download files as well. Under the `API Explorer` tab, explore the APIs under `File`

You can test out the filestore APIs on the `API Explorer` and use the `Code Generator` to include it in your client side code.

![Filestore](https://raw.githubusercontent.com/hasura/mobile-backend-nodejs/master/readme-assets/filestore-explore.png)

## Mobile App Reference

- React Native:
  - Add your clusterName in the `Hasura.js` file in the `react-native-app` directory.
  - Run the app
  - Login or signup
  - Click on `Files` in the landing screen to see a working example of fetching user details.
  - The code for Data can be found in the `FileComponent.js`.

>Go though the [docs](https://docs.hasura.io/0.15/manual/filestore/index.html), to know more about the filestore and to understand how you can set permissions on it.


# Writing your own custom microservice

Although, Hasura provides backend components, there are times when you might want to write your own custom logic and for this write your own server. Common use cases of this include, sending push notifications to the users mobile device when a certain event happens, doing some sort of calculation or data manipulation for some event.

For this, you would want to create a custom microservice on Hasura. This project comes with one such microservice which runs on the `api` subdomain. This microservice is a simple Nodejs Express server which includes boilerplate code for the following:
- Writing custom endpoints
- Push notifications
- Websockets

You can open the url to this microservice on your web browser by running the following in your terminal

```bash
$ hasura microservice open api
```

>Every Hasura cluster comes with a few default microservices, all the backend feature we have used until now is a **Microservice**. Authentication is provided by the `auth` microservice, the data APIS by the `data` microservice, file upload and download by the `filestore` microservice. To take a look at the available microservices, run `$ hasura microservice list` on your terminal, inside the project directory. Hence, it is only natural that if you want additional features, you would simply create a new microservice. All custom microservices can be found inside the `microservices` directory. You can learn more about microservices on Hasura [here](https://docs.hasura.io/0.15/manual/custom-microservices/index.html).

The code for this microservice can be found inside the `microservices/api/src`

## Custom Endpoints

Navigate to `microservices/api/src/custom-logic/routes.js` to see how to define a custom route. There are two examples in it, one is a definition for a `GET` request at `"/"` and the other for a `POST` request at `"/echo"`. The `"/"` route just returns a "Hello World" and the `"/echo"` endpoint just returns whatever you send to it.

# Push Notifications

For React Native, you have to [eject the app](https://github.com/react-community/create-react-native-app/blob/master/EJECTING.md) and configure firebase as given [here](https://github.com/invertase/react-native-firebase).

Now, whenever you want to send a push notification to a user, you will fetch the associated fcm_token from the user's `user_id` and then hit the fcm api to send the push notification.

>There is an example of doing this in the `api` microservice, you can find the code for it at `microservices/api/src/push-notif/routes` defined as the `"/test_push"`.

**Note:** You need to set the Web API Key from your Firebase Project Settings on the Firebase Cloud Console and add it to the `fcmKey` variable at `microservices/api/src/push-notif/routes`.


## Storing the FCM key in the server the right way

Ideally, you should pass the FCM key as an environment variable to the server and not hard code it in the source code. To do this, you need to add the key as a secret into Hasura and then edit the `k8s.yaml` file inside `microservices/api/` to pass that as an environment variable.

**Step 1**: Add FCM key to Hasura secrets

```bash
$ # Replace <WEB API KEY> with the FCM Key
$ $ hasura secret update fcm.key "<WEB API KEY>"
```

**Step 2**: Edit `k8s.yaml` file

Run the following from the root directory of the project.

```bash
$ cp microservices/api/k8s.fcm.yaml microservices/api/k8s.yaml
```

# Websockets

WebSockets are a technology that makes it possible to open an interactive communication session between a client app and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply.

Chat apps are the most common use cases for Websockets. We are going to use [Socket.io](https://socket.io/), which is basically a Javascript framework implementing the Websockets protocol.

`microservices/api/src/server.js` has a simple setup done using `socket.io`.

The socket listens at `https:api.<cluster-name>.hasura-app.io` (replace `<cluster_name>` with the name of your cluster). It listens to the topic "message" and responds with an echo of whatever you send.

## Mobile App Reference

- Add your clusterName in the `Hasura.js` file in the `react-native-app` directory.
- Run the React Native app
- Login or signup
- Click on `Socket.IO`. Currently, the server will just respond with a "The message your sent is: <your-message>".
- You can find the code in the `SocketIO.js`.

>For more information on using socket.io, it is recommended to check their [docs](https://socket.io/docs/).
