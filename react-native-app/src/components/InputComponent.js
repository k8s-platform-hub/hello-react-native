import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import {fetchUserDetails} from '../actions'
import {graphql, compose} from 'react-apollo';
import {FETCH_USER_DETAILS, INSERT_USER_DETAILS, INSERT_USER_EDUCATION} from './graphqlQueries';

export default class InputComponent extends React.Component {
  state = {
    name: '',
    gender: '',
    institutionName: '',
    degree: ''
  }

  handleNameChange = (name) => {
    this.setState({
      ...this.state,
      name
    })
  }

  handleGenderChange = (gender) => {
    this.setState({
      ...this.state,
      gender
    })
  }

  handleInstitutionChange = (institutionName) => {
    this.setState({
      ...this.state,
      institutionName
    })
  }

  handleDegreeChange = (degree) => {
    this.setState({
      ...this.state,
      degree
    })
  }

  isButtonDisabled = () => {
    const {
      name,
      gender,
      institutionName,
      degree
    } = this.state;
    return (name.length === 0 || gender.length === 0 || institutionName.length === 0 || degree.length === 0);
  }

  render () {
    const {
      name,
      gender,
      institutionName,
      degree
    } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <TextInput style={styles.textbox}
          value={name}
          placeholder="Name"
          onChangeText={this.handleNameChange}
        />
        <TextInput style={styles.textbox}
          value={gender}
          placeholder="Gender"
          onChangeText={this.handleGenderChange}
        />
        <TextInput style={styles.textbox}
          value={institutionName}
          placeholder="University"
          onChangeText={this.handleInstitutionChange}
        />
        <TextInput style={styles.textbox}
          value={degree}
          placeholder="Degree"
          onChangeText={this.handleDegreeChange}
        />
        <View style={styles.buttonContainer}>
          <AddButton
            userDetails={{
              name,
              gender,
              user_id: this.props.id
            }}
            userEducation={{
              institution_name: institutionName,
              degree,
              user_id: this.props.id
            }}
            isButtonDisabled={this.isButtonDisabled}
          />
          <Button
            title="Back"
            onPress={this.props.goBack}
          />
        </View>
      </KeyboardAvoidingView>
    );

  }

}

const AddButton = compose (
  graphql (INSERT_USER_DETAILS, {
    name: 'insertUserDetails'
  }),
  graphql (INSERT_USER_EDUCATION, {
    name: 'insertUserEducation'
  })
) (props => {

  handleButtonPress = async () => {
    await props.insertUserDetails({
      variables: {
        objects: [props.userDetails]
      },
      update: (proxy, {data: {insert_user_details}}) => {
        const data = proxy.readQuery({ query: FETCH_USER_DETAILS});
        const userDetails= props.userDetails;
        userDetails.education = [];
        data.user_details.push(userDetails);
        proxy.writeQuery({query: FETCH_USER_DETAILS, data})
      }
    });
    await props.insertUserEducation({
      variables: {
        objects: [props.userEducation]
      },
      update: (proxy, {data: {insert_user_education}}) => {
        const data = proxy.readQuery({ query: FETCH_USER_DETAILS});
        const userEducation = props.userEducation;
        userEducation.id = insert_user_education.returning[0].id;
        data.user_details[0].education.push(userEducation);
        proxy.writeQuery({query: FETCH_USER_DETAILS, data})
      }
    });
  }
  return (
    <Button
      title="Update details"
      disabled={props.isButtonDisabled()}
      onPress = {handleButtonPress}
    />
  )
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  textbox: {
    marginVertical: 20,
    marginHorizontal: 40,
    height: 50,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'grey',
    padding:10,
    fontSize: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 40,
    marginHorizontal: 40,
    justifyContent: 'space-around',
  }
});
