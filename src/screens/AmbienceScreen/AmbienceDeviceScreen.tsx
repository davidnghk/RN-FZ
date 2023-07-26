import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/store';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingScreen from '../LoadingScreen';
import CustomText from '../../components/Text/CustomText';
import ClickableItem from '../../components/Elements/ClickableItem';
import { fetchRecord } from '../../store/actions/ambience'
import { formatDateTime, getUnitForAmbienceScreen, getTitleForAmbienceScreen } from '../../utils/resuableMethods';


//@ts-ignore
const AmbienceDeviceScreen = ({ route, navigation }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { deviceId } = route.params;
    const deviceInfo = useSelector((state: RootState) => state.ambience.ambienceDevices.find((device) => device.id === deviceId));
    const isLoading = useSelector((state: RootState) => state.ambience.isLoading);

    useEffect(() => {
        dispatch(fetchRecord(deviceId));
    }, [])

    const AmbienceCard = (props: any) => {
        return (
            <ClickableItem style={styles.card} onPress={() => navigation.navigate('AmbienceDeviceChartScreen', { id: deviceId, title: props.title, data: props.title + 'Data', minMax: props.title + 'MinMax' })}>

                <CustomText>{getTitleForAmbienceScreen(props.title)}</CustomText>

                <View style={styles.iconContainer}>
                    <Ionicons name={props.iconName} color='#407AF7' size={60} />
                </View>

                <CustomText>{props.value} {getUnitForAmbienceScreen(props.title)}</CustomText>

            </ClickableItem>
        )
    }

    if (isLoading) {
        return <LoadingScreen />
    }

    return (
        <View style={styles.screen}>

            <View style={{ height: 20 }}></View>

            <View style={styles.deviceInfoContainer}>
                <CustomText>Name: {deviceInfo?.name} </CustomText>
                <CustomText>Last Reading Time: {formatDateTime(deviceInfo?.reading_datetime)}</CustomText>
            </View>


            <View style={styles.row}>
                <AmbienceCard iconName="thermometer" value={deviceInfo?.temperature} title="temperature" />
                <AmbienceCard iconName="md-water" value={deviceInfo?.humidity} title="humidity" />
            </View>

            <View style={styles.row}>
                <AmbienceCard iconName="md-speedometer-outline" value={deviceInfo?.barometer} title="barometer" />
                <AmbienceCard iconName="md-shield-outline" value={deviceInfo?.gas_resistance} title="gas_resistance" />
            </View>

            <View style={styles.row}>

                <AmbienceCard iconName="ios-battery-charging" value={deviceInfo?.battery} title="battery" />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    deviceInfoContainer: {
        width: '90%',
        // backgroundColor 'pink',
        paddingBottom: 20,
    },
    card: {
        width: '48%',
        height: 165,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        marginVertical: 10,
    }
});

export default AmbienceDeviceScreen