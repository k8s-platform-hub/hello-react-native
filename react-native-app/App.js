import React from 'react';
import { Root, Container } from 'native-base';
import { StackNavigator } from 'react-navigation';
import Index from './Index';

const AppNavigator = StackNavigator(
  {
    Index: {
      screen: Index,
    },
  },
);

export default class App extends React.Component {
  render () {
    return (
      <Root>
        <AppNavigator />
      </Root>
    )
  }
}
