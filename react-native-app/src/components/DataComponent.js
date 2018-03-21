import React from 'react';
import { StyleSheet, Text, View, Alert, Button, ActivityIndicator} from 'react-native';
import {fetchUserDetails} from '../actions'

export default class DataComponent extends React.Component {

  state = {
    userDetails: null,
    loading: true,
    isError: false
  }

  async componentDidMount() {
    const dataResponse = await fetchUserDetails(this.props.token);
    console.log(dataResponse);
    if (dataResponse.success && dataResponse.data.length > 0) {
      this.setState({
        userDetails: dataResponse.data,
        loading: false,
        isError: false
      });
    } else {
      this.setState({
        ...this.state,
        loading: false,
        isError: true
      })
    }
  }

  render() {
    if (this.state.isError) {
      return (
        <View style={styles.container}>
          <Text>No data and/or table found.</Text>
        </View>
      );
    }

    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      )
    }

    const userEducation = () => {
      let educationString = '';
      for (let i = 0; i < this.state.userDetails[0].education.length; i++){
        educationString += this.state.userDetails[0].education[i].degree + ' from ' + this.state.userDetails[0].education[i].institution_name + ', '
      }
      return educationString.length === 0 ? '' : educationString.slice(0, educationString.length -1);
    };

    return (
      <View style={styles.container}>
        <Text>
          Name: {this.state.userDetails[0].name}
        </Text>
        <Text>
          Gender: {this.state.userDetails[0].gender}
        </Text>
        <Text>
          Eduction: {userEducation()}
        </Text>
        <Button title="Back" onPress={this.props.goBack} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
