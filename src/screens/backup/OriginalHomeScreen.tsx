import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, ScrollView, TouchableOpacity, Text, StatusBar, ImageBackground, Image, FlatList, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigation } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { useTranslation } from 'react-i18next';
import { VictoryPie } from "victory-native";
import COLOR from '../../constants/Theme/color';

// Components & Screens
import EmptyHomeScreen from '../HomeScreens/EmptyHomeScreen';

// Actions
import * as AlertsActions from '../../store/actions/alerts';
import * as UserActions from '../../store/actions/user';
import * as ThingsActions from '../../store/actions/things';
import { fetchIcons } from '../../store/actions/icons'

// Others
import { EnumListItems } from '../../utils/models'
import * as fcmManager from '../../utils/fcmManager';
import Loader from '../../components/Loader';
import Card from '../../components/Elements/Card';
import CustomTitle from '../../components/Text/CustomTitle';
import { setBadgeCount } from 'react-native-notification-badge';

const HomeScreen = (props: any) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const platform = Platform.OS;
    const navigation = useNavigation();

    const user = useSelector((state: RootState) => state.user.user);
    const userId = useSelector((state: RootState) => state.user.user.id);
    const things = useSelector((state: RootState) => state.things.things);
    const isLoading = useSelector((state: RootState) => state.things.isLoading);

    // Collecting Data for Pie Chart: Online & Offline
    const numOfThingsOnline = things.filter(thing => thing.onoff_status.toLowerCase() !== 'offline').length;
    const numOfThingsOffline = (things?.filter(thing => thing.onoff_status.toLowerCase() === 'offline')).length;

    // Collecting Data for Pie Chart: Warning
    const numOfThingsWithWarnings = (things.filter(thing => thing.warning_flag === true)).length;
    const numOfThingsWithoutWarnings = (things.filter(thing => thing.warning_flag === false)).length;

    // Collecting Data for Pie Chart: States
    const numOfThingsWithDrills = (things?.filter(thing => thing.onoff_status.toLowerCase() === 'drill')).length;
    const numOfThingsWithAlarms = (things?.filter(thing => thing.onoff_status.toLowerCase() === 'alarm')).length;
    const numOfThingsWithQuiet = (things?.filter(thing => thing.onoff_status.toLowerCase() === 'quiet')).length;

    // Data used to make the animate prop work
    const defaultOnOfflineData = [{ x: 'Online', y: 0 }, { x: 'Offline', y: 100 }];
    const defaultWarningData = [{ x: 'No Warning', y: 0 }, { x: 'Have Warning', y: 100 }];
    const defaultStateData = [{ x: 'Drill', y: 0 }, { x: 'Alarm', y: 0 }, { x: 'Quiet', y: 0 }, { x: 'Offline', y: 0 }];

    const [onOfflineData, setOnOfflineData] = useState(defaultOnOfflineData);
    const [warningData, setWarningData] = useState(defaultWarningData);
    const [stateData, setStateData] = useState(defaultStateData);

    let onlineList: EnumListItems = [];
    let warningList: EnumListItems = [];
    let stateList: EnumListItems = [];

    useEffect(() => {
        // Set Online-Offline Data Set
        onlineList.push({ x: t('common:online'), y: numOfThingsOnline, dataColor: COLOR.onlineChartColor })
        onlineList.push({ x: t('common:offline'), y: numOfThingsOffline, dataColor: COLOR.offlineCharColor })
        setOnOfflineData(onlineList); // Setting the data that we want to display

        // Set Warning Data Set
        warningList.push({ x: t('common:noWarning'), y: numOfThingsWithoutWarnings, dataColor: COLOR.noWarningChartColor })
        warningList.push({ x: t('common:haveWarning'), y: numOfThingsWithWarnings, dataColor: COLOR.haveWarningChartColor })
        setWarningData(warningList);

        // Set State Data Set
        // const stateCheckList = [numOfThingsWithDrills, numOfThingsWithAlarms, numOfThingsWithPreAlarm, numOfThingsWithQuiet, numOfThingsWithFault]
        const stateCheckList = [numOfThingsWithDrills, numOfThingsWithAlarms, numOfThingsWithQuiet, numOfThingsOffline]
        const stateTitleList = [t('common:drill'), t('common:alarm'), t('common:quiet'), t('common:offline')];
        const stateColorList = [COLOR.drillChartColor, COLOR.alarmChartColor, COLOR.quietChartColor, COLOR.offlineCharColor]

        for (let i = 0; i < stateCheckList.length; i++) {
            if (stateCheckList[i] > 0) {
                stateList.push({ x: stateTitleList[i], y: stateCheckList[i], dataColor: stateColorList[i] })
            }
        };
        setStateData(stateList);

    }, [things])

    // Data to fetch when app launch
    useEffect(() => {
        dispatch(AlertsActions.fetchAllAlerts());
        dispatch(ThingsActions.fetchThings());
        dispatch(fetchIcons());
        dispatch(UserActions.getUserFontSizeSetting());
    }, []);

    // Ask for user permission for receive notification + getting FCM Token
    useEffect(() => {

        if (!user.id) {
            return
        };

        console.log('Ask for user permission')

        fcmManager.requestUserPermission(user.id).then((authorize) => {

            if (authorize.enabled) {
                console.log('Auth status: ', authorize.authStatus);

                fcmManager.getFcmToken(user.id!).then((response) => {
                    if (response.msg == 'success') {
                        const fcmToken = response.fcmToken;

                        if (user.notification_token === fcmToken) {
                            console.log('token is the same, do not dispatch');
                            return
                        };

                        dispatch(UserActions.updateUserNotificationSetting(user.id!, fcmToken!, platform))
                    } else {
                        console.log(response)
                    }
                })
            } else {
                console.log('Notification permission denied. Auth status: ', authorize.authStatus)
            }
        });

    }, [userId]);

    // Push Notification Handling
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {

            console.log('A new FCM message arrived!')
            console.log(remoteMessage);

            if (remoteMessage.notification?.title === 'SwitchMobile') {
                console.log('Switch Mobile')
                // dispatch(AuthActions.forceLogoutShowModal(true));
                // setShowModal(true);
                return
            };

            if (remoteMessage.notification?.title === 'NewAlert') {
                dispatch(UserActions.hasUnread());
                dispatch(AlertsActions.fetchAllAlerts());
                dispatch(ThingsActions.fetchThings());
            }

        });

        return unsubscribe;
    }, []);

    // Background Notification Handling
    useEffect(() => {

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification,
            );

            if (remoteMessage.notification?.title === 'SwitchMobile') {
                console.log('Switch Mobile')
                // dispatch(AuthActions.forceLogoutShowModal(true));
                return
            };

            if (remoteMessage.notification?.title === 'NewAlert') {
                dispatch(AlertsActions.fetchAllAlerts());
                dispatch(ThingsActions.fetchThings());
                navigation.navigate("Alerts", { screen: 'AlertsScreen' });
            };

        });

        // Check whether an initial notification is available
        messaging().getInitialNotification()
            .then(remoteMessage => {

                console.log('Quit state remote message: ', remoteMessage)
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification,
                    );

                    if (remoteMessage.notification?.title === 'SwitchMobile') {
                        console.log('QUIT: Switch Mobile')
                        // dispatch(logout());
                        return
                    }

                    if (remoteMessage.notification?.title === "NewAlert") {
                        // dispatch(AlertsActions.fetchAllAlerts());
                        navigation.navigate("Alerts", { screen: 'AlertsScreen' });
                    }
                }
            });

    }, [])


    return (

        <>

            {things && things.length > 0 ?

                <ScrollView contentContainerStyle={styles.screen}>

                    <Button title='reset' onPress={() => { setBadgeCount(0) }} />

                    <View style={styles.chartContainer}>

                        <Card style={styles.card}>
                            <CustomTitle>{t('common:deviceState')}</CustomTitle>

                            <VictoryPie
                                animate={{ duration: 2000, easing: 'exp' }}
                                labels={({ datum }) => `${datum.x}: ${Math.round(datum.y)}`}
                                data={stateData}
                                width={280}
                                height={250}
                                // colorScale={statusGraphicColor}
                                innerRadius={50}
                                style={{
                                    data: {
                                        fill: (d) => d.slice.data.dataColor
                                    }
                                }}
                            />
                        </Card>

                        <Card style={styles.card}>
                            <CustomTitle>{t('common:deviceStatus')}</CustomTitle>

                            <VictoryPie
                                animate={{ duration: 2000, easing: 'exp' }}
                                labels={({ datum }) => `${datum.x}: ${Math.round(datum.y)}`}
                                data={onOfflineData}
                                width={280}
                                height={250}
                                // colorScale={onlineGraphicColor}
                                innerRadius={50}
                                style={{
                                    data: {
                                        fill: (d) => d.slice.data.dataColor
                                    }
                                }}
                            />
                        </Card>

                        <Card style={styles.card}>
                            <CustomTitle>{t('common:warning')}</CustomTitle>
                            <VictoryPie
                                animate={{ duration: 2000, easing: 'exp' }}
                                labels={({ datum }) => `${datum.x}: ${Math.round(datum.y)}`}
                                data={warningData}
                                width={280}
                                height={250}
                                // colorScale={warningGraphicColor}
                                innerRadius={50}
                                style={{
                                    data: {
                                        fill: (d) => d.slice.data.dataColor
                                    }
                                }}
                            />
                        </Card>
                    </View>

                    <View style={{ height: 20 }}></View>


                </ScrollView>

                :

                <>{

                    isLoading ? <Loader /> :

                        <EmptyHomeScreen
                            // MessagePopUp={
                            //     <MessagePopUp
                            //         visible={isForceLogoutShowModal}
                            //         title={t('sentence:youHaveBeenLoggedOut')}
                            //         text={t('sentence:reason')}
                            //         buttonText={t('alert:ok')}
                            //         onPress={() => {
                            //             dispatch(AuthActions.logout()),
                            //                 dispatch(clearAccountInfo()),
                            //                 dispatch(UserActions.clearUserInfo()),
                            //                 dispatch(AlertsActions.clearAlerts()),
                            //                 dispatch(ThingsActions.clearThings())
                            //         }}
                            //         // onPressCancel={() => setShowModal(!showModal)}
                            //         buttonNumber="1"
                            //     />
                            // }

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

const styles = StyleSheet.create({
    screen: {
        backgroundColor: COLOR.bgColor,
        alignItems: 'center',
        paddingTop: 5,
        // flex: 1,
    },
    chartContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '80%',
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        marginBottom: 2,
    },
    emptyDeviceScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: 220,
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        marginVertical: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    topBar: {
        height: 150,
        width: '100%',
        backgroundColor: COLOR.primaryColor,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: 'absolute',
    },
    topContainer: {
        height: 120,
        width: '85%',
        // backgroundColor: 'white',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    AddDeviceContainer: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deviceListContainer: {
        width: '100%',
        height: '100%',
        // backgroundColor: 'pink',
    },
    deviceBlock: {
        width: 200,
        marginRight: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    iconImageContainer: {
        width: 50,
        height: 50,
        marginRight: 20,
    },
    titleContainer: {
        marginTop: 20,
        marginBottom: 3,
        marginHorizontal: 35,
        borderRadius: 8,
        width: '85%',
    },
    center: {
        marginTop: 10,
        borderRadius: 8,
    },
    bottomContainer: {
        width: '85%',
        // marginTop: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    welcomeMsg: {
        marginTop: 20,
        marginBottom: 0,
        width: '85%',
        // backgroundColor: 'red',
    },
    recentAlertItem: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 8,
        width: '100%',
        alignItems: 'center',
        // marginBottom: 1,
        backgroundColor: 'white',
        // backgroundColor: 'pink',
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
});

export default HomeScreen;


