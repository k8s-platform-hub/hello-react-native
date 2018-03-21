import React from 'react';
import { Container, Text, Header, Left, Right, Body, Button, Icon, Tab, Tabs } from 'native-base';
import EmailLogin from './Login';
import EmailSignup from './Signup';
import {loadFonts} from '../../actions';

export default class IndexEmail extends React.Component {

  async componentWillMount() {
    await loadFonts();
  }

  goToLoginScreen = () => {
    this.tabView.goToPage(1);
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
            <Text>Email</Text>
          </Body>
          <Right />
        </Header>
        <Tabs initialPage={1} ref={(tabView) => {this.tabView=tabView}}>
          <Tab heading="Signup">
            <EmailSignup loginCallback={this.props.loginCallback} loginScreenCallback={this.goToLoginScreen}/>
          </Tab>
          <Tab heading="Login">
            <EmailLogin loginCallback={this.props.loginCallback}/>
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
