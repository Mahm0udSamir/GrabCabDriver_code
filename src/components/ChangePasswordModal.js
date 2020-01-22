import React, { Component } from 'react';
import { Modal,View,StatusBar,StyleSheet,Text,Dimensions,LayoutAnimation} from 'react-native';
import { Button, Input } from 'react-native-elements';

import { Icon } from 'react-native-elements'
import { colors } from '../common/theme';

var { width } = Dimensions.get('window');

export default class ChangePasswordModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            barStyle: 'dark-content',
            oldpassword:'',
            newPassword:'',
            oldpasswordValid: true,
            newpasswordValid:true,
        }
    }

    validateEmail(password) {
        const { oldpassword, newPassword } = this.state
        if(password=='newpassword') {
            const regx2 = /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
            const newpasswordValid = regx2.test(newPassword)
            LayoutAnimation.easeInEaseOut()
            this.setState({ newpasswordValid })
            newpasswordValid || this.newpassword.shake()
            return newpasswordValid
        }
        else {
            var oldpasswordValid = oldpassword.length >=1;
            oldpasswordValid || this.oldpassword.shake()
            this.setState({ oldpasswordValid })
            return oldpasswordValid
        }
    }
  
    //forgot password button press for validation
    onPressForgot(){
        const { onPressChangePassword } = this.props;
        LayoutAnimation.easeInEaseOut();
        const newpasswordValid = this.validateEmail('newpassword');
        const oldpasswordValid = this.validateEmail('old');

        if(newpasswordValid && oldpasswordValid) {
            //forgot password function of smart component
            onPressChangePassword(this.state.oldpassword,this.state.newPassword);
            this.setState({oldpassword: '',newPassword:''})
          }
      
    }

    render(){
        const { requestmodalclose, modalvisable } = this.props;
        return (
          
        <Modal
            visible={modalvisable}
            animationType={'slide'}
            transparent={true}
            onRequestClose={requestmodalclose}
        >
         
            <View style={styles.newname}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerStyle}>
                        <View style={styles.forgotContainer}>
                            <View style={styles.forgot}></View>
                            <View style={styles.forgotStyle}>
                                <Text style={styles.forgotPassText}>Change Password ?</Text>
                            </View>
                            <View style={styles.crossIconContainer}>
                                <Icon name='close' type="fontawesome"color='#fff' onPress={requestmodalclose} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Input
                            ref={input => (this.oldpassword = input)}
                            editable={true}
                            underlineColorAndroid={colors.TRANSPARENT}
                            placeholder={'Old Password'}
                            placeholderTextColor={colors.BLACK}
                            value={this.state.oldpassword}
                            inputStyle={styles.inputTextStyle}
                            onChangeText={(text)=>{this.setState({oldpassword: text})}}
                            errorMessage={this.state.oldpasswordValid ? null : 'Please enter a old password'}
                            secureTextEntry
                            blurOnSubmit={true}          
                            onSubmitEditing={() => { this.validateEmail('old'); this.newpassword.focus() }}
                            errorStyle={styles.errorMessageStyle}
                            inputContainerStyle={styles.emailInputContainerStyle}
                            containerStyle={styles.emailInputContainer}
                        />  
                     
                     <Input
                            ref={input => (this.newpassword = input)}
                            editable={true}
                            underlineColorAndroid={colors.TRANSPARENT}
                            placeholder={'New Password'}
                            placeholderTextColor={colors.BLACK}
                            value={this.state.newPassword}
                            inputStyle={styles.inputTextStyle}
                            onChangeText={(text)=>{this.setState({newPassword: text})}}
                            errorMessage={this.state.newpasswordValid ? null : 'Please enter a new password'}
                            secureTextEntry
                            blurOnSubmit={true}          
                            onSubmitEditing={() => { this.validateEmail('newpassword'); }}
                            errorStyle={styles.errorMessageStyle}
                            inputContainerStyle={styles.emailInputContainerStyle}
                            containerStyle={styles.emailInputContainer}
                        /> 
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title={'Update'}
                            onPress={()=>{this.onPressForgot()}}
                            buttonStyle={styles.buttonStyle}
                            titleStyle={styles.buttonTitle}
                        />
                    </View>
                </View>
            </View>

        </Modal>
        )
    }
}

//style for this component
const styles=StyleSheet.create({
    newname: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,0.5)',
    },
      emailInputContainer: { 
        borderTopRightRadius:10, 
        borderTopLeftRadius: 10, 
        paddingLeft: 10,
        backgroundColor: colors.WHITE,
        paddingRight: 10, 
        paddingTop:10, 
        width: width-80,
        
    },
    errorMessageStyle: { 
        fontSize: 14, 
        fontWeight:'bold' 
    },
    inputTextStyle: {
        color:colors.BLACK,
        fontSize:14
    },
    buttonStyle: { elevation:0, bottom:15,width:'80%', alignSelf:"center",borderRadius: 20,borderColor: "transparent",backgroundColor: colors.GREY.btnPrimary,},
    buttonContainer: {flex:1, justifyContent:'center'},
    inputContainer: {flex:3, justifyContent:"center",paddingBottom:20},
    headerContainer: {height:250, backgroundColor:'#fff',width:'80%', justifyContent:'space-evenly'},
    headerStyle: {flex:1, flexDirection:'column',backgroundColor:colors.GREY.default, justifyContent:"center"},
    forgotPassText: {textAlign:"center",color:'#fff',fontSize:16,width:"100%"},
    forgotContainer: {flexDirection:"row", justifyContent:"space-between"},
    forgotStyle: {flex:3, justifyContent:"center"},
    crossIconContainer: {flex:1,left:'40%'},
    forgot: {flex:1},
    buttonTitle:{
        fontWeight: 'bold', 
        fontSize: 16,
        width:'100%',
        textAlign:'center'
    }
})
