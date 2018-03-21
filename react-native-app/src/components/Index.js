import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import {AppLoading} from 'expo';
import socketIOClient from 'socket.io-client';
import FileComponent from './FileComponent';
import DataComponent from './DataComponent';
import SocketIO from './SocketIO';
import {clusterName} from '../../Hasura';
import {fetchSession} from '../actions';

export default class Index extends React.Component {

  state = {
    loading: false,
    session: {
      isLoggedIn: false,
      token: null
    },
    openData: false,
    openFile: false,
    openSocket: false,
    socket: null,
    messageArray: []
  }

  async componentDidMount() {
    this.setState({
      ...this.state,
      session: {
        token: this.props.sessionInfo.token
      }
    })
  }

  openDataComponent = () => {
    this.setState({
      ...this.state,
      openData: true
    });
  }

  openFileComponent = () => {
    this.setState({
      ...this.state,
      openFile: true
    });
  }

  connectToSocket = () => {
    const socket = socketIOClient(`https://api.${clusterName}.hasura-app.io`);
    this.setState({...this.state, socket, openSocket: true});
    socket.on("message", msg => {
       this.receivedMessage(msg);
    });
    socket.on("connected", () => {
      this.setState({ ...this.state, openSocket: true});
    });
  }

  receivedMessage = (msg) => {
    const newMessageArray = this.state.messageArray;
    newMessageArray.push(msg);
    this.setState({...this.state, messageArray: newMessageArray})
  }

  sendMessage = (msg) => {
    console.log(msg);
    const {socket} = this.state;
    socket.emit('message', msg);
  }

  disconnectSocket = () => {
    const {socket} = this.state;
    socket.disconnect();
    this.setState({...this.state, messageArray: [], openSocket: false, socket:null})
  }

  backToHomeScreen = () => {
    this.setState({
      ...this.state,
      openData: null,
      openFile: null,
      openSocket: null
    })
  }

  render() {
    const {
      loading,
      session,
      openData,
      openFile,
      openSocket
    } = this.state;
    if (loading) {
      return <Expo.AppLoading />
    }

    if (openData) {
      return (
        <DataComponent goBack={this.backToHomeScreen} token={session.token} />
      )
    }

    if (openFile) {
      return (
        <FileComponent goBack={this.backToHomeScreen} token={session.token}/>
      )
    }

    if (openSocket) {
      return (
        <SocketIO messageArray={this.state.messageArray} sendMessageCallback={this.sendMessage} goBack={this.disconnectSocket}/>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.button}>
          <Button title="Data" onPress={this.openDataComponent} />
        </View>
        <View style={styles.button}>
          <Button title="Files" onPress={this.openFileComponent} />
        </View>
        <View style={styles.button}>
          <Button title="Socket.io" onPress={this.connectToSocket} />
        </View>
        <View style={styles.button}>
          <Button title="Logout" onPress={this.props.logoutCallback} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 20,
    marginHorizontal: 40,
  }
});
