import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Image, ScrollView, Platform, Linking, Alert, RefreshControl } from 'react-native';
import { RootState } from '../../store/store';
import { productIcons } from '../../assets/images/mapping';
import ViewFloorplan from '../../components/ViewFloorplan';
import CustomButton from '../../components/CustomButton';
import EditButton from '../../components/EditButton';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Elements/Card';
import CustomText from '../../components/Text/CustomText';
import { getTranslateType, dialCall, formatDateTime } from '../../utils/resuableMethods';
import COLOR from '../../constants/Theme/color';
import { fetchAlert } from '../../store/actions/alerts'


const Row = (props: any) => {
    return (
        <View style={styles.row}>
            <CustomText style={styles.label}>{props.label}</CustomText>
            <CustomText style={styles.content}>{props.content}</CustomText>
        </View>
    );
};

//@ts-ignore
const AlertDetailsScreen = ({ route, navigation }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { id } = route.params;
    const alertDetails = useSelector((state: RootState) => state.alerts.allAlerts.find(alert => alert.id === id));
    const thing = useSelector((state: RootState) => state.things.things).find(thing => thing.id === alertDetails?.thing_id);
    const icon = useSelector((state: RootState) => state.icons.icons).find(icon => icon.id === thing?.icon_id);
    const location = useSelector((state: RootState) => state.locations.locations).find(location => location.id === thing?.location_id)
    const isLoading = useSelector((state: RootState) => state.alerts.isLoading);

    const onRefresh = () => {
         dispatch(fetchAlert(id));
     }

    const Label = (props: any) => {
        return (
            <CustomText style={{ ...{ fontWeight: 'bold', width: '35%' }, ...props.style }}>
                {props.children}
            </CustomText>
        )
    };
    

    if (!thing) {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
                <CustomText style={{ fontWeight: 'bold', textAlign: 'center' }}>{t('sentence:deviceHasNotBeenRegistered')}</CustomText>
            </View>
        )
    }


    return (
        <ScrollView
            style={{ backgroundColor: COLOR.bgColor }}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={onRefresh}
                />
            }
        >

            {!thing &&
                <View style={{
                    height: 500,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <CustomText style={{ fontWeight: 'bold', textAlign: 'center' }}>{t('sentence:deviceHasNotBeenRegistered')}</CustomText>
                    <CustomButton onPress={() => { navigation.navigate('Alerts', { screen: 'AlertsScreen' }) }}>Back</CustomButton>
                </View>
            }

            {thing &&

                <Card style={styles.card}>

                    <View style={styles.headerRow}>
                        <View style={styles.imageCol}>
                            {/* {icon && <Image style={styles.image} source={productIcons[thing.icon_id]} />} */}
                            {icon && <Image style={styles.image} source={{uri: thing.icon_url}} />}

                        </View>

                        <View style={styles.textCol}>
                            <CustomText style={styles.title}>{alertDetails?.thing_name}</CustomText>
                            <CustomText>{icon?.name}</CustomText>
                        </View>
                    </View>

                    <View style={styles.detailsContainer}>
                        <Row label={t('common:model')} content={icon?.code} />
                        <Row label={t('common:code')} content={alertDetails?.thing_code} />
                        <Row label={t('common:alertType')} content={getTranslateType(alertDetails?.alert_type)} />
                        <Row label={t('common:status')} content={alertDetails?.status === 'Clear' ? t('common:clear') : t('common:set')} />
                        <Row label={t('common:startTime')} content={formatDateTime(alertDetails?.start_datetime)} />
                        <Row label={t('common:endTime')} content={alertDetails?.end_datetime ? formatDateTime(alertDetails?.end_datetime) : t('common:null')} />
                        {/* <Row label={t('common:location')} content={`Block 01 ( ${thing?.x_coordinate}, ${thing?.y_coordinate} )`} /> */}
                        <Row label={t('form:details')} content={alertDetails?.details ? alertDetails?.details : t('common:null') }/>
                            
                        {alertDetails?.photo_url && 
                        <View style={styles.row}>
                            <View style={styles.photoContainer}>
                                <Image style={styles.photo} source={{uri: alertDetails?.photo_url }} />
                            </View>
                        </View>}
                    </View>

                    {/* {alertDetails?.alert_type === 'alarm' && alertDetails.status === 'Set' &&
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                style={styles.emergencyCallButton}
                                onPress={() => { dialCall('+852999') }}>
                                <Text style={styles.emergencyCallButtonText}>{t('buttons:emergencyCall')}</Text>
                            </CustomButton>
                        </View>
                    } */}

                    <View>
                        <ViewFloorplan
                            id={id}
                            x_coordinate={thing?.x_coordinate}
                            y_coordinate={thing?.y_coordinate}
                            onOffStatus={thing?.onoff_status}
                            photoUrl={location?.floorplan}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            style={{width: 150}}
                            onPress={() => {
                                navigation.navigate('ThingDetailsScreen', { id: alertDetails?.thing_id })
                                // navigation.navigate("Devices", {
                                //     screen: 'ThingDetailsScreen',
                                //     params: { id: alertDetails?.thing_id },
                                //     initial: false
                                // })
                            }}>
                            {t('buttons:viewDevice')}
                        </CustomButton>

                        <EditButton
                            style={{width: 150}}    
                            onPress={() => {
                                navigation.navigate('EditAlertScreen', { alert: alertDetails })
                            }}>
                            {t('buttons:editAlert')}
                        </EditButton>
                    </View>

                </Card>
            }
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginVertical: 20,
        padding: 15,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageCol: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textCol: {
        width: '75%',
        paddingHorizontal: 5,
        flexShrink: 1,
    },
    image: {
        width: '100%',
        height: 80,
        resizeMode: 'contain',
    },
    photo: {
        flex:1,
        height: 300, 
        resizeMode: 'contain', 
        backgroundColor: '#d9d9d9'
    },
    photoContainer: {
        flex:1,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dotted',
    },
    detailsContainer: {
        marginTop: 20,
        paddingHorizontal: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
    label: {
        fontWeight: 'bold',
        width: '35%',
    },
    content: {
        width: '62%',
    },
    title: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    emergencyCallButton: {
        backgroundColor: 'red',
        width: '100%',
        height: 60,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    emergencyCallButtonText: {
        color: 'white',
        //fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 5,
    }
});

export default AlertDetailsScreen;

