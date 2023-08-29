import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, ScrollView, TouchableOpacity, Text, StatusBar, ImageBackground, Image, FlatList, RefreshControl ,Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/store';
import messaging from '@react-native-firebase/messaging';
import { VictoryPie } from "victory-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLOR from '../../constants/Theme/color';
import { Alert as AlertInterface } from '../../store/reducers/alerts'
import { productIcons } from '../../assets/images/mapping';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

// Components & Screens
import CustomText from '../../components/Text/CustomText';
import EmptyHomeScreen from './EmptyHomeScreen';
import Loader from '../../components/Loader';

// Actions
import * as AlertsActions from '../../store/actions/alerts';
import * as UserActions from '../../store/actions/user';
import * as ThingsActions from '../../store/actions/things';
import { fetchIcons } from '../../store/actions/icons';
import { fetchLocations } from '../../store/actions/locations';

// Others
import { EnumListItems } from '../../utils/models'
import * as fcmManager from '../../utils/fcmManager';
import { notificationManager } from '../../utils/NotificationManager'
import { getTranslateType, formatDateTime, fireSensorGetColorFromStatusOrWarning } from '../../utils/resuableMethods';
import alert from '../../constants/translations/zh-CN/alert';


const HomeScreen = (props: any) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const platform = Platform.OS;
    const navigation = useNavigation();

    const user = useSelector((state: RootState) => state.user.user);
    const userId = useSelector((state: RootState) => state.user.user.id);
    const things = useSelector((state: RootState) => state.things.things);
    const alertsList = useSelector((state: RootState) => state.alerts.allAlerts);
    const isLoading = useSelector((state: RootState) => state.things.isLoading);
    const accountId = useSelector((state: RootState) => state.account.account.id);
    const locations = useSelector((state: RootState) => state.locations.locations);
    
    // Collecting Data for Master Ring Pie Chart
    // const numOfThingsWithDrills = (things?.filter(thing => thing.onoff_status.toLowerCase() === 'drill')).length;
    // const numOfThingsWithAlarms = (things?.filter(thing => thing.onoff_status.toLowerCase() === 'alarm')).length;
    // const numOfThingsWithQuiet = (things?.filter(thing => thing.onoff_status.toLowerCase() === 'quiet')).length;
    const numOfThingsOffline = things?.filter(thing => thing.onoff_status.toLowerCase() === 'offline').length;

    const numOfThingsWithNormal = (things?.filter(thing => thing.onoff_status?.toLowerCase() === 'normal')).length;
    const numOfThingsWithAlarms = (things?.filter(thing => thing.onoff_status?.toLowerCase() === 'alarm')).length;

    // Data used to make the animate prop work
    // const defaultMasterRingData = [{ x: 'Drill', y: 0 }, { x: 'Alarm', y: 0 }, { x: 'Quiet', y: 0 }, { x: 'Offline', y: 100 }]
    const defaultMasterRingData = [{ x: 'Normal', y: 0}, { x: 'Alarm', y: 0 }]
    const [masterRingData, setMasterRingData] = useState(defaultMasterRingData);
    const [pinClick, setPinClick] = useState(0);

    let emptyAlert: AlertInterface[] = [];
    let masterRingList: EnumListItems = [];

    const [firstThreeAlerts, setFirstThreeAlerts] = useState(emptyAlert);

    let mapPins = []
    let sumLonOfPin = 0;
    let sumLatOfPin = 0;

    things.forEach( thing => {


        if( thing?.latitude && thing?.longitude) {
        mapPins.push({
            id: thing.id,
            name: thing.name,
            latitude: thing.latitude,
            longitude: thing.longitude,
            status: thing.onoff_status,
        })
    }
    })

    mapPins.forEach( pin => {

        sumLonOfPin += parseFloat(pin.longitude)
        sumLatOfPin += parseFloat(pin.latitude)
    })

    let centerLon = sumLonOfPin/mapPins.length
    let centerLat = sumLatOfPin/mapPins.length

    useEffect(() => {
        mapPins = []
        things.forEach( thing => {
        
        if( thing?.latitude && thing?.longitude) {
        mapPins.push({
            id: thing.id,
            name: thing.name,
            latitude: thing.latitude,
            longitude: thing.longitude,
            status: thing.onoff_status,
        })
        }
    })
    })


    // Fetch alerts, things, icons, and font size when app launch
    useEffect(() => {
        
        dispatch(AlertsActions.fetchAllAlerts());
        dispatch(ThingsActions.fetchThings());
        dispatch(fetchIcons());
        dispatch(UserActions.getUserFontSizeSetting());
        dispatch(fetchLocations());

        notificationManager.cancelAllNotification();
        notificationManager.iOSSetBadgeNumber(0);

    }, []);

    useEffect(() => {

        if (accountId !== null) {
            dispatch(AlertsActions.fetchAllAlerts());
            dispatch(ThingsActions.fetchThings());
            dispatch(fetchLocations());
        }

    }, [accountId]);

    // Update alert row when alert change
    useEffect(() => {

        if (alertsList.length <= 0) {
            return
        }

        const filterAlerts = alertsList.slice(0, 3);
        setFirstThreeAlerts(filterAlerts);

    }, [alertsList])

    // Update Master Ring Pie Chart Data Set when things change
    useEffect(() => {
        // const masterRingCheckList = [numOfThingsWithDrills, numOfThingsWithAlarms, numOfThingsWithQuiet, numOfThingsOffline];
        const masterRingCheckList = [numOfThingsWithNormal, numOfThingsWithAlarms, numOfThingsOffline]
        // const masterRingTitleList = [t('common:drill'), t('common:alarm'), t('common:quiet'), t('common:offline')];
        // const masterRingColorList = [COLOR.drillChartColor, COLOR.alarmChartColor, COLOR.quietChartColor, COLOR.offlineChartColor];
        const masterRingTitleList = [t('common:normal'), t('common:alarm'), t('common:offline')];
        const masterRingColorList = [COLOR.normalChartColor, COLOR.alarmChartColor, COLOR.offlineChartColor];

        for (let i = 0; i < masterRingCheckList.length; i++) {
            if (masterRingCheckList[i] > 0) {
                masterRingList.push({ x: masterRingTitleList[i], y: masterRingCheckList[i], dataColor: masterRingColorList[i] })
            }
        };

        setMasterRingData(masterRingList)
    }, [things])

    useEffect(() => {
        fcmManager.notificationListener()
    
    })


    /* ********** PUSH NOTIFICATION HANDLING BEGIN ********** */
    /* (1) Ask for user permission for receive notification + getting FCM Token */
    useEffect(() => {
            
        if (!user.id) {
            return
        };

        fcmManager.requestUserPermission(user.id).then((authorize) => {

            if (authorize.enabled) {
                // console.log('Auth status: ', authorize.authStatus);

                fcmManager.getFcmToken(user.id!).then((response) => {
                    if (response.msg == 'success') {
                        const fcmToken = response.fcmToken;

                        if (user.notification_token === fcmToken) {
                            // console.log('token is the same, do not dispatch');
                            return
                        };

                        //dispatch(UserActions.updateUserNotificationSetting(user.id!, fcmToken!, platform))
                    } else {
                        // console.log(response)
                    }
                })
            } else {
                // console.log('Notification permission denied. Auth status: ', authorize.authStatus);
                // dispatch(actionTriggerShowModal(true, 'Push Permission', 'Push permission denied'))
            }
        });

        

    }, [userId]);

    /* (2) Push Notification Handling */
    useEffect(() => {
        
        const unsubscribe = messaging().onMessage(async remoteMessage => {

            //console.log('A new FCM message arrived!, remote message: ', remoteMessage)

            if (remoteMessage.notification?.title === 'SwitchMobile') {
                // console.log('Switch Mobile')
                // dispatch(AuthActions.forceLogoutShowModal(true));
                // setShowModal(true);
                return
            };

            if (remoteMessage.notification?.title === 'NewAlert') {
                //console.log('received notification from Push Notification Handling');
                dispatch(UserActions.hasUnread());
                dispatch(ThingsActions.fetchThings());
                dispatch(AlertsActions.fetchAllAlerts());
            }

        });

        return unsubscribe;
    }, []);

    /* (3) Background Notification Handling */
    useEffect(() => {

        messaging().onNotificationOpenedApp(remoteMessage => {
             console.log('Notification caused app to open from background state:', remoteMessage.notification,);

            // Empty Notification Tray
            notificationManager.cancelAllNotification();

            if (remoteMessage.notification?.title === 'SwitchMobile') {
                return
            };

            if (remoteMessage.notification?.title === 'NewAlert') {
                console.log('received notification from Background Notification Handling');
                dispatch(ThingsActions.fetchThings());
                dispatch(AlertsActions.fetchAllAlerts());
                navigation.navigate("Alerts", { screen: 'AlertsScreen' });
            };

        });

        // Check whether an initial notification is available
        messaging().getInitialNotification()
            .then(remoteMessage => {

                // console.log('Quit state remote message: ', remoteMessage)

                if (remoteMessage) {
                    // console.log('Notification caused app to open from quit state:', remoteMessage.notification);

                    if (remoteMessage.notification?.title === 'SwitchMobile') {
                        // dispatch(logout());
                        return
                    }

                    if (remoteMessage.notification?.title === "NewAlert") {
                        dispatch(AlertsActions.fetchAllAlerts());
                        navigation.navigate("Alerts", { screen: 'AlertsScreen' });
                    }
                }
            });

    }, [])

    /* ********** PUSH NOTIFICATION HANDLING  END ********** */

    // This Screen Components
    const RecentAlertItem = (props: any) => {
        return (
            <TouchableOpacity style={styles.recentAlertItem} onPress={() => { navigation.navigate('AlertDetailsScreen', { id: props.id }) }}>
                <Image style={{ height: 25, width: 25 ,tintColor: "red"}} source={require('../../assets/images/components/siren-removebg.png')} />
                <View style={{ width: '68%', marginLeft: 10 }}>
                    <CustomText style={{ width: '100%' }} >{props.name}</CustomText>
                    <CustomText style={{ width: '100%' }}>{formatDateTime(props.startDatetime)}</CustomText>
                </View>

                <View style={{ width: '22%' }}>
                    <CustomText style={{ width: '100%' }} ellipsizeMode='tail' numberOfLines={1} >{getTranslateType(props.alertType)}</CustomText>
                    <CustomText style={{ width: '100%' }} ellipsizeMode='tail' numberOfLines={1} >{props.issue_text}</CustomText>

                </View>


                
            </TouchableOpacity>
        )
    };

    {/*const DeviceItem = (itemData: any) => {
        return (
            <TouchableOpacity
                style={[{ ...styles.deviceBlock }, { backgroundColor: fireSensorGetColorFromStatusOrWarning(itemData.item.state, itemData.item.onoff_status, itemData.item.warning_flag) }]}
                onPress={() => { navigation.navigate('Devices', { screen: 'ThingDetailsScreen', params: { id: itemData.item.id } }) }}
            >
                <View style={styles.iconImageContainer}>
                    <Image style={{ width: '100%', height: '100%' }} source={{uri: itemData.item.icon_url}} />
                </View>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <CustomText style={{}} numberOfLines={1} >{itemData.item.name}</CustomText>
                </View>
            </TouchableOpacity>
        )
    };*/}

    const LocationItem = (itemData: any) => {
        return (
            <TouchableOpacity
                style={[{ ...styles.deviceBlock }, { backgroundColor: 'white'}]}
                onPress={() => { navigation.navigate('Locations', { screen: 'LocationDetailsScreen', params: { id: itemData.item.id } }) }}
            >
                <View style={styles.iconImageContainer}>
                    <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/images/company_logo/locations.jpeg')} />
                </View>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <CustomText style={{}} numberOfLines={1} >{itemData.item.name}</CustomText>
                </View>
            </TouchableOpacity>
        )
    };

    // This Screen Functions
    const onRefresh = () => {
        dispatch(AlertsActions.fetchAllAlerts());
        dispatch(ThingsActions.fetchThings());
        
    }

    return (

        <>

            {things && things.length > 0 ?
                
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={onRefresh}
                        />
                    }
                    contentContainerStyle={styles.screen}>
                    <StatusBar
                        animated={true}
                        backgroundColor={COLOR.primaryColor}
                    />


                    {/* ********** To add the TOP BG COLOR when scroll ********** */}
                    {Platform.OS === 'ios' && (
                        <View
                            style={{
                                backgroundColor: COLOR.primaryColor,
                                height: 1000,
                                position: 'absolute',
                                top: -1000,
                                left: 0,
                                right: 0,
                            }}
                        />
                    )}

                    {/* ********** App Main Content Below ********** */}

                    <View style={styles.topBar}>
                    </View>

                    {Platform.OS === 'ios' && isLoading && <Loader />}


                    <View style={styles.welcomeMsgContainer}>
                        <Text style={{ fontSize: 28, color: COLOR.headerButtonColor, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode='head' >
                            {t('sentence:hello')} {user.name}
                        </Text>
                        <CustomText style={{ color: COLOR.headerButtonColor }}>{t('sentence:greeting')}</CustomText>
                    </View>


                    {/* ********** (1) Current Devices Row ********** */}

                    {/* <View style={styles.titleContainer}>
                        <CustomText style={styles.rowTitle}>{t('common:currentDevices')}</CustomText>
                    </View>

                    <View style={styles.currentDevicesRow}>
                        <View style={styles.deviceListContainer} >
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={things}
                                keyExtractor={item => item.id.toString()}
                                renderItem={DeviceItem}
                                maxToRenderPerBatch={5}
                                initialNumToRender={5}
                                updateCellsBatchingPeriod={30}
                            />
                        </View>
                    </View > */}

                    {/* ********** (1)  Locations Row ********** */}
                    <View style={styles.titleContainer}>
                        <CustomText style={styles.rowTitle}>{t('navigate:locations')}</CustomText>
                    </View>

                    <View style={styles.currentDevicesRow}>
                        <View style={styles.deviceListContainer} >
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={locations}
                                keyExtractor={item => item.id.toString()}
                                renderItem={LocationItem}
                                maxToRenderPerBatch={5}
                                initialNumToRender={5}
                                updateCellsBatchingPeriod={30}
                            />
                        </View>
                    </View >

                    {/* ********** (2) Devices Status Row ********** */}

                    <View style={styles.titleContainer}>
                        <CustomText style={styles.rowTitle}>{t('common:personStatus')}</CustomText>
                    </View>

                    <View style={styles.deviceStatusRow}>

                        <View style={styles.pieChartContainer}>
                            <ImageBackground
                                style={[{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center', }]}
                                resizeMode='contain'
                                source={require('../../assets/images/company_logo/personstatus.jpeg')}>

                                <VictoryPie
                                    animate={{ duration: 2000, easing: 'exp' }}
                                    labels={({ datum }) => `${datum.x}: ${Math.round(datum.y)}`}
                                    data={masterRingData}
                                    width={500}
                                    height={250}
                                    style={{
                                        data: {
                                            fill: (d) => d.slice.data.dataColor,
                                            
                                        },
                                        
                                    }}
                                    innerRadius={60}
                                />
                            </ImageBackground>
                        </View>
                    </View>

                    {/* Map */}
                    
                    
                    <View style={styles.titleContainer}>
                        <CustomText style={styles.rowTitle}>{t('common:map')}</CustomText>
                    </View>
                    <View style={styles.map}>
                    <MapView
                        style={{height:300, width: '100%', marginTop: 15}}
                        provider= {PROVIDER_GOOGLE}
                        showsUserLocation
                        followsUserLocation={true}
                        zoomControlEnabled={true}
                        zoomEnabled={true}
                        initialRegion={{
                            latitude: centerLat,
                            longitude: centerLon,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,

                        }}
                    >
                        
                        {mapPins.map((r) => (
                                
                                <Marker
                                    coordinate= {{
                                        latitude: parseFloat(r?.latitude), 
                                        longitude: parseFloat(r?.longitude) 
                                    }} 
                                    title={r?.name}
                                    pinColor={r.status.toLowerCase() == "alarm" ? "red" : r.status.toLowerCase() == "normal" ? "green" : "blue"}
                                    key={`${r.id}${Date.now()}`}
                                    onCalloutPress={() => 
                                        navigation.navigate('ThingDetailsScreen', {
                                        id: r.id
                                    })}
                                />
                        )
                        )
                        }

                    </MapView>
                    </View>
                    
                    {/* ********** (3) Recent Alerts Row ********** */}

                    <View style={styles.titleContainer}>
                        <CustomText style={styles.rowTitle}>{t('common:recentAlert')}</CustomText>
                    </View>

                    <View style={styles.recentAlertsRow}>

                        {firstThreeAlerts.map(alert => {
                            
                            return (
                                <RecentAlertItem alertType={alert.alert_type} key={alert.id} id={alert.id} startDatetime={alert.start_datetime} issue_text={alert.issue_text}/>
                               // <RecentAlertItem alertType={alert.alert_type} key={alert.id} id={alert.id} startDatetime={alert.start_datetime} name={alert?.thing_name} issue_text={alert.issue_text}/>
                            )
                        })}
                    </View>



                    

                    {/* ********** Bottom Empty Space ********** */}

                    <View style={{ height: 20 }}></View>

                </ScrollView>

                :

                // ********** If user has no register devices, return Empty Home Screen **********
                <>
                    {
                        isLoading ?

                            <Loader />
                            :
                            <EmptyHomeScreen
                                username={user.name}
                                onPress={() => {
                                    props.navigation.navigate('Devices', { screen: 'ScanDeviceScreen' })
                                }}
                            />

                    }
                </>

            }

        </>
    )
};

// Constant for Styles
const rowWidth = '85%';

const styles = StyleSheet.create({
    screen: {
        backgroundColor: COLOR.bgColor,
        alignItems: 'center',
        paddingTop: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    topBar: {
        height: 150,
        width: '100%',
        backgroundColor: COLOR.primaryColor,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: 'absolute',
    },
    welcomeMsgContainer: {
        marginTop: 20,
        marginBottom: 0,
        width: '85%',
    },
    titleContainer: {
        marginTop: 20,
        marginBottom: 3,
        marginHorizontal: 35,
        borderRadius: 8,
        width: '85%',
    },
    rowTitle: {
        fontWeight: 'bold'
    },
    currentDevicesRow: {
        height: 120,
        width: rowWidth,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deviceBlock: {
        width: 200,
        marginRight: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    iconImageContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    deviceStatusRow: {
        height: 250,
        width: rowWidth,
    },
    pieChartContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deviceListContainer: {
        width: '100%',
        height: '100%',
    },
    recentAlertsRow: {
        width: rowWidth,
        borderRadius: 8,
        overflow: 'hidden',
    },
    recentAlertItem: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    map: {

        flexDirection: 'row',
        width: "83%",
    }
});

export default HomeScreen;


