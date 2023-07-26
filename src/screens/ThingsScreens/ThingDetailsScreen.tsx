import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Image, ScrollView, FlatList, RefreshControl } from 'react-native';
import { RootState } from '../../store/store';
import { fetchThing } from '../../store/actions/things';

// Components
import ThingDetailsCard from '../../components/ThingDetailsCard';
import HistoryItem from '../../components/HistoryItem';
import COLOR from '../../constants/Theme/color';


const ThingDetailsScreen = ({ route, navigation }: any,) => {

    const { id } = route.params;
    const dispatch = useDispatch();
    const alerts = useSelector((state: RootState) => state.alerts.allAlerts).filter(alert => alert.thing_id === id);
    const isLoading = useSelector((state: RootState) => state.things.isLoading);

    const onRefresh = () => {
        dispatch(fetchThing(id));
    }

    // @ts-ignore
    const renderItem = (itemData) => {
        return (
            <HistoryItem
                index={itemData.index}
                start_datetime={itemData.item.start_datetime}
                end_datetime={itemData.item.end_datetime}
                alert_type={itemData.item.alert_type}
                alert_id={itemData.item.id}
                onPress={() => {
                    navigation.navigate('AlertDetailsScreen', { id: itemData.item.id })
                }}
            />
        )
    };

    return (
        <View style={styles.screen}>
            <FlatList
                ListHeaderComponent={<ThingDetailsCard id={id} />}
                data={alerts}
                renderItem={renderItem}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.bgColor,
        flexGrow: 1,
    },

});

export default ThingDetailsScreen;