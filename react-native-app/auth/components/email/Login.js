import React from 'react';
import { Text, Button, Icon, Form, Item, Input } from 'native-base';
import {email} from '../../stylesheet';
import {tryEmailLogin, forgotPassword, resendVerification} from './actions';
import {storeSession, loadFonts} from '../../actions';

import {StyleSheet, View, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';

const styles = StyleSheet.create(email);
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default class EmailLogin extends React.Component {
  state = {
    fpLoading: false,
    rvLoading: false,
    loading: false,
    email: '',
    password: '',
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

  setLoading = () => {
    this.setState({...this.state, loading: true});
  }

  unsetLoading = () => {
    this.setState({...this.state, loading: false});
  }

  setFpLoading = () => {
    this.setState({...this.state, fpLoading: true});
  }

  unsetFpLoading = () => {
    this.setState({...this.state, fpLoading: false});
  }

  setRvLoading = () => {
    this.setState({...this.state, rvLoading: true});
  }

  unsetRvLoading = () => {
    this.setState({...this.state, rvLoading: false});
  }

  handleForgotPasswordPress = async () => {
    const { email } = this.state;
    if (email.length === 0) {
      Alert.alert('Invalid Request', 'Please enter your email');
      return;
    }
    if (!email.match(re)) {
      Alert.alert('Invalid Request', 'Please enter a valid email');
      return;
    }
    this.setFpLoading();
    const fpResponse= await forgotPassword(email);
    this.unsetFpLoading();
    if (fpResponse.success) {
      Alert.alert('Message', 'Please check your email for password reset instructions');
      return;
    } else {
      Alert.alert('request failed', fpResponse.message);
      return;
    }
  }

  handleResendVerificationPress = async () => {
    const { email } = this.state;
    if (email.length === 0) {
      Alert.alert('Invalid Request', 'Please enter your email');
      return;
    }
    if (!email.match(re)) {
      Alert.alert('Invalid Request', 'Please enter a valid email');
      return;
    }
    this.setRvLoading();
    const rvResponse = await forgotPassword(email);
    this.unsetRvLoading();
    if (rvResponse.success) {
      Alert.alert('Message', 'Please check your email for email verification');
      return;
    } else {
      Alert.alert('Request failed', rvResponse.message);
      return;
    }
  }

  handleLoginPress = async () => {
    const { email, password } = this.state;
    if (email.length === 0 || password.length === 0 ) {
      Alert.alert('Invalid Request', 'All fields are mandatory');
      return;
    }
    if (!email.match(re)) {
      Alert.alert('Invalid Request', 'Please enter a valid email');
      return;
    }
    this.setLoading();
    const loginResp = await tryEmailLogin(email, password);
    this.unsetLoading();
    if (loginResp.success) {
      await storeSession({id: loginResp.hasura_id, token: loginResp.auth_token, email});
      Alert.alert('Success', 'Authentication Successful');
      this.props.loginCallback({id: loginResp.hasura_id, token: loginResp.auth_token, email})
      return;
    } else {
      Alert.alert('Request failed', loginResp.message);
      return;
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
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
                onChangeText={this.handlePasswordChange}
              />
            </Item>
          </Form>
          <Button full dark onPress={this.handleLoginPress} style={styles.button} disabled={this.state.loading}>
            <Text> {this.state.loading ? "Please wait" : "Login"} </Text>
          </Button>
          <View style={styles.textContainer}>
            <Text style={styles.text} onPress={this.handleForgotPasswordPress} disabled={this.state.fpLoading}>{this.state.fpLoading ? "Please wait" : "Forgot Password"}</Text>
            <Text style={styles.text} onPress={this.handleResendVerificationPress} disabled={this.state.rvLoading}>{this.state.rvLoading ? "Please wait" : "Resend Verification"}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
