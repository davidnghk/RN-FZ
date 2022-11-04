import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, Image, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { RootState } from '../store/store';
import { productIcons } from '../assets/images/mapping';
import { useTranslation } from 'react-i18next';
import ViewFloorplan from './ViewFloorplan';
import Card from './Elements/Card';
import CustomText from './Text/CustomText';
import CustomTitle from './Text/CustomTitle';
import { fireSensorGetColorFromStatusOrWarning, getTranslateType, formatDateTime } from '../utils/resuableMethods';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';



const Row = (props: any) => {
    return (
        <View style={styles.row}>

            <CustomText style={styles.label}>{props.label}</CustomText>

            {props.content &&
                <CustomText style={styles.content}>{props.content}</CustomText>
            }

            {props.warning_flag &&
                <View style={styles.warningIconRow}>

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
            }
        </View>
    );
};

const ThingDetailsCard = (props: any) => {

    const { t } = useTranslation();
    const navigation = useNavigation();

    const id = props.id;
    const thingDetails = useSelector((state: RootState) => state.things.things).find(thing => thing.id === id)!;
    const icon = useSelector((state: RootState) => state.icons.icons).find(icon => icon.id === thingDetails?.icon_id);
    const location = useSelector((state: RootState) => state.locations.locations).find(location => location.id === thingDetails?.location_id);

    

    return (

        <ScrollView>
            
            <Card style={dynamicStyles(thingDetails?.state, thingDetails?.onoff_status, thingDetails?.warning_flag).item}>
                <TouchableOpacity style={styles.editContainer} onPress={() => navigation.navigate('Person', { screen: 'EditDeviceScreen', params: { id: id, xCoordinate: thingDetails.x_coordinate, yCoordinate: thingDetails.y_coordinate, locationId: thingDetails.location_id, name: thingDetails.name } })}>
                    <Icon name='edit' size={20} color='black' />
                </TouchableOpacity>

                {!icon &&
                    <View style={styles.headerRow}>
                        <View >
                            <CustomText style={{ color: 'red', fontWeight: 'bold' }}>{t('sentence:deviceHasNotBeenRegistered')}</CustomText>
                        </View>
                    </View>
                }

                <View style={styles.headerRow}>
                    <View style={styles.imageCol}>
                        {/* {icon && <Image style={styles.icon} source={productIcons[thingDetails.icon_id]} />} */}
                        {icon && <Image style={styles.icon} source={{ uri: thingDetails.icon_url }} />}
                    </View>

                    <View style={styles.textCol}>
                        <CustomText style={styles.title}>{thingDetails?.name}</CustomText>
                        {/* <CustomText>{icon?.name}</CustomText> */}
                        <CustomText>{location?.name}</CustomText>
                        <CustomText>{getTranslateType(thingDetails?.onoff_status)}</CustomText>
                        <CustomText>{formatDateTime(thingDetails?.updated_at)}</CustomText>

                    </View>

                </View>

                { thingDetails?.latitude && thingDetails?.longitude && 
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <MapView
                        style={{height:400, width: 300, marginTop: 15}}
                        provider= {PROVIDER_GOOGLE}
                        showsUserLocation
                        zoomControlEnabled={true}
                        zoomEnabled={true}
                        initialRegion={{
                            latitude: parseFloat(thingDetails?.latitude),
                            longitude: parseFloat(thingDetails?.longitude),
                            latitudeDelta: 0.04,
                            longitudeDelta: 0.05,
                        }}
                        // onMapLoaded={() => console.log("Map is ready")}
                    >
                        <Marker 
                            coordinate= {{
                                latitude: parseFloat(thingDetails?.latitude), 
                                longitude: parseFloat(thingDetails?.longitude) 
                            }} 
                            title={"location"}
                            pinColor={"red"}/>
                    </MapView>
                </View> }




                <View style={styles.detailsContainer}>
                    {/* <Row label={t('common:code')} content={thingDetails?.code} /> */}
                    <Row label={t('common:bp_heart')} content={thingDetails?.bp_heart} />
                    <Row label={t('common:bloodpressure')} content={thingDetails?.bp_high + " / " + thingDetails?.bp_low} />
                    <Row label={t('common:body_temp')} content={thingDetails?.body_temp + "°C"}></Row>
                    <Row label={t('common:skin_temp')} content={thingDetails?.skin_temp + "°C"}></Row>


                    {/* <Row label={t('common:location')} content={`Block 01 ( ${thingDetails?.x_coordinate}, ${thingDetails?.y_coordinate} )`} /> */}

                    {location && location.floorplan &&
                        <View>
                            <ViewFloorplan
                                id={id}
                                x_coordinate={thingDetails?.x_coordinate}
                                y_coordinate={thingDetails?.y_coordinate}
                                onOffStatus={thingDetails?.onoff_status}
                                photoUrl={location.floorplan}
                            />
                        </View>
                    }



                </View>
            </Card>
            

            <View>
                <CustomTitle style={styles.history}>{t('common:history')}</CustomTitle>
            </View>

        </ScrollView>

    );
};
const dynamicStyles = (alertStatus?: any, onOffStatus?: any, warningFlag?: any) => StyleSheet.create({
    item: {
        backgroundColor: fireSensorGetColorFromStatusOrWarning(alertStatus, onOffStatus, warningFlag),
        marginHorizontal: 20,
        marginVertical: 20,
        padding: 15,
    }

})
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginVertical: 20,
        padding: 15,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageCol: {
        width: '25%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textCol: {
        width: '70%',
        paddingHorizontal: 5,
        flexShrink: 1,
    },
    editContainer: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 3,
    },
    icon: {
        width: '100%',
        height: 80,
        resizeMode: 'contain',
    },
    title: {
        fontWeight: 'bold',
    },
    detailsContainer: {
        marginTop: 10,
        paddingHorizontal: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        marginVertical: 2,
    },
    label: {
        fontWeight: 'bold',
        width: '60%',
    },
    content: {
        width: '62%',
    },
    history: {
        fontWeight: 'bold',
        textAlign: 'center',
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
    },
    map:{
        flex: 1,
    }
});

export default ThingDetailsCard;