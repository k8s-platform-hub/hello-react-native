import React from 'react';
import { Text, Button, Icon, Form, Input, Item } from 'native-base';
import {email} from '../../stylesheet';
import {tryEmailSignup} from './actions';
import {storeSession, loadFonts} from '../../actions';

import {StyleSheet, View, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';

const styles = StyleSheet.create(email);

export default class EmailSignup extends React.Component {
  state = {
    loading: false,
    email: '',
    password: '',
    cPassword: ''
  }

  async componentWillMount() {
    await loadFonts();
  }

  handleEmailChange = (text) => {
    this.setState({
      ...this.state,
      email: text
    });
  }
  handlePasswordChange = (text) => {
    this.setState({
      ...this.state,
      password: text
    });
  }
  handleCPasswordChange = (text) => {
    this.setState({
      ...this.state,
      cPassword: text
    });
  }

  setLoading = () => {
    this.setState({...this.state, loading: true});
  }

  unsetLoading = () => {
    this.setState({...this.state, loading: false});
  }

  handleSignupPress = async () => {
    const { email, password, cPassword} = this.state;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length === 0 || password.length === 0 || cPassword.length === 0) {
      Alert.alert('Invalid Request', 'All fields are mandatory');
      return;
    }
    if (!email.match(re)) {
      Alert.alert('Invalid Request', 'Please enter a valid email');
      return;
    }
    if (password !== cPassword) {
      Alert.alert('Invalid Request', 'Inputs of "password" and "confirm password" do not match');
      return;
    }
    this.setLoading();
    const signupResp = await tryEmailSignup(email, password);
    this.unsetLoading();
    if (signupResp.success) {
      await storeSession({id: signupResp.hasura_id, token: signupResp.auth_token, email});
      Alert.alert('Success', 'Please check your email for a verification email');
      this.props.loginScreenCallback();
      return;
    } else {
      Alert.alert('Request failed', signupResp.message);
      return;
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Form>
            <Item style={styles.textbox}>
              <Input
                placeholder="Email"
                value={this.state.email}
                onChangeText={this.handleEmailChange}
                keyboardType="email-address"
                autoCorrect={false}
              />
            </Item>
            <Item style={styles.textbox}>
              <Input
                placeholder="Password"
                secureTextEntry
                value={this.state.password}
                onChangeText={this.handlePasswordChange}/>
            </Item>
            <Item style={styles.textbox}>
              <Input
                secureTextEntry
                placeholder="Confirm Password"
                value= {this.state.cPassword}
                onChangeText={this.handleCPasswordChange}/>
            </Item>
          </Form>
          <Button full dark onPress={this.handleSignupPress} style={styles.button} disabled={this.state.loading}>
            <Text>{this.state.loading ? "Please wait" : "Sign up"}</Text>
          </Button>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
