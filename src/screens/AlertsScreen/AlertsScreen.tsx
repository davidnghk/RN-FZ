import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, FlatList, StyleSheet, Platform, Image, RefreshControl, } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootState } from '../../store/store';
import { notificationManager } from '../../utils/NotificationManager';
import COLOR from '../../constants/Theme/color';

// Actions
import * as UserActions from '../../store/actions/user';
import * as AlertActions from '../../store/actions/alerts';
import { fetchThings } from '../../store/actions/things';

// Component
// import Loader from '../../components/Loader';
import AlertExpandableItem from '../../components/AlertExpandableItem';
import CustomText from '../../components/Text/CustomText';
import { useTranslation } from 'react-i18next';

const AlertsScreen = (props: any) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const allAlerts = useSelector((state: RootState) => state.alerts.allAlerts);
    const user = useSelector((state: RootState) => state.user.user);
    const isLoading = useSelector((state: RootState) => state.alerts.isLoading);

    function resetUnread() {
        if (user.id) {
            dispatch(UserActions.resetUnread());
        };
    };

    function onRefresh() {
        dispatch(AlertActions.fetchAllAlerts());
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            resetUnread();
            notificationManager.iOSSetBadgeNumber(0);

        });

        return unsubscribe;
    }, [navigation]);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(fetchThings());
            resetUnread();
            notificationManager.iOSSetBadgeNumber(0);

        }, []),
    );

    // For Noze
    // @ts-ignore
    // const renderAlertsItem = (itemData) => {
    //     return (
    //         <AlertItem
    //             status={itemData.item.status}
    //             alert_type={itemData.item.alert_type}
    //             start_datetime={itemData.item.start_datetime}
    //             end_datetime={itemData.item.end_datetime}
    //             thing_name={itemData.item.thing_name}
    //             thing_code={itemData.item.thing_code}
    //             thing_id={itemData.item.thing_id}
    //             onPress={() => {
    //                 navigation.navigate('AlertDetailsScreen', { id: itemData.item.id })
    //             }}
    //         />
    //     )
    // };

    // For FireAlert
    const renderAlertsItem = (itemData) => {
        return (
            <AlertExpandableItem
                status={itemData.item.status}
                alert_type={itemData.item.alert_type}
                start_datetime={itemData.item.start_datetime}
                end_datetime={itemData.item.end_datetime}
                thing_name={itemData.item.thing_name}
                icon_name={itemData.item.icon_name}
                model={itemData.item.icon_code}
                code={itemData.item.thing_code}
                thing_id={itemData.item.thing_id}
                navigation={props.navigation}
            />
        )
    };

    if (allAlerts.length <= 0) {
        return (
            <View style={styles.screen}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={require('../../assets/images/screen_main_images/Notification.jpg')} />
                </View>

                <CustomText style={{ textAlign: "center" }}>
                    {t('sentence:youhaveNoAlertYet')}
                </CustomText>
            </View>
        )
    }

    return (
        <View style={styles.screen}>

            {/* {isLoading && <Loader />} */}

            <View style={{ height: 10 }}></View>

            <FlatList
                data={allAlerts}
                keyExtractor={item => item.id.toString()}
                renderItem={renderAlertsItem}
                maxToRenderPerBatch={5}
                initialNumToRender={5}
                updateCellsBatchingPeriod={30}
                refreshControl={
                    <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                    />
                }
            />


        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLOR.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
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
});

export default AlertsScreen;