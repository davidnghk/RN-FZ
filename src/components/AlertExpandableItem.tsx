import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, TouchableOpacity, Text, Image, Button, Platform, Linking, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { productIcons } from '../assets/images/mapping';
// Components
import CustomButton from './CustomButton';
import EditButton from './EditButton';
import ClickableItem from './Elements/ClickableItem';
import CustomText from './Text/CustomText';
import ViewFloorplan from './ViewFloorplan';
import { getTranslateType, dialCall, formatDateTime } from '../utils/resuableMethods'
import COLOR from '../constants/Theme/color';

const AlertExpandableItem = (props: any) => {


    const [showExpand, setShowExpand] = useState(false);
    const { t } = useTranslation();

    const thing = useSelector((state: RootState) => state.things.things).find(thing => thing.id === props.thing_id);
    const icon = useSelector((state: RootState) => state.icons.icons).find(icon => icon.id === thing?.icon_id);
    const location = useSelector((state: RootState) => state.locations.locations).find(location => location.id === thing?.location_id)

    const alert = useSelector((state: RootState) => state.alerts.allAlerts).find(alert => alert.id === props.alert_id);


    const Row = (props: any) => {
        return (
            <View style={styles().row}>
                <CustomText style={styles().label}>{props.label}</CustomText>
                <CustomText style={styles().content}>{props.content}</CustomText>
            </View>
        );
    };


    return (

        <ClickableItem style={{ ...styles(props.status, props.alert_type).item }} onPress={() => { setShowExpand(!showExpand) }} >

            <View style={styles().itemContainer} >

                <View style={styles().itemImageCol}>
                    {/* {icon && thing && <Image style={styles().itemImage} source={productIcons[thing.icon_id]} />} */}
                    {icon && thing && <Image style={styles().itemImage} source={{ uri: thing.icon_url }} />}

                </View>

                <View style={styles().itemCenterContentCol}>
                    <CustomText style={{ fontWeight: 'bold' }}>{props.thing_name}</CustomText>
                    <CustomText>{thing?.dev_eui}</CustomText>
                    <View>
                        <CustomText>{formatDateTime(props.start_datetime)}</CustomText>

                        {props.end_datetime ?
                            <CustomText>{formatDateTime(props.end_datetime)}</CustomText>
                            :
                            <Text></Text>
                        }

                    </View>


                </View>

                <View style={styles().statusCol}>

                    {props.status == 'Clear' &&
                        <CustomText style={styles(props.alert_type).alertTypeClear}>
                            {getTranslateType(props.alert_type)}
                        </CustomText>
                    }

                    {props.status == 'Set' &&
                        <CustomText style={styles().alertTypeSet}>
                            {getTranslateType(props.alert_type)}
                        </CustomText>
                    }

                    <CustomText style={styles().status}>
                        {props.status === 'Clear' ? t('common:clear') : t('common:set')}
                    </CustomText>
                </View>
            </View>


            {showExpand &&

                <View style={styles().expandableContainer}>

                    <View style={styles().detailsContainer}>
                        <Row label={t('common:model')} content={props.model} />
                        <Row label={t('common:code')} content={props.code} />

                        <Row label={t('form:details')} content={alert?.details ? alert?.details : t('common:null') }/>
                            
                        {alert?.photo_url && 
                        <View style={styles().row}>
                            <View style={styles().photoContainer}>
                                <Image style={styles().photo} source={{uri: alert?.photo_url }} />
                            </View>
                        </View>}
                    </View>

                    {/* {props.alert_type === 'alarm' && props.status === 'Set' &&
                        <View style={styles().buttonContainer}>
                            <CustomButton
                                style={styles().emergencyCallButton}
                                onPress={() => { dialCall('+852999') }}>
                                <Text style={styles().emergencyCallButtonText}>{t('buttons:emergencyCall')}</Text>
                            </CustomButton>
                        </View>
                    } */}

                    <View>
                        <ViewFloorplan
                            id={thing?.id}
                            x_coordinate={thing?.x_coordinate}
                            y_coordinate={thing?.y_coordinate}
                            onOffStatus={thing?.onoff_status}
                            photoUrl={location?.floorplan}
                        />
                    </View>

                    <View style={styles().buttonContainer}>
                        <CustomButton
                        style={{width: 150}}
                            onPress={() => {
                                props.navigation.navigate('ThingDetailsScreen', { id: thing?.id })
                            }}>
                            {t('buttons:viewDevice')}
                        </CustomButton>

                        <EditButton
                            style={{width: 150}}    
                            onPress={() => {
                                props.navigation.navigate('EditAlertScreen', { alert: alert })
                            }}>
                            {t('buttons:editAlert')}
                        </EditButton>

                    </View>

                </View>}

        </ClickableItem>

    )
};


const getColorByAlertType = (alertType: string) => {

    const type = alertType.toLowerCase();

    if (type === 'alarm') {
        return 'red'
    } else if (type === 'drill') {
        return COLOR.drillItemColor
    } else {
        return 'white'
    }

}

const getColorByAlertTypeForText = (alertType: string) => {

    switch (alertType) {
        case 'alarm':
            return 'red'
        case 'drill':
            return COLOR.drillItemColor
        case 'boot':
            return 'black'
        case 'Offline':
            return COLOR.offlineItemTextColor
        case 'offline':
            return COLOR.offlineItemTextColor
        default:
            return 'black'
    }
}

const styles = (props?: any, props2?: any) => StyleSheet.create({
    item: {
        marginVertical: 5,
        marginHorizontal: 12,
        padding: 5,
        backgroundColor: props === 'Set' ? getColorByAlertType(props2) : 'white',
    },
    itemContainer: {
        flexDirection: 'row',
        overflow: 'hidden',
        // backgroundColor: 'purple',
    },
    itemImageCol: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImage: {
        width: '80%',
        height: 90,
        resizeMode: 'contain',
    },
    itemCenterContentCol: {
        width: '60%',
        paddingHorizontal: 5,
        paddingVertical: 10,
        justifyContent: 'center',
    },
    expandableContainer: {
        width: '100%',
        paddingHorizontal: 5,
        // backgroundColor: 'pink'
    },
    detailsContainer: {
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    alertTypeClear: {
        fontWeight: 'bold',
        color: getColorByAlertTypeForText(props)
    },
    alertTypeSet: {
        fontWeight: 'bold',
        color: '#000000',
    },
    statusCol: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    status: {
        fontWeight: 'bold',
    },
    emergencyCallButton: {
        backgroundColor: 'white',
        width: '100%',
        height: 60,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    emergencyCallButtonText: {
        color: 'red',
        //fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 5,
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
});
export default AlertExpandableItem;

