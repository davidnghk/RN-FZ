import React, { useState } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { RootState } from '../store/store';
import { productIcons } from '../assets/images/mapping';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchAmbienceDevice, fetchRecord } from '../store/actions/ambience';
import { getColorFromStatusOrWarning, formatDateTime, getTitleForAmbienceScreen, getUnitForAmbienceScreen, getTranslateType } from '../utils/resuableMethods';
// Components
import ClickableItem from './Elements/ClickableItem';
import CustomText from './Text/CustomText';
import Loader from './Loader';
import COLOR from '../constants/Theme/color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { AmbienceConfig } from '../config/ambienceConfig';

const AmbienceExpandableItem = (props: any) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const deviceInfo = useSelector((state: RootState) => state.ambience.ambienceDevices.find((device) => device.id === props.id));
    // const iconInfo = useSelector((state: RootState) => state.icons.icons.find(icon => icon.id === props.iconId))
    const isLoading = useSelector((state: RootState) => state.ambience.isLoading.isLoading);
    const isLoadingDevice = useSelector((state: RootState) => state.ambience.isLoading.deviceId)
    const [showExpand, setShowExpand] = useState(false);

    const expandItemHandler = () => {
        setShowExpand(!showExpand)

        if (!showExpand) {
            dispatch(fetchAmbienceDevice(props.id));
            dispatch(fetchRecord(props.id));
        }
    }

    const iconMapping = {
        "temperature": 'thermometer',
        "humidity": 'md-water',
        "barometer": 'md-speedometer-outline',
        "gas_resistance": 'md-shield-outline',
        "battery": 'ios-battery-charging',
        "co2": 'ios-stats-chart-sharp',
        "hcho": 'ios-stats-chart-sharp',
        "light_level": 'bulb-outline',
        "pir": 'ios-stats-chart-sharp',
        "pm10": 'ios-stats-chart-sharp',
        "pm2_5": 'ios-stats-chart-sharp',
        "tvoc": 'ios-stats-chart-sharp',
    }

    const ExpandedCardDetails = (data: any) => {

        const processedData = processData(data);

        return (
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <FlatList
                    style={{ width: '100%' }}
                    data={processedData}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderAmbienceCardItem}
                    maxToRenderPerBatch={5}
                    initialNumToRender={10}
                    updateCellsBatchingPeriod={30}
                    horizontal={false}
                    numColumns={2}
                />
            </View>
        )
    }

    const renderAmbienceCardItem = (itemData: any) => {
        return (
            <AmbienceCard iconName={iconMapping[itemData.item.title]} value={itemData.item.value} title={itemData.item.title} id={itemData.item.deviceId} />
        )
    }

    const AmbienceCard = (props: any) => {

        const id = props.id;
        const title = props.title;
        // const data = props.title + 'Data';
        // const minMax = props.title + 'MinMax'

        return (
            <View style={styles.cardContainer}>
                <ClickableItem
                    style={styles.card}
                    onPress={() => navigation.navigate('AmbienceDeviceChartScreen', { id: id, title: title })}
                >
                    <CustomText>{getTitleForAmbienceScreen(props.title)}</CustomText>

                    <View style={styles.iconContainer}>
                        <Ionicons name={props.iconName} color={COLOR.primaryColor} size={48} />
                    </View>

                    <CustomText>{props.value} {getUnitForAmbienceScreen(props.title)}</CustomText>
                </ClickableItem>
            </View>

        )
    }

    return (

        <ClickableItem style={dynamicStyles(props.onOffStatus, props.warningFlag).item} onPress={() => { expandItemHandler() }} >

            <View style={styles.item}>

                <View style={styles.leftCol}>
                    {/* <Image style={styles.image} source={productIcons[props.iconId]} /> */}
                    <Image style={styles.image} source={{uri: props?.icon_url}} />
                </View>

                <View style={styles.rightCol}>
                    <CustomText style={{ fontWeight: 'bold' }}>{props?.name}</CustomText>
                    <CustomText >{props.code}</CustomText>
                    <CustomText>{t('common:status')}: {getTranslateType(props.onOffStatus)}</CustomText>
                    <View style={styles.warningIconRow}>

                        <CustomText >
                            {t('common:warning')}: {props.warningFlag == false ? 0 : ''}
                        </CustomText>

                        {props.sensorFault &&
                            <View style={styles.warningIconContainer}>
                                <Ionicons name='alert-circle' color='white' size={18} style={{ width: 26 - 32 }} />
                            </View>}

                        {props.powerWarning &&
                            <View style={styles.warningIconContainer}>
                                {/* <Ionicons name='ios-power' color='white' size={18} style={{ width: 26 - 32 }} /> */}
                                {/* <Ionicons name='alert-circle' color='white' size={18} style={{ width: 26 - 32 }} /> */}
                                <MaterialIcons name='battery-alert' color='white' size={18} style={{ width: 26 - 32 }} />
                            </View>
                        }

                    </View>

                </View>

            </View>

            {showExpand &&
                <>

                    {isLoading && isLoadingDevice === props.id ?
                        <Loader />
                        :
                        <View >
                            <View style={{ paddingHorizontal: 8, paddingTop: 8 }}>
                                <CustomText>{t('common:readingTime')}: {formatDateTime(deviceInfo?.reading_datetime)}</CustomText>
                            </View>
                            <ExpandedCardDetails data={deviceInfo} id={deviceInfo?.id} />
                        </View>
                    }
                </>
            }

        </ClickableItem>

    )
};


const processData = (deviceInfo: any) => {

    let data = [];

    for (let i = 0; i < AmbienceConfig.ambienceParamList.length; i++) {

        if (deviceInfo.data[AmbienceConfig.ambienceParamList[i]] == null) {
            continue
        }

        data.push({
            id: i + 1, title: AmbienceConfig.ambienceParamList[i],
            value: deviceInfo.data[AmbienceConfig.ambienceParamList[i]],
            deviceId: deviceInfo.data.id
        })

    }

    return data
}



const dynamicStyles = (props1?: any, props2?: any) => StyleSheet.create({
    item: {
        backgroundColor: getColorFromStatusOrWarning(props1, props2),
        marginHorizontal: 12,
        marginVertical: 5,
        padding: 5,
    }

})

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
    cardContainer: {
        flex: 1 / 2,
    },
    card: {
        borderColor: COLOR.primaryColor,
        borderWidth: 1,
        padding: 12,
        marginHorizontal: 8,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginVertical: 10,
    },
    warningIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'yellow'
    },
    warningIconContainer: {
        backgroundColor: 'red',
        borderRadius: 2,
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 3,
        width: 25,
        aspectRatio: 1,
    }

});
export default AmbienceExpandableItem;

