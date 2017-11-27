import React from 'react';
import { Container } from 'native-base';
import AuthScreen from './src/components/AuthScreen';
import ArticleList from './src/components/ArticleList';

export default class App extends React.Component {
  
  render() {
    console.log("App started")
    return (
      <Container>
        <AuthScreen logoutCallback = {this.backToLoginScreen}/>
      </Container>
    );
  }
}

