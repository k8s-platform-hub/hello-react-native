import React from 'react';
import {StyleSheet, View, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import { Text, Button, Form, Item, Input } from 'native-base';
import {username} from '../../stylesheet';
import {tryLogin} from './actions';
import {storeSession, loadFonts} from '../../actions';

const styles = StyleSheet.create(username);

export default class UsernameLogin extends React.Component {
  state = {
    loading: false,
    username: '',
    password: '',
  }

  async componentWillMount() {
    await loadFonts();
  }

  handleUsernameChange = (text) => {
    this.setState({
      ...this.state,
      username: text
    });
  }
  handlePasswordChange = (text) => {
    this.setState({
      ...this.state,
      password: text
    });
  }

  setLoading = () => {
    this.setState({...this.state, loading: true});
  }

  unsetLoading = () => {
    this.setState({...this.state, loading: false});
  }

  handleLoginPress = async () => {
    const { username, password} = this.state;
    if (this.state.username.length === 0 || this.state.password.length === 0) {
      Alert.alert('Invalid Request', 'All fields are mandatory');
      return;
    }
    this.setLoading();
    const loginResp = await tryLogin(username, password);
    if (loginResp.success) {
      await storeSession({id: loginResp.hasura_id, token: loginResp.auth_token});
      this.unsetLoading();
      this.props.loginCallback({id: loginResp.hasura_id, token: loginResp.auth_token});
    } else {
      Alert.alert('Request failed', loginResp.message);
      this.unsetLoading();
    }
  }

  render() {

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Form>
            <Item style={styles.textbox}>
              <Input  placeholder="Username" value={this.state.username} onChangeText={this.handleUsernameChange}
              autoCorrect={false} />
            </Item>
            <Item style={styles.textbox}>
              <Input  placeholder="Password" secureTextEntry value={this.state.password} onChangeText={this.handlePasswordChange} />
            </Item>
          </Form>
          <Button full dark onPress={this.handleLoginPress} style={styles.button} disabled={this.state.loading}>
            <Text> {this.state.loading ? "Please Wait" : "Login"} </Text>
          </Button>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
