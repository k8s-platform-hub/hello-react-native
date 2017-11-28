import React from 'react';
import {Container, Card, CardItem, Header, Title, Content, Button, Left, Text, Icon, Body, Right, Spinner} from 'native-base';
import { View, ActivityIndicator} from 'react-native';

export default class ArticleRow extends React.Component {

  state = {
    fontsAreLoaded: false,
  }

  onArticlePressed(id){
    this.props.articleCallback(id);
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({...this.state, fontsAreLoaded: true});
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
          <Card key={i}>
            <CardItem button onPress={() => {
              this.onArticlePressed(article.id);
            }}>
              <Text> {article.title} </Text>
            </CardItem>
          </Card>
        );
      });
    };

    if(this.state.fontsAreLoaded == true){
      return (
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={this.handleLogoutPressed}>
                  <Icon name='arrow-back'/>
                </Button>
              </Left>
              <Body>
                <Title>Article List</Title>
              </Body>
              <Right />
            </Header>
            <Content>
              {showList()}
            </Content>
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