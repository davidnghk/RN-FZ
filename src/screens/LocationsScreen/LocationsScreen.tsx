import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, FlatList, RefreshControl, Image } from 'react-native';
import { RootState } from '../../store/store';
import { fetchLocations } from '../../store/actions/locations'
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import LocationItem from '../../components/LocationItem'
import CustomText from '../../components/Text/CustomText';
import COLOR from '../../constants/Theme/color';

const LocationsScreen = (props: any) => {

    const locations = useSelector((state: RootState) => state.locations.locations).filter(location => location.parent_id == null);
    const isLoading = useSelector((state: RootState) => state.locations.isLoading);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(fetchLocations());
    }, []);

    const onRefresh = () => {
        //Call the Service to get the latest data
        dispatch(fetchLocations());

    };

    const renderLocationsItem = (itemData: any) => {
        return (
            <LocationItem
                name={itemData.item.name}
                location_id={itemData.item.id}
                code={itemData.item.code}
                onPress={() => {
                    navigation.navigate('LocationDetailsScreen', {
                        id: itemData.item.id
                    })
                }}
            />
        )
    }

    if (locations.length <= 0) {
        return (
            <View style={styles.emptyScreen}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={require('../../assets/images/screen_main_images/blueprint.jpeg')} />
                </View>

                <CustomText style={{ textAlign: "center" }}>
                    {t('sentence:youDontHvaeLocationsYet')}
                </CustomText>
            </View>
        )
    }

    return (
        <View style={styles.screen}>

            <View style={{ height: 10 }}></View>

            <FlatList
                data={locations}
                keyExtractor={item => item.id.toString()}
                renderItem={renderLocationsItem}
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
    emptyScreen: {
        flex: 1,
        backgroundColor: COLOR.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
    }
});

export default LocationsScreen;