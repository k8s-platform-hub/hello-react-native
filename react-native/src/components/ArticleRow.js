import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Button } from 'react-native';

export default class ArticleRow extends React.Component {

  state = {
    loading: false
  }

  onArticlePressed(id){
    this.setState({
      loading: true
    })
    this.props.articleCallback(id);
  }
  
  handleLogoutPressed = () => {
    this.setState({
      loading:true
    })
    this.props.logoutCallback();
  }
  render() {
    const showList = () => {
      return this.props.articleList.map((article, i) => {
        return (
          <View key={i}>
            <TouchableOpacity style={styles.card} onPress={() => {
              this.onArticlePressed(article.id);
            }}>
              <Text> {article.title} </Text>
            </TouchableOpacity>
            <View style={{backgroundColor:"black", height:2}}/>
          </View>
        );
      });
    };
    return (
      <View>
        <ActivityIndicator
          animating={this.state.loading}
          size="large"/>
        <Text style={styles.title}> Article List </Text>
        <ScrollView >
          {showList()}
        </ScrollView>
        <Button title='Logout' onPress={this.handleLogoutPressed} style={{marginBottom: 25}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    margin: 24,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
  card: {
    height: 40,
    paddingTop: 5,
    paddingBottom: 5,
  }
});
