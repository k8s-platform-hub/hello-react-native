import React from 'react';
import { Alert} from 'react-native';
import { Container, Text, Button, Card, CardItem, Icon, Header, Left, Body, Title, Content, Right, Spinner} from 'native-base'
import { getArticle } from '../hasuraApi'

export default class Article extends React.Component {

  constructor(props){
    super(props);
    this.state={
      articleId: props.articleId,
      articleObj: null,
      fontsAreLoaded: false,
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

  render() {
    if(this.state.articleObj !== null && this.state.fontsAreLoaded){
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={this.props.backToListCallback}>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body>
              <Title>Article</Title>
            </Body>
            <Right />
          </Header>
          <Content>
            <Card>
              <CardItem header>
                <Text>{this.state.articleObj.title}</Text>
              </CardItem>
              <CardItem>
                <Text>{this.state.articleObj.content}</Text>
              </CardItem>
              <CardItem footer>
                <Text>By: {this.state.articleObj.author.name}</Text>
              </CardItem>
            </Card>
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
