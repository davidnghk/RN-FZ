import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomText from '../../components/Text/CustomText';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLOR from '../../constants/Theme/color';
import { RootState } from '../../store/store'
import { useDispatch, useSelector } from 'react-redux';
import { updateDevice } from '../../store/actions/things';
import { useTranslation } from 'react-i18next';

//@ts-ignore
const EditDeviceScreen = ({ route, navigation }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const thingDetails = route.params;

    const isLoading = useSelector((state: RootState) => state.things.isLoading);
    const existingThingsDetails = useSelector((state: RootState) => state.things.things.find(thing => thing.id === thingDetails.id));
    const locations = useSelector((state: RootState) => state.locations.locations);  // for drop down menu
    const thingCurrentLocation = useSelector((state: RootState) => state.locations.locations).find(location => location.id === thingDetails.locationId);

    const [name, setName] = useState(existingThingsDetails?.name || '');
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    const [selectedPickerValue, setSelectedPickerValue] = useState<null | number>(null);
    const [showSaveAndEditButton, setShowSaveAndEditButton] = useState(false);
 
    const Label = (props: any) => {
        return (
            <CustomText style={{ ...{ fontWeight: 'bold', width: '35%' }, ...props.style }}>
                {props.children}
            </CustomText>
        )
    };

    useEffect(() => {
        if (thingCurrentLocation) {
            setSelectedPickerValue(thingCurrentLocation.id);
        }

    }, [])

    function editThingHandler() {
        if (name.length <= 0) {
            setIsNameEmpty(true);
            return;
        };

        if (!existingThingsDetails) {
            return;
        }

        dispatch(updateDevice(thingDetails.id, name, selectedPickerValue, existingThingsDetails?.x_coordinate, existingThingsDetails?.y_coordinate, 'update'));
    }

    function showSaveAndEditButtonHandler(updateToLocationId: number | null){

        if (!updateToLocationId) {
            setShowSaveAndEditButton(false);
            return
        }

        if (thingCurrentLocation?.id == updateToLocationId){
            setShowSaveAndEditButton(false);
            return
        }

        const updateToLocation = locations.find(location => location.id === updateToLocationId);
    
        if (!updateToLocation?.floorplan) {
            setShowSaveAndEditButton(false);
            return
        } 
        
        if (thingCurrentLocation?.id != updateToLocationId && updateToLocation?.floorplan) {
            setShowSaveAndEditButton(true);
            return
        } 

    }


    return (
        <TouchableWithoutFeedback style={styles.screen} onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, alignItems: 'center', }}>

                <View style={styles.container}>

                    {isNameEmpty &&
                        <View style={styles.notice}>
                            <Ionicons name='information-circle-outline' color='#D96B6F' size={20} style={{ width: 26 - 32 }} />
                            <CustomText style={{ marginHorizontal: 5, color: '#D96B6F' }}>{t('sentence:nameCannotBeEmpty')}</CustomText>
                        </View>
                    }

                    {/* <View style={styles.row}>
                            <Label>{t('form:deviceId')}</Label>
                            <CustomText>{thingDetails.id}</CustomText>
                        </View> */}

                    <View style={styles.row}>
                        <Label>{t('form:name')}</Label>
                        <View style={styles.inputContainer}>
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    placeholder={t('form:nameOfDevice')}
                                    autoCapitalize="none"
                                    value={name}
                                    maxLength={40}
                                    onChangeText={(text) => { setName(text) }}
                                />
                            </View>
                        </View>
                    </View>


                    <View style={[{ ...styles.row }, { justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Label>{t('navigate:locations')}</Label>

                        {thingCurrentLocation?.floorplan && thingCurrentLocation?.id == selectedPickerValue &&
                            <TouchableOpacity onPress={() => navigation.navigate('EditCoordinateScreen', { thingId: thingDetails.id, thingName: name, locationId: thingDetails.locationId, action: "update" })}>
                                <Text style={{ color: 'blue' }}>{t('buttons:editCoordinate')}</Text>
                            </TouchableOpacity>
                        }
                    </View>

                    <View style={[{ ...styles.row }]}>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedPickerValue}
                                onValueChange={(itemValue, itemIndex) => [setSelectedPickerValue(itemValue), showSaveAndEditButtonHandler(itemValue)]}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >

                                <Picker.Item key='' label={`-- ${t('buttons:selectLocation')} --`} value={null} enabled={true} />

                                {locations.map(thingCurrentLocation => {
                                    return (
                                        <Picker.Item label={thingCurrentLocation.name} value={thingCurrentLocation.id} key={thingCurrentLocation.id} />
                                    )
                                })}

                            </Picker>
                        </View>
                    </View>
                </View>

                {/* ********** Button Container ********** */}

                <View style={styles.bottomContainer}>
                    {isLoading ?
                        <Loader />
                        :
                        <View>
                            {showSaveAndEditButton &&
                                <CustomButton onPress={() => { navigation.navigate("EditCoordinateScreen", {thingId: thingDetails.id, thingName: name, locationId: selectedPickerValue, action: 'update'}) }} > {t('buttons:saveAndEditCoord')} </CustomButton>
                            }
                            <CustomButton onPress={() => { editThingHandler() }} > {t('buttons:save')}</CustomButton>
                        </View>
                    }
                </View>

            </View>
        </TouchableWithoutFeedback>
    )
};


const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        backgroundColor: COLOR.bgColor,
        alignItems: 'center',
    },
    container: {
        width: '100%',
        marginTop: 25,
        alignItems: 'center',
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    label: {
        width: '30%'
    },
    inputContainer: {
        width: '65%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    textInputContainer: {
        borderRadius: 8,
        width: '100%',
        height: 40,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 5,
    },
    notice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFDDDE',
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 5,
        width: '90%',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 30,
        flexDirection: 'column',
    },
    button: {
        width: 150,
        marginHorizontal: 10,
    },
    pickerContainer: {
        width: '100%',
        // height: 100, 
        height: Platform.OS === 'ios' ? 120 : 50,
        borderRadius: 5,
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
    },
    pickerItem: {
        height: '100%',
        fontSize: 16,
    }
});

export default EditDeviceScreen;