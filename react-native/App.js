import React from 'react';
import { StyleSheet, View } from 'react-native';
import AuthScreen from './src/components/AuthScreen';
import ArticleList from './src/components/ArticleList';

export default class App extends React.Component {
  
  render() {
    console.log("App started")
    return (
      <View style={styles.container}>
        <AuthScreen logoutCallback = {this.backToLoginScreen}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 24,
  },
});
