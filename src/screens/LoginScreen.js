import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    AsyncStorage,                   
    Image,
    Alert
  } from 'react-native';
import { LoginComponent, Background, ForgotPassModal, Button } from '../components';
import * as firebase from 'firebase'

export default class LoginScreen extends Component {
    constructor(props){
      super(props);
      this.state = {
        email:'',
        password:'',
        emailValid:true,
        passwordValid:true,
        driver: '',
        showForgotModal:false,
        emailerror:null,
        loading: false
      }
      
    }

    closeModal(){ 
      this.setState({ showForgotModal: false })
    }

    //go to register page
    onPressRegister() {
      this.props.navigation.navigate('DriverReg');
    }

    //forgot password press
    forgotPassPress() {
        this.setState({showForgotModal:true})
    }
    
    onPressForgotPass(email) {
      var auth = firebase.auth();
      return auth.sendPasswordResetEmail(email)
        .then((res) =>{
        //console.log("A Password Reset Link sent to your email please check and reset your New Password")
        this.setState({showForgotModal:false},()=>{
          setTimeout(() => {
            alert('A Password Reset Link sent to your email please check and reset your New Password')        
          }, 600);
        });
      })
      .catch((error) =>{
        //console.log("email not sent"+error)
        alert(error)  
      })
    }

    //on press login after all validation
    async onPressLogin(email, password){
      this.setState({loading: true},()=>{

        firebase.auth().signInWithEmailAndPassword(email,password)
        .then( res => {
          console.log(res);
          this.setState({loading: false}); 
        }).catch(res=>{
          alert(res.message);
          this.setState({loading: false}); 
        })

      })
    }

    //facebook login if required
    async fbLogIn() {
        try {
          const {
            type,
            token,
            expires,
            permissions,
            declinedPermissions,
          } = await Expo.Facebook.logInWithReadPermissionsAsync('2165245093566399', {
            permissions: ['public_profile'],
          });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
      }

  render() {
    return (
        <Background>
            <View style={styles.logo}>
                <Image source={require('../../assets/images/logo.png')} />
            </View>
            <View style={styles.logInCompStyl}/>
            {
              this.state.showForgotModal? 
                  <ForgotPassModal
                    modalvisable={this.state.showForgotModal}
                    requestmodalclose={()=>{this.closeModal()}}

                    inputEmail={this.state.email}
                    emailerrorMsg={this.state.emailerror}
                    onChangeTextInput={(value)=>{this.setState({emailerror:null,email:value})}}
                    
                    onPressForgotPass={(email)=>this.onPressForgotPass(email)} 
                /> :
                <View style={styles.containerView}>
                  <LoginComponent
                    complexity={'complex'}
                    loading={this.state.loading}
                    onPressRegister={()=>{this.onPressRegister()}} 
                    onPressLogin={(email, password)=>this.onPressLogin(email, password)} 
                    onPressForgotPassword={()=>{this.forgotPassPress()}}
                  />
                  {/* uncomment this if facebook login required */}
                  {/* <Button
                    btnClick={()=>{this.fbLogIn()}} 
                  >
                    Facebook Login
                  </Button> */}
              </View>
            }
           

            

        </Background>
    );
  }
}

//Screen Styling
const styles = StyleSheet.create({
    containerView: {flex: 1, justifyContent:'center', alignItems:'center'},
    logo:{
        flex:1,
        position:'absolute',
        top:80,
        width:'100%',
        justifyContent:"flex-end",
        alignItems:'center'      
    },
    logInCompStyl:{
        height: 100
    }
});