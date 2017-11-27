import React from 'react';
import { Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text  } from 'react-native';
import { trySignup, tryLogin } from '../hasuraApi';
import ArticleList from './ArticleList'

export default class AuthScreen extends React.Component {
  
  constructor(props){
    super(props);
    this.state = {
	  	isLoggedIn : false,
	  	usernameTextBox : '',
	  	passwordTextBox : '',
	  }
  }

  handleLoginPressed = async () => {
    let resp = await tryLogin(this.state.usernameTextBox, this.state.passwordTextBox);
    let respJson = await resp.json();
    if(resp.status !== 200){
      Alert.alert("Error", "Incorrect Credentials / No Internet Connection")
    } else {
      this.setState({isLoggedIn:true})  
    }
  }

  handleSignupPressed = async () => {
    let resp = await trySignup(this.state.usernameTextBox, this.state.passwordTextBox);
    let respJson = await resp.json();
    if(resp.status !== 200){
      Alert.alert("Error", "Password too short / User already exists / No Internet Connection")      
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
	  if(this.state.isLoggedIn === true){
	    return (
	      <View style={styles.container}>
	        <ArticleList logoutCallback={this.handleLogout}/> 
	      </View>
	    );
	  }

    return(
      <Container>
        <Header>
          <Body>
            <Title> Login </Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input value={this.state.usernameTextBox} onChangeText={this.handleUsernameChange}/>
            </Item>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input value={this.state.passwordTextbox} onChangeText={this.handlePasswordChange}/>
            </Item>
          </Form>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.buttonView}>
              <Button rounded onPress={this.handleSignupPressed}/>
                <Text> Sign up </Text>
              </Button>
            </View>
            <View style={styles.buttonView}>
              <Button title="Log in" onPress={this.handleLoginPressed}/>
                <Text> Log in </Text>
              </Button>
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}
