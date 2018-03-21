import React from 'react';
import { Text, Button, Form, Input, Item } from 'native-base';
import {otp} from '../../stylesheet';
import {sendOtp} from './actions';
import {storeSession, loadFonts} from '../../actions';

import {StyleSheet, View, TextInput, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';

const styles = StyleSheet.create(otp);

export default class SendOtp extends React.Component {
  state = {
    countryCode: '',
    number: '',
    loading: false
  }

  async componentWillMount() {
    await loadFonts();
  }

  handleCountryCodeChange = (text) => {
    this.setState({
      ...this.state,
      countryCode: text
    })
  }

  handleNumberChange = (text) => {
    this.setState({
      ...this.state,
      number: text
    })
  }

  setLoading = () => {
    this.setState({...this.state, loading: true});
  }

  unsetLoading = () => {
    this.setState({...this.state, loading: false});
  }

  sendOtp = async () => {
    if (this.state.countryCode.length === 0 || this.state.number.length === 0) {
      Alert.alert('Invalid Request', 'All fields are mandatory');
      return;
    }
    this.setLoading();
    const sendOtpResp = await sendOtp(this.state.countryCode, this.state.number);
    this.unsetLoading();
    if (sendOtpResp.success) {
      this.props.otpSentCallback(this.state.countryCode, this.state.number);
    } else {
      Alert.alert('Sending OTP Failed', sendOtpResp.message);
      this.unsetLoading();
    }
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container} >
          <View style={styles.numberContainer}>
            <Text style={{textAlign:'center', fontStyle: 'italic'}}> Please enter your mobile number with country code</Text>
          </View>
          <Form>
            <View style={styles.numberContainer}>
              <Item style={styles.countryCode}>
                <Input value={this.state.countryCode} onChangeText={this.handleCountryCodeChange} />
              </Item>
              <Item style={styles.number}>
                <Input value={this.state.number} onChangeText={this.handleNumberChange} keyboardType="phone-pad" />
              </Item>
            </View>
          </Form>
          <View style={styles.numberContainer}>
            <Button full dark style={styles.button} onPress={this.sendOtp} disabled={this.state.loading} >
              <Text>{this.state.loading ? "Please wait" : `Send OTP to ${this.props.task}`}</Text>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
