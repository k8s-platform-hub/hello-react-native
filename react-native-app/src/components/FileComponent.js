import React from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Exponent, { Constants, ImagePicker, registerRootComponent } from 'expo';
import {clusterName} from '../../Hasura';

export default class FileComponent extends React.Component {
  state = {
    image: null,
    uploading: false,
  };

  render() {
    let { image } = this.state;
    if (this.state.uploading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            onPress={this._pickImage}
            title="Upload"
          />
          <Button
            style={styles.buttonContainer}
            onPress={this._takePhoto} title="Click" />
          <Button
            style={styles.buttonContainer}
            onPress={this.props.goBack} title="Cancel" />
        </View>
        {this._maybeRenderImage()}
      </View>
    );
  }

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }
    return (
      <View style={styles.imageContainer}>
        <Image source={{uri: image}} />
        <Text
          onPress={this._copyToClipboard}
          onLongPress={this._share}
          style={{ alignSelf: 'center'}}>
          {image}
        </Text>
      </View>
    );
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image,
    });
  };

  _copyToClipboard = () => {
    Clipboard.setString(this.state.image);
    alert('Copied image URL to clipboard');
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;

    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri, this.props.token);
        uploadResult = await uploadResponse.json();
        console.log(uploadResult);
        this.setState({ image: `https://filestore.${clusterName}.hasura-app.io/v1/file/${uploadResult.file_id}`});
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
      this.setState({ ...this.state, uploading: false });
    } finally {
      this.setState({ ...this.state, uploading: false });
    }
  };
}

uploadImageAsync = async (uri, token) => {
  let apiUrl = `https://filestore.${clusterName}.hasura-app.io/v1/file`;
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('photo', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': 'Bearer ' + token
    },
  };

  return fetch(apiUrl, options);
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
  },
  imageContainer: {
    marginHorizontal: 10,
    marginVertical: 40,
    justifyContent: 'center',
  },
});
