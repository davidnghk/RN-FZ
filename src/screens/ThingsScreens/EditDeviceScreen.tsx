import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, Image, Switch, Text } from 'react-native';
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

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

    const [photo, setPhoto] = useState( null|| {});
    const [showUploadContainer, setShowUploadContainer] = useState(false);
    const [getphoto, setGetPhoto] = useState(thingDetails.photo_url? thingDetails.photo_url : "")
    const [showGetPhoto, setShowGetPhoto] = useState(thingDetails.photo_url? true : false)
 
    const Label = (props: any) => {
        return (
            <CustomText style={{ ...{ fontWeight: 'bold', width: '35%' }, ...props.style }}>
                {props.children}
            </CustomText>
        )
    };

    const toggleUploadSwitch = () => {
        setShowUploadContainer(showUploadContainer => !showUploadContainer);

        if (showUploadContainer === true) {
            // setPhoto({});
        
        }

        if (showUploadContainer === false) {
            setPhoto({});
        }
    };

    useEffect( () =>{
        console.log("This is showUploadContainer", showUploadContainer)

        if(showUploadContainer === true){
            setShowGetPhoto(false)
        }
        if(showUploadContainer === false && getphoto != "") {
            setShowGetPhoto(true)
        }

    })

    const handleChoosePhoto = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {

            if (response.didCancel) {
                return;
            };

            if (response.assets) {
                setPhoto(response.assets[0]);
            };
        });
    };

    const handleTakePhoto = () => {
        launchCamera({ mediaType: 'photo' }, (response) => {

            if (response.didCancel) {
                return;
            };

            if (response.assets) {
                setPhoto(response.assets[0]);
            };
        });
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

        dispatch(updateDevice(thingDetails.id, name, selectedPickerValue, existingThingsDetails?.x_coordinate, existingThingsDetails?.y_coordinate, showUploadContainer, photo, 'update'));
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

                    <View style={styles.row}>
                        <Label>{t('form:uploadAlertPhoto')}</Label>
                        <View style={styles.inputContainer}>
                            <Switch
                                trackColor={{ false: "#767577", true: COLOR.primaryColor }}
                                thumbColor={showUploadContainer ? "white" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleUploadSwitch}
                                value={showUploadContainer}
                            />

                            <CustomText>{showUploadContainer ? t('buttons:yes') : t('buttons:no')}</CustomText>
                        </View>
                    </View>



                    {showUploadContainer &&

                        <View style={styles.uploadImageContainer} >
                            {Object.keys(photo).length == 0 ?

                                <View style={styles.photoOptionsContainer}>
                                    <TouchableOpacity style={styles.uploadPhotoButton} onPress={() => { handleChoosePhoto() }}>

                                        <Ionicons name='cloud-upload-outline' color='white' size={30} style={{ width: 26 - 32 }} />
                                        <CustomText style={{ textAlign: 'center', color: 'white' }}>{t('form:pressToUploadAlertPhoto')}</CustomText>

                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.launchCameraButton} onPress={() => { handleTakePhoto() }}>

                                        <Ionicons name='camera-outline' color='white' size={30} style={{ width: 26 - 32 }} />
                                        <CustomText style={{ color: 'white', }}>{t('form:takePhoto')}</CustomText>

                                    </TouchableOpacity>
                                </View>

                                :
                                <Image 
                                    style={{flex: 1, height:300, width: '100%', resizeMode: 'contain'}}
                                    source={{ uri: photo.uri }}
                                />
                            }
                        </View>
                    }


                </View>

                {/* ********** Button Container ********** */}

                <View style={styles.bottomContainer}>
                    {isLoading ?
                        <Loader />
                        :
                        <View>
                            {showSaveAndEditButton &&
                                <CustomButton onPress={() => { navigation.navigate("EditCoordinateScreen", {thingId: thingDetails.id, thingName: name, action: 'update'}) }} > {t('buttons:saveAndEditCoord')} </CustomButton>
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
    },
    uploadImageContainer: {
        flexDirection: 'row',
        width: '80%',
        marginTop: 30,
        marginBottom: 10,
        backgroundColor: '#d6d6d6',
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dotted',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',
    },
    photoOptionsContainer: {
        // flexDirection: 'row',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    uploadPhotoButton: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: COLOR.primaryColor,
    },
    launchCameraButton: {
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: COLOR.primaryColor,
    },
    photoContainer: {
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dotted',
    },
});

export default EditDeviceScreen;