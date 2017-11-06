import React from 'react';
import { StyleSheet, Text, View, Alert, Button, ScrollView } from 'react-native';
import { getArticle } from '../hasuraApi'

export default class Article extends React.Component {

  constructor(props){
    super(props);
    this.state={
      articleId: props.articleId,
      articleObj: null
    }
  } 

  async componentDidMount(){
    let articleObj = await getArticle(this.state.articleId);
    if(articleObj.status === 200){
      articleObjJson = await articleObj.json();
      this.setState({
        articleObj: articleObjJson[0]
      });
    } else {
      Alert.alert("Unexpected", articleObj.json().error)
      this.props.backToListCallback();
    }
  }

  render() {
    if(this.state.articleObj !== null){
      return (
        <View style={styles.container} >
          <ScrollView>
            <Text style={styles.title}>Title: {this.state.articleObj.title}</Text>
            <Text style={styles.subHeading} >By: {this.state.articleObj.author.name}</Text>
            <View style={{height:10}}/>
            <Text>{this.state.articleObj.content}</Text>
          </ScrollView>
          <View style={{paddingTop:15}}>
            <Button title={"Back to list"} onPress={this.props.backToListCallback}/>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text> ... L.O.A.D.I.N.G </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    padding: 10
  },
  title: {
    margin: 24,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  subHeading: {
    margin: 24,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  }
});
