import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Index from './components/Index';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Index logoutCallback={this.props.logoutCallback} sessionInfo={this.props.sessionInfo}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
