import React from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import { getArticleList } from '../hasuraApi';
import Article from './Article';
import ArticleRow from './ArticleRow';
import AuthScreen from './AuthScreen';

export default class ArticleList extends React.Component {
  
  constructor(props){
    super(props);
    this.state={
      articleList: [],
      currentArticleId: null,
      logoutPressed: false
    }
    this.articleClicked = this.articleClicked.bind(this);
    this.backToList = this.backToList.bind(this);
  }

  async componentDidMount(){

    let articleList = await getArticleList();
    if(articleList.status === 200){
      articleListJson = await articleList.json();
      this.setState({
        articleList: await articleListJson
      });
    }
    else {
      Alert.alert('Something went wrong', 'Please check table permissions and your internet connection')
    }
  }

  articleClicked(id){
    this.setState ({
      currentArticleId: id
    })
  }

  backToList(){
    this.setState ({
      currentArticleId: null
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {
          (this.state.currentArticleId !== null)
          ?
          <Article articleId={this.state.currentArticleId} backToListCallback={this.backToList} />
          :
          <ArticleRow articleList={this.state.articleList} articleCallback={this.articleClicked} logoutCallback={this.props.logoutCallback}/>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 48,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});
