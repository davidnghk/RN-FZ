import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image } from 'react-native';
import { productIcons } from '../assets/images/mapping';
import ClickableItem from './Elements/ClickableItem';
import CustomText from './Text/CustomText';
import { getTranslateType, formatDateTime, fireSensorGetColorFromStatusOrWarning } from '../utils/resuableMethods';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';


interface Thing {
    id: number | null,
    name: string | null,
    thing_code: string | null,
    alertStatus: string,
    onOffStatus: string,
    warningFlag: boolean,
    sensorFault: boolean,
    powerWarning: boolean,
    icon_id: number,
    icon_url: string,
    onPress: any,
    location_id: string | null,
    dev_eui: string | null,
};

const ThingItem = (props: Thing) => {

    const { t } = useTranslation();
    const icon = useSelector((state: RootState) => state.icons.icons.filter(icon => props.icon_id === icon.id)[0]);
    const location = useSelector((state: RootState) => state.locations.locations).find(location => location.id === props.location_id);
    const thingDetails = useSelector((state: RootState) => state.things.things).find(thing => thing.id === props.id)!;

    return (

        <ClickableItem onPress={props.onPress}  style={dynamicStyles(props.alertStatus, props.onOffStatus, props.warningFlag).item}>
            <View style={styles.content}>

                <View style={styles.imageCol}>
                    {/* <Image style={styles.image} source={productIcons[props.icon_id]} /> */}
                    <Image style={styles.image} source={{uri: props.icon_url}} />
                </View>

                <View style={styles.summaryCol}>
                    <CustomText numberOfLines={2} ellipsizeMode='tail' style={{ fontWeight: 'bold' }}>{props.name}</CustomText>
                    <CustomText>{"Dev_eui: " + thingDetails?.dev_eui}</CustomText>
                    <CustomText>{t('common:bp_heart')}: {thingDetails?.bp_heart} </CustomText>
                    <CustomText>{t('common:body_temp')}: {thingDetails?.body_temp + "˚C"} </CustomText>
                    <CustomText>{t('common:bloodpressure')}: {thingDetails?.bp_high + " / " + thingDetails?.bp_low } </CustomText>
                    <CustomText>{ formatDateTime(thingDetails?.updated_at) } </CustomText>
                </View>

            </View>
        </ClickableItem>
    );
};


const dynamicStyles = (alertStatus?: any, onOffStatus?: any, warningFlag?: any) => StyleSheet.create({
    item: {
        backgroundColor: fireSensorGetColorFromStatusOrWarning(alertStatus, onOffStatus, warningFlag),
        marginHorizontal: 12,
        marginVertical: 5,
        padding: 5,
    }

})

const styles = StyleSheet.create({
    item: {
        marginHorizontal: 12,
        marginVertical: 5,
        padding: 5,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    imageCol: {
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '80%',
        height: 100,
        resizeMode: 'contain',
    },
    summaryCol: {
        justifyContent: 'center',
        flexShrink: 1,
    },
    warningIconRow: {
        flexDirection: 'row'
    },
    warningIconContainer: {
        backgroundColor: 'red',
        borderRadius: 2, padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 3,
        width: 25,
        aspectRatio: 1,
    }
});

export default ThingItem;