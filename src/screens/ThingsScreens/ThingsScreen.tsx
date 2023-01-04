import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { RootState } from '../../store/store';
import { fetchThings } from '../../store/actions/things';
import { useNavigation } from '@react-navigation/native';
import ThingItem from '../../components/ThingItem';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton';
import EmptyDeviceScreen from './EmptyDeviceScreen';
import COLOR from '../../constants/Theme/color';
import Loader from '../../components/Loader';


const ThingsScreen = (props: any) => {

    const things = useSelector((state: RootState) => state.things.things);
    const isLoading = useSelector((state: RootState) => state.things.isLoading);
    const account = useSelector((state: RootState) => state.account.account)
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const vancancy = account.vancancy
    let quota = account.quota
    
    if (quota === null) {
        quota = 0;
    }



    useEffect(() => {
        dispatch(fetchThings());
    }, []);

    const onRefresh = () => {
        //Call the Service to get the latest data
        dispatch(fetchThings());

    };

    // @ts-ignore
    const renderThingsItem = (itemData) => {
        return (
            <ThingItem
                id={itemData.item.id}
                name={itemData.item.name}
                thing_code={itemData.item.code}
                alertStatus={itemData.item.state}
                onOffStatus={itemData.item.onoff_status}
                warningFlag={itemData.item.warning_flag}
                powerWarning={itemData.item.power_warning}
                sensorFault={itemData.item.sensor_fault}
                icon_id={itemData.item.icon_id}
                icon_url={itemData.item.icon_url}
                location_id={itemData.item.location_id}
                dev_eui={itemData.item.dev_eui}
                onPress={() => {
                    navigation.navigate('ThingDetailsScreen', {
                        id: itemData.item.id
                    })
                }}
            />
        )
    }

    if (things.length === 0) {
        return (
            <EmptyDeviceScreen onPress={() => props.navigation.navigate('ScanDeviceScreen')} />
        )
    }

    return (
        <View style={styles.screen}>

            
            {vancancy > 0 && quota >=0 && 
            <View style={styles.buttonContainer} pointerEvents={vancancy > 0 ? "auto" : "none"}>
            <CustomButton 
                style={vancancy > 0? styles.buttonNormal: styles.buttonGrey}
            
                onPress={() => { props.navigation.navigate('ScanDeviceScreen') }}
                >{t('buttons:scanDevice') + " ( " + vancancy + " / " + quota + " ) "}</CustomButton>
            </View>}        



            <FlatList
                data={things.sort((a,b) => {
                    return a.onoff_status.toLowerCase() > b.onoff_status.toLowerCase()
                }
                )}
                keyExtractor={item => item.id.toString()}
                renderItem={renderThingsItem}
                maxToRenderPerBatch={5}
                initialNumToRender={10}
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
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLOR.bgColor,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonGrey: {
        backgroundColor: "#AAAAAA"
    },
    buttonNormal: {
        backgroundColor: COLOR.primaryColor,
    },
});

export default ThingsScreen;