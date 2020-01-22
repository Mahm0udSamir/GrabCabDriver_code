import React from 'react';
import { StyleSheet,
    View,
    Text,
    StatusBar,
    TouchableWithoutFeedback,
    ImageBackground,
    ScrollView,
    Dimensions,
    Platform,
    AsyncStorage
 } from 'react-native';
 import Polyline from '@mapbox/polyline';
 import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
 import { Header, Rating, Avatar, Button } from 'react-native-elements';
 import Dash from 'react-native-dash';
 import StarRating from 'react-native-star-rating';
import * as firebase from 'firebase';
import { colors } from '../common/theme';
import { google_map_key } from '../common/key';

 var { width } = Dimensions.get('window');


export default class RideDetails extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            coords: [],
            intialregion: {},
            starCount: null
        }
        this.getRideDetails= this.props.navigation.getParam('data');
        //console.log(this.getRideDetails)
    }

    componentDidMount(){
        if(this.getRideDetails){
            
            this.setState({
                paramData: this.getRideDetails,
                intialregion:{
                    latitude: this.getRideDetails.pickup.lat,
                    longitude: this.getRideDetails.pickup.lng,
                    latitudeDelta: 0.9922,
                    longitudeDelta: 0.9421,
                },
                curUid: firebase.auth().currentUser.uid,
                payButtonShow: (this.getRideDetails.payment_status == 'DUE' || this.getRideDetails.payment_status == 'IN_PROGRESS' || this.getRideDetails.status == 'ACCEPTED') ? true : false
            },()=>{

                //console.log(this.state.paramData.rating);
                this.getDirections('"'+this.state.paramData.pickup.lat+','+this.state.paramData.pickup.lng+'"', '"'+this.state.paramData.drop.lat+','+this.state.paramData.drop.lng+'"');
                this.forceUpdate();
            })
        }
    }


    // find your origin and destination point coordinates and pass it to our method.
    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=${ google_map_key }`)
            let respJson = await resp.json();
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            this.setState({coords: coords})
            return coords
        }
        catch(error) {
            alert(error)
            return error
        }
    }

    //go back
    goBack(){
        this.props.navigation.goBack();
    }

    //tracking the ride
    trackNow(item) {
      console.log('item',item)
      if(item.status == 'START' || item.status == 'END'){
        firebase.database().ref('bookings/' + item.bookingUid + '/').once('value',(snap)=>{
            if(snap.val()){
                AsyncStorage.getItem('startTime', (err, result) => {
                    if(result){
                        let bookingData = snap.val()
                        bookingData.bookingId = item.bookingUid;
                        this.props.navigation.navigate('DriverTripComplete', { allDetails: bookingData, starttime: parseInt(result) })
                    }    
                });
            }
        })
            
      }else if(item.status == 'ACCEPTED'){ 
        firebase.database().ref('bookings/' + item.bookingUid + '/').once('value',(snap)=>{
            if(snap.val()){
                let bookingData = snap.val();
                bookingData.bookingId = item.bookingUid;
                this.props.navigation.navigate('DriverTripStart', {allDetails: bookingData})
            }
        })
        
      }
       
    }

    render(){
        return(            
            <View style={styles.mainView}>
                <Header 
                    backgroundColor={colors.GREY.default}
                    leftComponent={{icon:'ios-arrow-back', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.goBack()} }}
                    centerComponent={<Text style={styles.headerTitleStyle}>My Bookings Details</Text>}
                    // rightComponent={{icon:'ios-notifications', type:'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{this.props.navigation.navigate('Notifications');} }}
                    containerStyle={styles.headerStyle}
                    innerContainerStyles={{marginLeft:10, marginRight: 10}}
                />  
                <ScrollView>
                    <View style={styles.mapView}>
                        <View style={styles.mapcontainer}>
                            <MapView style={styles.map} 
                                provider={PROVIDER_GOOGLE}
                                region={{
                                    latitude:(this.state.intialregion.latitude?this.state.intialregion.latitude:22), 
                                    longitude:(this.state.intialregion.longitude?this.state.intialregion.longitude:88), 
                                    latitudeDelta: 0.9922,
                                     longitudeDelta: 1.9421
                                }}
    
                            >
                                <Marker
                                    coordinate={{latitude:this.state.paramData?(this.state.paramData.pickup.lat):0.00, longitude: this.state.paramData?(this.state.paramData.pickup.lng):0.00}}
                                    title={'pick-up location'}
                                    description={this.state.paramData?this.state.paramData.pickup.add:null}
                                />

                                <Marker
                                    coordinate={{latitude: this.state.paramData?(this.state.paramData.drop.lat):0.00, longitude: this.state.paramData?(this.state.paramData.drop.lng):0.00}}
                                    title={'drop location'}
                                    description={this.state.paramData?this.state.paramData.drop.add:null}
                                    pinColor={colors.GREEN.default}
                                />

                                <MapView.Polyline 
                                    coordinates={this.state.coords?this.state.coords:{latitude:0.00,longitude:0.00}}
                                    strokeWidth={4}
                                    strokeColor={colors.BLUE.default}
                                />

                            </MapView>
                        </View>
                    </View>      
                    <View style={styles.rideDesc}>
                        <View style={styles.userDesc}>
                            <Avatar
                                size="small"
                                rounded
                                source={Platform.OS=='ios'?require('../../assets/images/demoProfile.jpg'):require('../../assets/images/profilePic.jpg')}
                                activeOpacity={0.7}
                            />                 
                            <View style={styles.userView}>
                                <Text style={styles.personStyle}>{this.state.paramData ? this.state.paramData.driver_name : ""}</Text>
                                <View style={styles.personTextView}>
                                {this.state.paramData && this.state.paramData.rating?<Text style={styles.ratingText}>You have been rated</Text>:<Text style={styles.ratingText}>You have no rating</Text>}
                                    {this.state.paramData && this.state.paramData.rating?
                                    <Rating
                                        showRating
                                        type="star"
                                        startingValue={this.state.paramData.rating}
                                        readonly
                                        imageSize={15}
                                        onFinishRating={this.ratingCompleted}
                                        style={{ paddingVertical: 10 }}
                                        showRating={false}
                                    />
                                    :null}
                                </View>
                            </View>
                        </View>
                        
                        <View style={styles.userDesc}>
                            <Avatar
                                size="small"
                                rounded
                                source={require('../../assets/images/fareMetar.png')}
                                activeOpacity={0.7}
                                avatarStyle={{backgroundColor: colors.WHITE}}
                            />
                            <View style={styles.userView}>
                                <Text style={styles.textStyle}>$ {this.state.paramData && this.state.paramData.trip_cost>0?this.state.paramData.trip_cost.toFixed(2):this.state.paramData && this.state.paramData.estimate?this.state.paramData.estimate:0 }</Text>
                            </View>
                        </View>
                    </View> 
                    <View style={styles.locationView}>
                        <View style={styles.location}>
                            <View>
                                <Text style={styles.timeStyle}>{ this.state.paramData ? this.state.paramData.trip_start_time : ""}</Text>
                            </View>
                            <View style={styles.address}>
                                <View style={styles.redDot} />
                                <Text style={styles.adressStyle}>{ this.state.paramData ? this.state.paramData.pickup.add : ""}</Text>
                            </View>
                        </View>
                        <View style={styles.location}>
                            <View>
                                <Text style={styles.timeStyle}>{ this.state.paramData ? this.state.paramData.trip_end_time : ""}</Text>
                            </View>
                            <View style={styles.address}>
                                <View style={styles.greenDot} />
                                <Text style={styles.adressStyle}>{ this.state.paramData ? this.state.paramData.drop.add : ""}</Text>
                            </View>
                        </View>
                    </View>  
                    {this.state.paramData && this.state.paramData.payment_status?this.state.paramData.payment_status == "IN_PROGRESS" || this.state.paramData.payment_status == "PAID" || this.state.paramData.payment_status == "WAITING"? 
                    <View style={styles.billView}>
                        <View style={styles.billView}>
                            <Text style={styles.billTitle}>Bill Details</Text>
                        </View>
                        <View style={styles.billOptions}>
                            <View style={styles.billItem}>
                                <Text style={styles.billName}>Your Trip</Text>
                                <Text style={styles.billAmount}>{this.state.paramData ? "$ "+this.state.paramData.trip_cost.toFixed(2) : "0"}</Text>
                            </View>
                            <View style={styles.billItem}>
                                <View>
                                    <Text style={[styles.billName, styles.billText]}>Total Bill</Text>
                                    <Text style={styles.taxColor}>Includes all Taxes</Text>
                                </View>
                                <Text style={styles.billAmount}>{this.state.paramData ? "$ "+this.state.paramData.trip_cost.toFixed(2) : "0"}</Text>
                            </View>
                        </View>
                        <View style={styles.paybleAmtView}>
                            <Text style={styles.billTitle}>Total Payable</Text>
                            <Text style={styles.billAmount}>{this.state.paramData ? "$ "+this.state.paramData.trip_cost.toFixed(2) : "0"}</Text>
                        </View>
                    </View>
                    :null:null}

                    <View>

                    {this.state.paramData && this.state.paramData.payment_status?this.state.paramData.payment_status == "IN_PROGRESS" || this.state.paramData.payment_status == "PAID" || this.state.paramData.payment_status == "WAITING"?
                        <View>
                            <View style={styles.iosView}>
                                {
                                Platform.OS=='ios' ?
                                    <ImageBackground source={require('../../assets/images/dash.png')}
                                        style={styles.backgroundImage}
                                        resizeMode= {Platform.OS=='ios'?'repeat':'stretch'}>
                                    </ImageBackground>
                                    :
                                    <Dash style={styles.dashView}/>
                                }
                            </View>

                            <View style={styles.paymentTextView}>
                                <Text style={styles.billTitle}>Payment Status</Text>
                            </View>
                            <View style={styles.billOptions}>
                                <View style={styles.billItem}>
                                    
                                    <Text style={styles.billAmount}>{this.state.paramData ? this.state.paramData.payment_status : ""}</Text>
                                    <Text style={styles.billName}>{this.state.paramData ? this.state.paramData.payment_mode : ""}</Text>
                                </View>
                            </View>
                        </View>
                        :null:null}

                        {
                            this.state.payButtonShow ?
                            <Button 
                                title='Goto Booking'
                                titleStyle={{fontFamily: 'Roboto-Bold',}}
                                onPress={() => {
                                    this.trackNow(this.state.paramData);
                                }}
                                buttonStyle={styles.myButtonStyle}
                            />
                            :
                            null
                        }

                    </View>
                </ScrollView>
            </View>
        )
    }
}

//Screen Styling
const styles = StyleSheet.create({
    headerStyle: { 
        backgroundColor: colors.GREY.default, 
        borderBottomWidth: 0 
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 20
    },
    containerView:{ 
        flex:1 
    },
    textContainer:{
        textAlign:"center"
    },
    mapView: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 160,
        marginBottom: 15
    },
    mapcontainer: {
        flex: 7,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: colors.TRANSPARENT,
        borderStyle: 'solid',
        borderLeftWidth: 9,
        borderRightWidth: 9,
        borderBottomWidth: 10,
        borderLeftColor: colors.TRANSPARENT,
        borderRightColor: colors.TRANSPARENT,
        borderBottomColor: colors.YELLOW.secondary,
        transform: [
            {rotate: '180deg'}
          ]
    },
    rideDesc: {
        flexDirection: 'column'
    },
    userDesc: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    userView: {
        flexDirection: 'column',
        paddingLeft: 28,
    },
    locationView: {
        flexDirection: 'column',
        paddingHorizontal: 10,
        marginVertical: 14
    },
    location: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 6
    },
    greenDot: {
        backgroundColor: colors.GREEN.default,
        width: 10,
        height: 10,
        borderRadius: 50,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    redDot: {
        backgroundColor: colors.RED,
        width: 10,
        height: 10,
        borderRadius: 50,
        alignSelf: 'flex-start',
        marginTop: 5
    },
    address: {
        flexDirection: 'row', 
        flexGrow: 1, 
        justifyContent: 'flex-start', 
        alignItems: 'flex-start', 
        width: 0, 
        marginLeft: 6
    },
    billView: {
        marginVertical: 5
    },
    billTitle: {
        fontSize: 20,
        color: colors.GREY.default,
        fontFamily: 'Roboto-Bold'
    },
    billOptions: {
        marginHorizontal: 10,
        marginVertical: 15
    },
    billItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: 15
    },
    billName: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        color: colors.GREY.default
    },
    billAmount: {
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        color: colors.GREY.default
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: 2,
    },
    carNoStyle:{
        fontSize: 18, 
        fontWeight: 'bold', 
        fontFamily: 'Roboto-Bold'
    },
    textStyle:{
        fontSize: 18, 
        fontWeight: 'bold', 
        fontFamily: 'Roboto-Bold'
    },
    mainView:{ 
        flex:1, 
        backgroundColor: colors.WHITE, 
    },
    personStyle:{
        fontSize: 18, 
        fontWeight: 'bold', 
        color: colors.BLACK, 
        fontFamily: 'Roboto-Bold'
    },
    personTextView:{
        flexDirection: 'row', 
        alignItems: 'center'
    },
    ratingText:{
        fontSize: 16, 
        color: colors.GREY.iconSecondary, 
        marginRight: 8, 
        fontFamily: 'Roboto-Regular'
    },
    avatarView:{
        marginVertical: 15
    },
    timeStyle:{
        fontFamily: 'Roboto-Regular', 
        fontSize: 16, 
        marginTop: 1
    },
    adressStyle:{
        marginLeft: 6, 
        fontSize: 15, 
        lineHeight: 20
    },
    billView:{
        paddingHorizontal: 14
    },
    billText:{
        fontFamily: 'Roboto-Bold'
    },
    taxColor:{
        color: colors.GREY.default
    },
    paybleAmtView:{
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 10
    },
    iosView:{
        paddingVertical: 10
    },
    dashView:{
        width:width, height:1
    },
    paymentTextView:{
        paddingHorizontal: 10
    },

    myButtonStyle:{
        alignSelf: "center",
        elevation: 0,
        backgroundColor: colors.GREEN.default,
        width: 300,
        padding: 7,
        borderColor: colors.TRANSPARENT,
        borderWidth: 0,
        borderRadius: 10
    },
});