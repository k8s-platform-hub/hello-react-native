import React from 'react';
import {StyleSheet} from 'react-native';
import { Container, Text, Header, Left, Right, Body, Button, Icon, Tab, Tabs } from 'native-base';
import OTP from './OTP';
import {loadFonts} from '../../actions';
import {index} from '../../stylesheet';

const styles = StyleSheet.create(index);

export default class IndexOtp extends React.Component {

  async componentWillMount() {
    await loadFonts();
  }

  render() {
    const backButton = () => {
      if (this.props.shouldShowBackButton) {
        return (
          <Button transparent onPress={this.props.homeCallback}>
            <Icon name="arrow-back" />
          </Button>
        );
      }
      return null;
    }
    return (
      <Container>
        <Header>
          <Left>
            {backButton()}
          </Left>
          <Body>
            <Text style={styles.headerText}>OTP</Text>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={0} ref={(tabView) => {this.tabView=tabView}}>
          <Tab heading="Signup">
            <OTP loginCallback={this.props.loginCallback} task="signup"/>
          </Tab>
          <Tab heading="Login">
            <OTP loginCallback={this.props.loginCallback} task="login"/>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
