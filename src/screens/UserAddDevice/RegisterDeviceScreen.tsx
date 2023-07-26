import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, TextInput, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/Text/CustomText';
import Loader from '../../components/Loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLOR from '../../constants/Theme/color';
import { updateDevice } from '../../store/actions/things';
import { RootState } from '../../store/store'
import location from '../../constants/translations/en/location';

//@ts-ignore
const RegisterDeviceScreen = ({ route, navigation }) => {

    const thingId = route.params.thingId;
    // const thingId = parseInt('39');
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    const [selectedPickerValue, setSelectedPickerValue] = useState<null | number>(null);

    const isLoading = useSelector((state: RootState) => state.things.isLoading);
    const locations = useSelector((state: RootState) => state.locations.locations);  // for drop down menu


    const Label = (props: any) => {
        return (
            <CustomText style={{ ...{ fontWeight: 'bold', width: '35%' }, ...props.style }}>
                {props.children}
            </CustomText>
        )
    };

    function nextStepHandler() {

        if (name.length <= 0) {
            setIsNameEmpty(true);
            return;
        };

        if (!selectedPickerValue) {
            dispatch(updateDevice(thingId, name, selectedPickerValue, null, null, 'register'))
            return
        } else {
            const location = locations.find(location => location.id === selectedPickerValue);
            console.log("This is location", location)
            if (location && location.floorplan) {
                navigation.navigate("EditCoordinateScreen", { thingId: thingId, thingName: name, locationId: selectedPickerValue, action: "register" })
            }
            dispatch(updateDevice(thingId, name, selectedPickerValue, null, null, null, null, 'register'))
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
                        <CustomText>{thingId}</CustomText>
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
                                    onFocus={() => { setIsNameEmpty(false) }}
                                    onChangeText={(text) => { setName(text) }}
                                />

                            </View>
                        </View>
                    </View>


                    <View style={[{ ...styles.row }, { justifyContent: 'space-between', alignItems: 'center' }]}>
                        <Label>{t('navigate:locations')}</Label>
                    </View>

                    <View style={[{ ...styles.row }]}>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedPickerValue}
                                onValueChange={(itemValue, itemIndex) => [setSelectedPickerValue(itemValue)]}
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

                    <View style={{ height: 50 }}>

                    </View>

                </View>

                {/* ********** Button Container ********** */}

                <View style={styles.bottomContainer}>
                    {isLoading ?
                        <Loader />
                        :
                        <View>
                            <CustomButton onPress={() => { nextStepHandler() }} > {t('buttons:next')}</CustomButton>
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
    point: {
        borderRadius: 10,
        backgroundColor: 'blue',
        position: 'absolute',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
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

export default RegisterDeviceScreen;