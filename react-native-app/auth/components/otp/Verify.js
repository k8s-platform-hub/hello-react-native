import React from 'react';
import { Text, Button, Form, Item, Input } from 'native-base';
import {otp} from '../../stylesheet';
import {verifyOtp, sendOtp} from './actions';
import {storeSession, loadFonts} from '../../actions';

import {StyleSheet, View, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';

const styles = StyleSheet.create(otp);

export default class SendOtp extends React.Component {
  state = {
    countryCode: '',
    number: '',
    otp: '',
    loading: false,
    rsoLoading: false
  }

  async componentWillMount() {
    await loadFonts();
  }

  handleOtpChange = (text) => {
    if (text.length <= 6){
      this.setState({
        ...this.state,
        otp: text
      })
    }
  }

  setLoading = () => {
    this.setState({...this.state, loading: true});
  }

  unsetLoading = () => {
    this.setState({...this.state, loading: false});
  }

  setRsoLoading = () => {
    this.setState({...this.state, rsoLoading: true});
  }

  unsetRsoLoading = () => {
    this.setState({...this.state, rsoLoading: false});
  }

  verifyOtp = async () => {
    if (this.state.otp.length === 0) {
      Alert.alert('Invalid Request', 'OTP is mandatory');
      return;
    }
    this.setLoading();
    const authResp= await verifyOtp(this.props.countryCode, this.props.number, this.state.otp, this.props.task);
    this.unsetLoading();
    if (authResp.success) {
      Alert.alert('Success', 'Authentication successful');
      await storeSession({id: authResp.hasura_id, token: authResp.auth_token});
      this.props.loginCallback({id: authResp.hasura_id, token: authResp.auth_token, mobile: this.props.number});
      return;
    } else {
      Alert.alert('Request failed', authResp.message);
    }
  }

  resendOtp = async () => {
    this.setRsoLoading();
    const sendOtpResp = await sendOtp(this.state.countryCode, this.state.number);
    this.unsetRsoLoading();
    if (sendOtpResp.success) {
      Alert.alert(`OTP sent to ${this.state.countryCode}-${this.state.number}`);
    } else {
      Alert.alert('Sending OTP Failed', sendOtpResp.message);
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container} >
          <View style={styles.numberContainer}>
            <Text style={{textAlign:'center', fontStyle: 'italic'}}> Please enter the OTP sent to {this.state.countryCode}-{this.state.number}</Text>
          </View>
          <Form>
            <View style={styles.numberContainer}>
              <Item style={styles.otp}>
                <Input style={styles.otpTextBox} value={this.state.otp} onChangeText={this.handleOtpChange} placeholder="000000" keyboardType="numeric" autoFocus={true} maxLength={6}/>
              </Item>
            </View>
          </Form>
          <View style={styles.numberContainer}>
            <Button full dark style={styles.button} onPress={this.verifyOtp} disabled={this.state.loading}>
              <Text>{this.state.loading ? "Please wait" : "Verify"}</Text>
            </Button>
          </View>
          <View style={styles.resendText}>
            <Text style={{textAlign:'center', color: 'darkgrey'}} onPress={this.resendOtp} disabled={this.state.rsoLoading}>
              {this.state.rsoLoading ? "Please wait" : "Resend OTP"}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
