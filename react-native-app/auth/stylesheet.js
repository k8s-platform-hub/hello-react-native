const home = {
  homeContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginVertical: 20
  },
  header: {
  },
  headerText: {
  },
  button: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'flex-start',
    paddingLeft: 40 
  },
  homeButtonContainer: {
    flexDirection: 'column',
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10
  },
  buttonText : {
    fontSize: 15,
    color: 'white'
  }
};

const username = {
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
  },
  headerText: {
  },
  itemContainer: {
    marginVertical: 20,
    marginHorizontal: 40,
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
  textbox: {
    height: 40,
    marginVertical: 20,
    marginHorizontal: 20,
    padding: 10
  }
}

const otp = {
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
  },
  headerText: {
  },
  numberContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
    justifyContent: 'space-around'
  },
  countryCode: {
    height: 40,
    flex: 0.2,
    padding: 10
  },
  number: {
    height: 40,
    flex: 0.8,
    padding: 10
  },
  otp: {
    flex:1,
    height: 80,
    padding: 10,
    width: 100,
  },
  otpTextBox: {
    textAlign: 'center',
    fontSize: 50
  },
  resendText: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    flex: 1,
  }
}

const email = {
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
  },
  headerText: {
  },
  itemContainer: {
    marginVertical: 20,
    marginHorizontal: 40,
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  textbox: {
    height: 40,
    marginVertical: 20,
    marginHorizontal: 20,
    padding: 10
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  text: {
    color: 'dimgrey'
  }
}

export {
  home,
  username,
  otp,
  email
}
