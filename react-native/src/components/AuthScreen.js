import React from 'react';
import { Container, Header, Title, Content, Button, Left, Body, Text, Form, Item, Label, Input, Right, Spinner} from 'native-base';
import { View, Alert } from 'react-native';
import { trySignup, tryLogin } from '../hasuraApi';
import ArticleList from './ArticleList'

export default class AuthScreen extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
	  	isLoggedIn : false,
	  	usernameTextBox : '',
	  	passwordTextBox : '',
      	fontsAreLoaded: false,
	  }
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({...this.state, fontsAreLoaded: true});
  }

  handleLoginPressed = async () => {
    let resp = await tryLogin(this.state.usernameTextBox, this.state.passwordTextBox);
    if(resp.status !== 200){
      if (resp.status === 504) {
        Alert.alert("Network Error", "Check your internet connection" )
      } else {
        Alert.alert("Error", "Unauthorized, Invalid username or password")      
      }
    } else {
      this.setState({isLoggedIn:true})  
    }
  }

  handleSignupPressed = async () => {
    let resp = await trySignup(this.state.usernameTextBox, this.state.passwordTextBox);
    if(resp.status !== 200){
      if (resp.status === 504) {
        Alert.alert("Network Error", "Check your internet connection" )
      } else {
        Alert.alert("Error", "Password too short / User already exists")      
      }
    } else {
      this.setState({isLoggedIn:true})  
    }
  }

  handleUsernameChange = usernameTextBox => {
  	this.setState({
  		...this.state,
  		usernameTextBox: usernameTextBox
  	})
  }

  handlePasswordChange = passwordTextBox => {
  	this.setState({
  		...this.state,
  		passwordTextBox: passwordTextBox
  	})
  }

  handleLogout = () => {
    this.setState({
      ...this.state,
      isLoggedIn: false
    })
  }

  render() {
	  if (this.state.fontsAreLoaded == true) {
      if(this.state.isLoggedIn === true){
        return (
            <ArticleList logoutCallback={this.handleLogout}/> 
        );
      }
    
      return(
        <Container>
          <Header>
            <Left />
            <Body>
              <Title> Login </Title>
            </Body>
            <Right />
          </Header>
          <Content contentContainerStyle={{justifyContent:'center', margin: 20}}>
            <Form>
              <Item floatingLabel>
                <Label>Username</Label>
                <Input value={this.state.usernameTextBox} onChangeText={this.handleUsernameChange}/>
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input value={this.state.passwordTextbox} onChangeText={this.handlePasswordChange} secureTextEntry/>
              </Item>
            </Form>
            <View style = {{height:10}} />
            <Button block onPress={this.handleSignupPressed} >
              <Text> Sign up </Text>
            </Button>
            <View style = {{height:10}} />
            <Button block title="Log in" onPress={this.handleLoginPressed} >
              <Text> Log in </Text>
            </Button>
          </Content>
        </Container>
      )
    }
    return (
      <Container>
        <Header />
        <Content>
          <Spinner color='black' />
        </Content>
      </Container>
    );
  }
}
