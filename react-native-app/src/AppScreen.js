import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Index from './components/Index';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {clusterName} from '../Hasura';
import {fetchSession} from './actions';

const graphqlUrl = `https://data.${clusterName}.hasura-app.io/v1alpha1/graphql`
const httpLink = new HttpLink({ uri: graphqlUrl });

// adding auth headers
const authMiddleware = new ApolloLink((operation, forward) => {
  fetchSession().then((session) => {
    operation.setContext({
      headers: {
        authorization: session ? "Bearer " + session.token : null
      }
    });
  })
  return forward(operation);
});


// Creating a client instance
const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({
    addTypename: false
  })
});

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <Index logoutCallback={this.props.logoutCallback} sessionInfo={this.props.sessionInfo} client={client}/>
        </View>
      </ApolloProvider>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
