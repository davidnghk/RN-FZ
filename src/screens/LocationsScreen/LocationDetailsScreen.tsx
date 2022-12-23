import React, { useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import { fetchLocation } from '../../store/actions/locations'
import Card from '../../components/Elements/Card';
import CustomText from "../../components/Text/CustomText";
import CustomTitle from "../../components/Text/CustomTitle";
import ThingItem from "../../components/ThingItem";
import ClickableItem from "../../components/Elements/ClickableItem";
import ViewMasterFloorplan from "../../components/ViewMasterFloorplan";
import Loader from "../../components/Loader";
import Icon from 'react-native-vector-icons/FontAwesome';
import COLOR from '../../constants/Theme/color';
import { fetchThings } from '../../store/actions/things';



const LocationDetailsScreen = ({ route, navigation }: any,) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { id } = route.params;
    const location = useSelector((state: RootState) => state.locations.location)
    const isLoading = useSelector((state: RootState) => state.locations.isLoading);
    const things = useSelector((state: RootState) => state.things.things);
    const thingsList = things;

    thingsList.sort((a,b) => a.onoff_status.toLowerCase() > b.onoff_status.toLowerCase())



    const onRefresh = () => {
        dispatch(fetchLocation(id));
        dispatch(fetchThings())
    }

    useFocusEffect(
        React.useCallback(() => {
            navigation.setParams({ parent_id: location.parent_id });

        }, [dispatch, location])
    );

    useEffect(() => {
        dispatch(fetchLocation(id));
        dispatch(fetchThings())
    }, []);

    return (

        <ScrollView style={styles.screen}
        refreshControl={
            <RefreshControl
                refreshing={isLoading}
                onRefresh={onRefresh}
            />
        }>

            {isLoading && <Loader />}

            <Card style={styles.card}>

                <TouchableOpacity style={styles.editContainer} onPress={() => navigation.navigate('Locations', { screen: 'EditLocationScreen', params: { id: id } })}>
                    <Icon name='edit' size={20} color='black' />
                </TouchableOpacity>

                <View>
                    <View style={styles.row}>
                        <CustomText style={styles.label}>{t('location:name')}</CustomText>
                        <CustomText style={styles.content}>{location?.name}</CustomText>
                    </View>

                    <View style={styles.row}>
                        <CustomText style={styles.label}>{t('location:code')}</CustomText>
                        <CustomText style={styles.content}>{location?.code}</CustomText>
                    </View>

                    <View style={styles.row}>
                        <CustomText style={styles.label}>{t('location:floorplan')}</CustomText>
                    </View>
                </View>

                { location.floorplan &&
                    <ViewMasterFloorplan
                        key ={`${location.things.id}${Date.now()}`}
                        id={id}
                        things={things}
                        photoUrl={location?.floorplan}
                        navigation={navigation}
                        refreshControl={
                            <RefreshControl
                                //refresh control used for the Pull to Refresh
                                refreshing={isLoading}
                                onRefresh={onRefresh}
                            />
                        }
                    />
                }

            </Card>

            {location.children.length > 0 &&
                <>
                    <View>
                        <CustomTitle style={styles.middleTitle}>{t('location:subLocations')}</CustomTitle>
                    </View>

                    {location.children.map(child => {
                        return (
                            <ClickableItem style={styles.item} key={child.id} onPress={() => {
                                navigation.push('LocationDetailsScreen', { id: child.id })
                            }} >
                                <View>
                                    <CustomText style={styles.title}>{child.name}</CustomText>
                                    <CustomText>{t("location:code")}: {child.code}</CustomText>
                                </View>
                            </ClickableItem>
                        )
                    })}
                </>
            }

            {location.things.length > 0 &&
                <View style={{ padding: 10 }}>
                    <View style={{ marginTop: 10 }}>
                        <CustomTitle style={styles.middleTitle}>{t('navigate:person')}</CustomTitle>
                    </View>

                    <View >
                        {things.map(thing => {

                            return (
                                <ThingItem 
                                    key={`${thing.id}${Date.now()}`}
                                    id={thing.id}
                                    name={thing.name}
                                    thing_code={thing.code}
                                    alertStatus={thing.state}
                                    onOffStatus={thing.onoff_status}
                                    warningFlag={thing.warning_flag}
                                    powerWarning={thing.power_warning}
                                    sensorFault={thing.sensor_fault}
                                    icon_id={thing.icon_id}
                                    icon_url={thing.icon_url}
                                    location_id={thing.location_id}
                                    onPress={() => {
                                        navigation.navigate("Person", {
                                            screen: 'ThingDetailsScreen',
                                            params: { id: thing.id },
                                            initial: false
                                        })
                                    }}
                                    refreshControl={
                                        <RefreshControl
                                            //refresh control used for the Pull to Refresh
                                            refreshing={isLoading}
                                            onRefresh={onRefresh}
                                        />
                                    }
                                />
                                
                            )
                        })}

                    </View>
                </View>
            }

            <View style={{ height: 20 }}></View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLOR.bgColor,
    },
    card: {
        marginHorizontal: 20,
        marginVertical: 20,
        padding: 15,
    },
    middleTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    item: {
        marginHorizontal: 20,
        marginVertical: 5,
        padding: 15,
    },
    title: {
        fontWeight: 'bold',
    },
    editContainer: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 3,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        marginVertical: 2,
    },
    label: {
        fontWeight: 'bold',
        width: '35%',
    },
    content: {
        width: '62%',
    },
})

export default LocationDetailsScreen;