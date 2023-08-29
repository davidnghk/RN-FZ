import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchAmbienceDevices } from '../../store/actions/ambience'
import EmptyDeviceScreen from '../ThingsScreens/EmptyDeviceScreen';
import AmbienceExpandableItem from '../../components/AmbienceExpandableItem';
import COLOR from '../../constants/Theme/color';
import LoadingScreen from '../LoadingScreen';

const AmbienceDeviceListScreen = (props: any) => {

    const dispatch = useDispatch()
    const devices = useSelector((state: RootState) => state.ambience.ambienceDevices);
    const listIsLoading = useSelector((state: RootState) => state.ambience.listIsLoading);
    
    useEffect(() => {
        dispatch(fetchAmbienceDevices());

    }, [])

    const onRefresh = () => {
        dispatch(fetchAmbienceDevices());
    }

    const renderDeviceItem = (itemData: any) => {
        return (
            <AmbienceExpandableItem
                id={itemData.item.id}
                code={itemData.item.code}
                name={itemData.item.name}
                iconId={itemData.item.icon_id}
                icon_url={itemData.item.icon_url}
                readingDatetime={itemData.item.reading_datetime}
                warningFlag={itemData.item.warning_flag}
                powerWarning={itemData.item.power_warning}
                sensorFault={itemData.item.sensor_fault}
                onOffStatus={itemData.item.onoff_status}
            />
        )
    }

    if (listIsLoading && devices.length === 0) {
        return <LoadingScreen />
    } else if (devices.length === 0) {
        return <EmptyDeviceScreen onPress={() => props.navigation.navigate('ScanDeviceScreen')} />
    }

    return (
        <View style={styles.screen}>

            <View style={{ height: 15 }}></View>

            <FlatList
                data={devices}
                keyExtractor={item => item.id.toString()}
                renderItem={renderDeviceItem}
                maxToRenderPerBatch={5}
                initialNumToRender={10}
                updateCellsBatchingPeriod={30}
                refreshControl={
                    <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={listIsLoading}
                        onRefresh={onRefresh}
                    />
                }
            />

        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.bgColor,
    },
    card: {
        width: 330,
        padding: 10,
        marginVertical: 20,
    },
});

export default AmbienceDeviceListScreen;