import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    Dimensions,
    LayoutAnimation
  } from 'react-native';
import { Input, Button } from 'react-native-elements';
import {  colors } from '../common/theme';

var { width } = Dimensions.get('window');

export default class LoginComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            emailValid: true,
            passwordValid: true,
            pwdErrorMsg: ''
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

    //validation for password
    validatePassword() {
        const { complexity } = this.props
        const { password } = this.state
        const regx1 = /^([a-zA-Z0-9@*#]{8,15})$/
        const regx2 = /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
        if(complexity == 'any') {
            var passwordValid = password.length >=1;
            this.setState({pwdErrorMsg: "Password can't be blank"})
        }
        else if(complexity == 'alphanumeric') {
            var passwordValid = regx1.test(password);
            this.setState({pwdErrorMsg: 'Password must consists of at least 1 alphanumeric characters and 8-15 length'});
        }
        else if (complexity == 'complex') {
            var passwordValid = regx2.test(password);
            this.setState({pwdErrorMsg: 'Password must be atleast 1 small-case letter, 1 Capital letter, 1 digit, 1 special character and 6-10 length'})
        }
        LayoutAnimation.easeInEaseOut()
        this.setState({ passwordValid })
        passwordValid || this.passwordInput.shake()
        return passwordValid
    }

    //login press for validation check
    onPressLogin(){
        const { onPressLogin } = this.props;
        LayoutAnimation.easeInEaseOut();
        const emailValid = this.validateEmail();
        const passwordValid = this.validatePassword();
        
       if ( emailValid && passwordValid ) {
           //login function of smart component
            onPressLogin(this.state.email, this.state.password);
            this.setState({email: '', password: ''})
        }
    }
    
    render() {
        const { onPressRegister, onPressForgotPassword, loading } = this.props;

        return (
            <View>
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
                        onSubmitEditing={() => { this.validateEmail(); this.passwordInput.focus()}}
                        errorStyle={styles.errorMessageStyle}
                        inputContainerStyle={styles.emailInputContainerStyle}
                        containerStyle={styles.emailInputContainer}
                    />
                    <Input
                        ref={input => (this.passwordInput = input)}
                        editable={true}
                        blurOnSubmit={true}
                        underlineColorAndroid={colors.TRANSPARENT}
                        placeholder={'Password'}
                        placeholderTextColor={colors.BLACK}
                        value={this.state.password}
                        inputStyle={styles.inputTextStyle}
                        onChangeText={(text)=>{this.setState({password:text})}}
                        errorMessage={this.state.passwordValid ? null : this.state.pwdErrorMsg}
                        secureTextEntry={true}
                        onSubmitEditing={() => { this.validatePassword() }}
                        errorStyle={styles.errorMessageStyle}
                        inputContainerStyle={styles.pwdInputContainerStyle}
                        containerStyle={styles.pwdInputContainer}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        clear
                        title="Register"
                        loading={false}
                        loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                        titleStyle={styles.forgotTitleStyle}
                        onPress={onPressRegister}
                        buttonStyle={styles.buttonStyle}
                        containerStyle={{flex:1}}
                    />
                    <View style={styles.verticalLineStyle}/>
                    <Button
                        clear
                        title="Forgot Password ?"
                        loading={false}
                        onPress={onPressForgotPassword}
                        loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                        titleStyle={styles.forgotTitleStyle}
                        titleProps={{ numberOfLines: 2, ellipsizeMode: 'tail' }}
                        buttonStyle={styles.buttonStyle}
                        containerStyle={{flex:1.7}}
                    />
                    <Button
                        title="Login"
                        loading={loading}
                        loadingProps={{ size: "large", color: colors.BLUE.default.primary }}
                        titleStyle={styles.buttonTitleStyle}
                        onPress={()=>{this.onPressLogin()}}
                        buttonStyle={styles.loginButtonStyle}
                        containerStyle={styles.loginButtonContainer}
                    />
                </View>
                
            </View>
        );
    }
}

//style for this component
const styles = StyleSheet.create({
    inputContainer: {
        flex:1, 
        width:'90%',
        alignItems: 'flex-end',
        elevation: 20,
        justifyContent: 'flex-end',
        shadowColor: colors.BLACK, 
        shadowRadius: 10, 
        shadowOpacity: 0.6, 
        shadowOffset: {width: 0, height: 4}
    },
    buttonContainer: {
        flex: 1, 
        flexDirection: 'row', 
        marginRight: 10
    },
    loginButtonContainer: { 
        flex: 1, 
        elevation:0,
        shadowColor: colors.BLACK,
        shadowRadius: 10,
        shadowOpacity: 0.6,
        shadowOffset: {width: 0, height: 4}
    },
    loginButtonStyle: {
        backgroundColor: colors.SKY,
        height: 45,
        borderRadius: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    buttonStyle: { 
        backgroundColor: colors.BLUE.default.secondary, 
        height: 45 
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
    pwdInputContainer: { 
        borderBottomRightRadius:10, 
        borderBottomLeftRadius: 10, 
        paddingLeft: 10,
        backgroundColor: colors.WHITE, 
        paddingRight: 10, 
        paddingTop:5, 
        borderBottomColor:colors.WHITE, 
        borderBottomWidth: 0, 
        width: width-80
    },
    emailInputContainerStyle: {
        borderBottomColor:colors.BLACK, 
        borderBottomWidth: 1, 
        paddingBottom: 15
    },
    errorMessageStyle: { 
        fontSize: 12, 
        fontWeight:'bold',
        color: "#FD2323"
    },
    inputTextStyle: {
        color:colors.BLACK,
        fontSize:13
    },
    pwdInputContainerStyle: { 
        paddingBottom: 15 
    },
    verticalLineStyle: { 
        height: 25, 
        width:2, 
        top: 12, 
        backgroundColor: colors.WHITE 
    },
    buttonTitleStyle: { 
        fontWeight: "700",
        width:"100%"
    },
    forgotTitleStyle: { 
        fontWeight: "700",
        fontSize: 12,
        width:"100%"
    },
    buttonContainerStyle: {
        flex: 1
    }
});
