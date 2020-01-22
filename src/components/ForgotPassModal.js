import React, { Component } from 'react';
import { Modal,View,StyleSheet,Text,Dimensions,LayoutAnimation} from 'react-native';
import { Button, Input } from 'react-native-elements';

import { Icon } from 'react-native-elements'
import { colors } from '../common/theme';

var { width } = Dimensions.get('window');

export default class ForgotPassModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
            emailValid: true,
        }
    }
    //validation for email
    validateEmail() {
        const { email } = this.state
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const emailValid = re.test(email)
        LayoutAnimation.easeInEaseOut()
        this.setState({ emailValid })
        emailValid || this.emailInput.shake()
        return emailValid
    }

    //login press for validation check
    onPressForgot(){
        const { onPressForgotPass } = this.props;
        LayoutAnimation.easeInEaseOut();
        const emailValid = this.validateEmail();
        
        if ( emailValid ) {
            //login function of smart component
            onPressForgotPass(this.state.email);
            this.setState({email: ''})
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
                                <Text style={styles.forgotPassText}>Forgot Password?</Text>
                            </View>
                            <View style={styles.crossIconContainer}>
                                <Icon name='close' type="fontawesome"color='#fff' onPress={requestmodalclose} />
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Input
                            ref={input => (this.emailInput = input)}
                            editable={true}
                            underlineColorAndroid={colors.TRANSPARENT}
                            placeholder={'Email'}
                            placeholderTextColor={colors.BLACK}
                            value={this.state.email}
                            keyboardType={'email-address'}
                            inputStyle={styles.inputTextStyle}
                            onChangeText={(text)=>{this.setState({email: text})}}
                            errorMessage={this.state.emailValid ? null : 'Please enter a valid email address'}
                            secureTextEntry={false}
                            blurOnSubmit={true}
                            onSubmitEditing={() => { this.validateEmail() }}
                            errorStyle={styles.errorMessageStyle}
                            inputContainerStyle={styles.emailInputContainerStyle}
                            containerStyle={styles.emailInputContainer}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title={'Send Email'}
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
    },
      emailInputContainer: { 
        borderTopRightRadius:10, 
        borderTopLeftRadius: 10, 
        paddingLeft: 10,
        backgroundColor: colors.WHITE,
        paddingRight: 10, 
        paddingTop:10, 
        width: width-80
    },
    errorMessageStyle: {
        fontSize: 15, 
        fontWeight:'bold' 
    },
    inputTextStyle: {
        color:colors.BLACK,
        fontSize:16
    },
    buttonStyle: { elevation:0, bottom:15,width:'80%', alignSelf:"center",borderRadius: 20,borderColor: "transparent",backgroundColor: colors.GREY.btnPrimary,},
    buttonContainer: {flex:1, justifyContent:'center'},
    inputContainer: {flex:3, justifyContent:"center"},
    headerContainer: {height:250, backgroundColor:'#fff',width:'80%', justifyContent:'space-evenly'},
    headerStyle: {flex:1, flexDirection:'column',backgroundColor:colors.GREY.default, justifyContent:"center"},
    forgotPassText: {textAlign:"center",color:'#fff',fontSize:20,width:"100%"},
    forgotContainer: {flexDirection:"row", justifyContent:"space-between"},
    forgotStyle: {flex:3, justifyContent:"center"},
    crossIconContainer: {flex:1,left:'40%'},
    forgot: {flex:1},
    buttonTitle:{
        fontWeight: 'bold', 
        fontSize: 18,
        width:'100%',
        textAlign:'center'
    }
})
