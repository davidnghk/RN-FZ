import React, { useState } from 'react';
import { View, StyleSheet, Image, } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/core';
import { RootState } from '../../store/store';
import { productIcons } from '../../assets/images/mapping';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { formatDateTime } from '../../utils/resuableMethods';
// Components
import ClickableItem from '../Elements/ClickableItem';
import CustomText from '../Text/CustomText';
import COLOR from '../../constants/Theme/color';
import Loader from '../Loader';
import { fetchRecord } from '../../store/actions/ambience';

const AmbienceExpandableItem = (props: any) => {

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const deviceInfo = useSelector((state: RootState) => state.ambience.ambienceDevices.find((device) => device.id === props.id));
    const iconInfo = useSelector((state: RootState) => state.icons.icons.find(icon => icon.id === props.iconId))
    const isLoading = useSelector((state: RootState) => state.ambience.isLoading.isLoading);
    const isLoadingDevice = useSelector((state: RootState) => state.ambience.isLoading.deviceId)
    const [showExpand, setShowExpand] = useState(false);

    const expandItemHandler = () => {
        setShowExpand(!showExpand)

        if (!showExpand) {
            dispatch(fetchRecord(props.id));
        }
    }

    const getUnit = (target: string) => {

        switch (target) {
            case "temperature":
                return "°C"
            case "battery":
                return "V"
            case "humidity":
                return "%RH"
            case "barometer":
                return "hPa"
            case "gasResistance":
                return "KΩ"
        }
    }

    const getTitle = (title: string) => {

        switch (title) {
            case "temperature":
                return t('common:temperature')
            case "battery":
                return t('common:battery')
            case "humidity":
                return t('common:humidity')
            case "barometer":
                return t('common:barometer')
            case "gasResistance":
                return t('common:gasResistance')
        }
    }

    const AmbienceCard = (props: any) => {

        const id = props.id;
        const title = props.title;
        const data = props.title + 'Data';
        const minMax = props.title + 'MinMax'

        return (
            <ClickableItem
                style={styles.card}
                onPress={() => navigation.navigate('AmbienceDeviceChartScreen', { id: id, title: title, data: data, minMax: minMax })}
            >
                <CustomText>{getTitle(props.title)}</CustomText>

                <View style={styles.iconContainer}>
                    <Ionicons name={props.iconName} color={COLOR.primaryColor} size={48} />
                </View>

                <CustomText>{props.value} {getUnit(props.title)}</CustomText>

            </ClickableItem>
        )
    }

    return (

        <ClickableItem style={styles.itemContainer} onPress={() => { expandItemHandler() }} >

            <View style={styles.item}>

                <View style={styles.leftCol}>
                    <Image style={styles.image} source={productIcons[props.iconId]} />
                </View>

                <View style={styles.rightCol}>
                    <CustomText style={{ fontWeight: 'bold' }}>{iconInfo?.name}</CustomText>
                    <CustomText >{props.code}</CustomText>
                    <CustomText>{formatDateTime(props.readingDatetime)}</CustomText>
                </View>

            </View>

            {showExpand &&
                <>
                    {isLoading && isLoadingDevice === props.id?
                        <Loader />
                        :
                        <View style={{ padding: 20 }}>
                            <View style={styles.row}>
                                <AmbienceCard iconName="thermometer" value={deviceInfo?.temperature} title="temperature" id={props.id} />
                                <AmbienceCard iconName="md-water" value={deviceInfo?.humidity} title="humidity" id={props.id} />
                            </View>

                            <View style={styles.row}>
                                <AmbienceCard iconName="md-speedometer-outline" value={deviceInfo?.barometer} title="barometer" id={props.id} />
                                <AmbienceCard iconName="md-shield-outline" value={deviceInfo?.gas_resistance} title="gasResistance" id={props.id} />
                            </View>

                            <View style={styles.row}>

                                <AmbienceCard iconName="ios-battery-charging" value={deviceInfo?.battery} title="battery" id={props.id} />
                            </View>
                        </View>
                    }

                </>
            }

        </ClickableItem>

    )
};


const styles = StyleSheet.create({
    itemContainer: {
        marginBottom: 15,
        marginHorizontal: 12,
        padding: 5,
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        overflow: 'hidden',
        paddingHorizontal: 10,
        justifyContent: 'space-evenly',
    },
    leftCol: {
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightCol: {
        width: '65%',
        justifyContent: 'center',
        flexShrink: 1,
    },
    image: {
        width: '85%',
        height: 100,
        resizeMode: 'contain',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        width: '46%',
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLOR.primaryColor,
        borderWidth: 1,
        padding: 12,
    },
    iconContainer: {
        marginVertical: 10,
    }

});
export default AmbienceExpandableItem;

