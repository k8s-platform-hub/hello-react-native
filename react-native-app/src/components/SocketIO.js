import React from 'react';
import {
  ActivityIndicator,
  Button,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

export default class SocketIO extends React.Component {
  state = {
    message: '',
    messageArray: this.props.messageArray
  }

  async componentWillReceiveProps (nextProps) {
    this.setState({messageArray: nextProps.messageArray, message: ''});
  }

  handleTextChange = (text) => {
    this.setState({
      ...this.state,
      message: text
    })
  }

  renderMessages = () => {
    return this.state.messageArray.map((item, index) => {
      return (
        <Text key={index}>{item}</Text>
      );
    })
  }

  render() {
    console.log(this.state);
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
        <View style={styles.container}>
          <View style={styles.messageInput}>
            <TextInput style={styles.textbox} value={this.state.message} onChangeText={this.handleTextChange} placeholder="type a message"/>
            <Button style={styles.button} color='grey' title="Send" onPress={() => this.props.sendMessageCallback(this.state.message)} />
            <Button style={styles.button} color='grey' title="Cancel" onPress={this.props.goBack} />
          </View>
          {this.renderMessages()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingTop: 40
  },
  messageInput: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'flex-start'
  },
  button: {
    flex: 1
  },
  textbox: {

    flex: 8,
    height: 40,
    fontSize: 15,
    borderWidth: 0.5,
    marginHorizontal: 20,
    borderRadius: 20,
    borderColor: 'black',
    padding: 10
  }

});
