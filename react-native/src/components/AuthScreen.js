import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
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
	  return (
	  	<View style={styles.container}>
        <Text style={{marginBottom:20, paddingLeft:20, fontSize: 20}}>
          Please signup or login.
        </Text>
				<TextInput value={this.state.usernameTextBox} onChangeText={this.handleUsernameChange} placeholder="Username" style={{paddingBottom: 10, paddingLeft: 10}}/>
				<TextInput value={this.state.passwordTextbox} onChangeText={this.handlePasswordChange} placeholder="Password" secureTextEntry={true} style={{paddingBottom: 10, paddingLeft: 10, marginBottom: 20}}/>
	  		<View style={{flexDirection: 'row'}}>
	  			<View style={styles.buttonView}>
	  				<Button title="Sign up" onPress={this.handleSignupPressed}/>
	  			</View>
	  			<View style={styles.buttonView}>
	  				<Button title="Log in" onPress={this.handleLoginPressed}/>
	  			</View>
	  		</View>
	  	</View>
	  )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 0.25,
    margin: 24,
  },
  buttonView:{
  	paddingLeft: 15,
  	paddingRight: 15,
  	flex: 1
  }
});
