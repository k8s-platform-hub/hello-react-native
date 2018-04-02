import React from 'react';
import { StyleSheet, Text, View, Alert, Button, ActivityIndicator} from 'react-native';
import {fetchUserDetails} from '../actions'
import {graphql} from 'react-apollo';
import {FETCH_USER_DETAILS} from './graphqlQueries';
import InputComponent from './InputComponent';

export default graphql(FETCH_USER_DETAILS)((props) => {

  if (props.data.error) {
    return (
      <View style={styles.container}>
        <Text>No table found.</Text>
        <Button title="Back" onPress={props.goBack} />
      </View>
    );
  }

  if (props.data.loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator/>
        <Text style={{margin:20}}>Make sure you have created tables and added permissions</Text>
      </View>
    )
  }

  if (!props.data.user_details || (props.data.user_details && props.data.user_details.length === 0)) {
    return (
      <InputComponent id={props.session.id} goBack={props.goBack}/>
    );
  }

  const userEducation = () => {
    let educationString = '';
    for (let i = 0; i < props.data.user_details[0].education.length; i++){
      educationString += props.data.user_details[0].education[i].degree + ' from ' + props.data.user_details[0].education[i].institution_name + ', '
    }
    return educationString.length === 0 ? '' : educationString.slice(0, educationString.length -1);
  };

  return (
    <View style={styles.container}>
      <Text>
        Name: {props.data.user_details[0].name}
      </Text>
      <Text>
        Gender: {props.data.user_details[0].gender}
      </Text>
      <Text>
        Eduction: {userEducation()}
      </Text>
      <Button title="Back" onPress={props.goBack} />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textbox: {
    marginVertical: 40,
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
