import React from 'react';
import {  Alert, Text} from 'react-native';
import { Container, Header, Content, Spinner } from 'native-base';
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
      logoutPressed: false,
      fontsAreLoaded: false,
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
      if (articleList.status === 504) {
        Alert.alert('Network error', 'Check your internet connection');
      } else {
        Alert.alert('Something went wrong', 'Please check table permissions and your internet connection')
      }
    }

    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({...this.state, fontsAreLoaded: true});

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
    if(this.state.fontsAreLoaded == true){
      return (
        <Container style={{alignItems: 'center', justifyContent: 'center'}}>
          {
            (this.state.currentArticleId !== null)
            ?
            <Article articleId={this.state.currentArticleId} backToListCallback={this.backToList} />
            :
            <ArticleRow articleList={this.state.articleList} articleCallback={this.articleClicked} logoutCallback={this.props.logoutCallback}/>
          }
        </Container>
      );
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
