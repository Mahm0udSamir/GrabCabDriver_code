import React from 'react';
import AppContainer from './src/navigation/AppNavigator';
import {Asset} from 'expo-asset';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import { Notifications } from 'expo';

import GetPushToken from './src/common/GetPushToken';
//Database import
import * as firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyCSglOmQPE5TbUz0Qvja4cp12hJ3PN4Wec",
  authDomain: "grabcab-7fec3.firebaseapp.com",
  databaseURL: "https://grabcab-7fec3.firebaseio.com",
  projectId: "grabcab-7fec3",
  storageBucket: "grabcab-7fec3.appspot.com",
  messagingSenderId: "184300046578",
  appId: "1:184300046578:web:766c15b0564250d7b0a86b",
  measurementId: "G-3KZNRGF7EH"
};


firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

  state = {
    assetsLoaded: false,
  };

  constructor(){
    super();
    console.disableYellowBox = true;
  }
  componentDidMount(){
    GetPushToken();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }
  _handleNotification = (notification) => {
   console.log(notification)
  };
//resource load at the time of app loading
  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/background.png'),
        require('./assets/images/logo.png'),
      ]),
      Font.loadAsync({
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto-Light.ttf'),
      }),
    ]);
  };

 

  
  render() {
    return (
        this.state.assetsLoaded ? 
          <AppContainer/>
          :         
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onFinish={() => this.setState({ assetsLoaded: true })}
            onError={console.warn}
            autoHideSplash={true}
          />
    );
  }
}