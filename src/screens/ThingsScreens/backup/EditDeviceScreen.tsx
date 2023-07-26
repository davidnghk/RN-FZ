import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, TouchableOpacity, Switch, Platform, ImageBackground, TouchableWithoutFeedback, Dimensions, Keyboard, PermissionsAndroid } from 'react-native';
import { editDeviceNameOnlyAndKeepCoordinate, editDeviceToRemovePhoto, registerDevice, registerDeviceWithoutPhoto } from '../../store/actions/things';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/Text/CustomText';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { RootState } from '../../store/store'
import COLOR from '../../constants/Theme/color';
import Loader from '../../components/Loader';


//@ts-ignore
const EditDeviceScreen = ({ route, navigation }) => {

    // Very important!!!
    const defaultEmptyImageLink = 'https://noze.letsapp.cloud/icon-512.png';

    const thingDetails = route.params;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const isLoading = useSelector((state: RootState) => state.things.isLoading);
    const existingThingsDetails = useSelector((state: RootState) => state.things.things.find(thing => thing.id === thingDetails.id));
    const isPhotoDefaultEmpty = existingThingsDetails?.floorplan_url?.includes('default_empty_image.jpeg');

    const win = Dimensions.get('window');
    const [name, setName] = useState(existingThingsDetails?.name || '');
    const [photo, setPhoto] = useState(null || {});
    const [locationX, setLocationX] = useState(0);
    const [locationY, setLocationY] = useState(0);
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    const [winWidth, setWinWidth] = useState(0);

    const [step, setStep] = useState(1);
    const [isMarkerShow, setIsMarkerShow] = useState(false);
    const [showUploadContainer, setShowUploadContainer] = useState(false);
    const [showRemoveOrUpdateImageContainer, setShowRemoveOrUpdateImageContainer] = useState(false);
    const [showNextButton, setShowNextButton] = useState(true);

    const Label = (props: any) => {
        return (
            <CustomText style={{ ...{ fontWeight: 'bold', width: '35%' }, ...props.style }}>
                {props.children}
            </CustomText>
        )
    };

    useEffect(() => {

        if (Platform.OS === 'ios') {
            return;
        }

        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
            .then(response => {
                // console.log(response)

                if (!response) {
                    PermissionsAndroid.request('android.permission.CAMERA')
                } else {
                    return
                }
            }

            )
    }, [])

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

    const toggleUploadSwitch = () => {
        setShowUploadContainer(showUploadContainer => !showUploadContainer);

        if (showUploadContainer === false) {
            setPhoto({});
        }
    };

    const toggleRemoveSwitch = () => {
        setShowRemoveOrUpdateImageContainer(showRemoveOrUpdateImageContainer => !showRemoveOrUpdateImageContainer);

        if (showRemoveOrUpdateImageContainer === false) {
            setPhoto({});
        }
    };

    // Set the width of the window for calculating Point Sizer
    useEffect(() => {
        setWinWidth(win.width);
    }, [win]);

    function pointSizer(winWidth: number) {
        if (winWidth > 400) {
            return 18;
        } else if (winWidth > 250) {
            return 13;
        } else {
            return 12;
        }
    };

    function step1Handler() {
        if (name.length <= 0) {
            setIsNameEmpty(true);
            return;
        };

        if (showRemoveOrUpdateImageContainer && Object.keys(photo).length == 0) {
            // console.log('Submit to remove floorplan');
            // dispatch(editDeviceToRemovePhoto(thingDetails.id, name, defaultEmptyImageUri))
            dispatch(editDeviceToRemovePhoto(thingDetails.id, name, defaultEmptyImageLink))
            return
        }

        if (Object.keys(photo).length == 0) {
            dispatch(editDeviceNameOnlyAndKeepCoordinate(thingDetails.id, name, thingDetails.xCoordinate, thingDetails.yCoordinate));

            return;
        }

        setStep(2)

    }

    function step2Handler() {

        let uploadImageContainerWidth = win.width * 0.85; // 0.85 <-- define at styles

        const xCoordinate = Math.round(locationX / uploadImageContainerWidth * 1000);
        const yCoordinate = Math.round(locationY / uploadImageContainerWidth * 1000);

        // console.log('New x: ', xCoordinate);
        // console.log('New y: ', yCoordinate);

        // if (xCoordinate == 0 || yCoordinate == 0) {
        //     setShowModal(true);
        //     return
        // }

        dispatch(registerDevice(thingDetails.id, name, photo, xCoordinate, yCoordinate, 'edit'));
    }

    function markerContainerOnPressHandler(event: any) {
        setLocationX(event.nativeEvent.locationX);
        setLocationY(event.nativeEvent.locationY);
        setIsMarkerShow(true);
    };

    //TSX Element
    const PhotoUploadContainer = () => {
        return (
            <View style={styles.photoOptionsContainer}>
                <TouchableOpacity style={styles.uploadPhotoButton} onPress={() => { handleChoosePhoto() }}>

                    <Ionicons name='cloud-upload-outline' color='white' size={30} style={{ width: 26 - 32 }} />
                    <CustomText style={{ textAlign: 'center', color: 'white' }}>{t('form:pressToUploadFloorPlan')}</CustomText>

                </TouchableOpacity>

                <TouchableOpacity style={styles.launchCameraButton} onPress={() => { handleTakePhoto() }}>

                    <Ionicons name='camera-outline' color='white' size={30} style={{ width: 26 - 32 }} />
                    <CustomText style={{ color: 'white', }}>{t('form:takePhoto')}</CustomText>

                </TouchableOpacity>
            </View>
        )
    }

    return (
        <TouchableWithoutFeedback style={styles.screen} onPress={Keyboard.dismiss}>
            <View style={{ flex: 1, alignItems: 'center', }}>

                {step == 1 &&

                    <View style={styles.container}>

                        {isNameEmpty &&
                            <View style={styles.notice}>
                                <Ionicons name='information-circle-outline' color='#D96B6F' size={20} style={{ width: 26 - 32 }} />
                                <CustomText style={{ marginHorizontal: 5, color: '#D96B6F' }}>{t('sentence:nameCannotBeEmpty')}</CustomText>
                            </View>
                        }

                        <View style={styles.row}>
                            <Label>{t('form:deviceId')}</Label>
                            <CustomText>{thingDetails.id}</CustomText>
                        </View>

                        <View style={styles.row}>
                            <Label>{t('form:name')}</Label>
                            <View style={styles.inputContainer}>
                                <View style={styles.textInputContainer}>
                                    <TextInput
                                        placeholder={t('form:nameOfDevice')}
                                        autoCapitalize="none"
                                        value={name}
                                        maxLength={40}
                                        onFocus={() => { setIsNameEmpty(false), setShowNextButton(false) }}
                                        onBlur={() => setShowNextButton(true)}
                                        onEndEditing={() => setShowNextButton(true)}
                                        onChangeText={(text) => { setName(text) }}
                                    />

                                </View>
                            </View>
                        </View>

                        {/* 
                        ********** If this thing HAS NO photo OR HAS "Default Empty Photo" --> Toggle Upload Photo Row ******
                        ********** Upload Floor Plan Toggle Row ********** 
                        */}

                        {(!existingThingsDetails?.floorplan_url || isPhotoDefaultEmpty) &&

                            <>

                                <View style={styles.row}>
                                    <Label>{t('form:uploadFloorplan')}</Label>
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

                                            <PhotoUploadContainer />

                                            :

                                            <Image
                                                source={{ uri: photo.uri }}
                                                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                            />
                                        }
                                    </View>
                                }
                            </>

                        }

                        {/* 
                        ********** If this thing HAS photo --> Toggle Remove Photo **********
                        ********** Remove Floorplan Toggle Row ********** 
                        */}

                        {existingThingsDetails?.floorplan_url !== null && !isPhotoDefaultEmpty &&

                            <>
                                <View style={styles.row}>
                                    <Label>{t('sentence:removeOrUpdateImage')}</Label>
                                    <View style={styles.inputContainer}>
                                        <Switch
                                            trackColor={{ false: "#767577", true: COLOR.primaryColor }}
                                            thumbColor={showRemoveOrUpdateImageContainer ? "white" : "#f4f3f4"}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleRemoveSwitch}
                                            value={showRemoveOrUpdateImageContainer}
                                        />

                                        <CustomText>{showRemoveOrUpdateImageContainer ? t('buttons:yes') : t('buttons:no')}</CustomText>
                                    </View>
                                </View>


                                <View style={{ width: '100%', height: '80%', alignItems: 'center', margin: 0 }}>

                                    {showRemoveOrUpdateImageContainer ?
                                        <View style={styles.uploadImageContainer} >
                                            {Object.keys(photo).length == 0 ?

                                                <PhotoUploadContainer />
                                                :
                                                <Image
                                                    source={{ uri: photo.uri }}
                                                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                                />
                                            }
                                        </View>

                                        :

                                        <View style={styles.uploadImageContainer} >
                                            <Image
                                                source={{ uri: existingThingsDetails?.floorplan_url }}
                                                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                            />
                                        </View>
                                    }
                                </View>
                            </>
                        }

                        {/* ********** Bottom Empty Space ********** */}

                        <View style={{ height: 50 }}></View>

                    </View>
                }



                {step == 2 &&

                    <View style={styles.container}>
                        <View style={styles.row}>
                            <CustomText style={{ fontWeight: 'bold', textAlign: 'center' }}>{t('sentence:tapToAddMarker')}</CustomText>
                        </View>

                        <View style={[styles.addMakerImageContainer]} >
                            <TouchableOpacity onPress={(event) => { markerContainerOnPressHandler(event) }}>
                                <ImageBackground
                                    source={{ uri: photo.uri }}
                                    style={[{ width: '100%', aspectRatio: 1 }]}
                                    resizeMode='contain'
                                >
                                    {isMarkerShow &&
                                        <TouchableWithoutFeedback>
                                            <View style={[
                                                styles.point,
                                                {
                                                    top: locationY - (pointSizer(winWidth) / 2),
                                                    left: locationX - (pointSizer(winWidth) / 2),
                                                    width: pointSizer(winWidth),
                                                    height: pointSizer(winWidth),
                                                }
                                            ]}></View>
                                        </TouchableWithoutFeedback>
                                    }
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                {/* ********** Button Container ********** */}

                <View style={styles.bottomContainer}>

                    {step == 1 && showNextButton &&

                        <View>
                            {isLoading ?
                                <Loader />
                                :
                                <CustomButton onPress={() => { step1Handler() }} > {t('buttons:next')}</CustomButton>
                            }
                        </View>

                    }

                    {step == 2 &&

                        <>
                            <CustomButton style={styles.button} onPress={() => { setStep(1) }}>
                                {t('buttons:back')}
                            </CustomButton>

                            {isLoading ?
                                <Loader />
                                :
                                <CustomButton style={styles.button} onPress={() => { step2Handler() }}>
                                    {t('buttons:save')}
                                </CustomButton>
                            }
                        </>
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
    uploadImageContainer: {
        width: '85%',   // Make sure that when you change this field, also change uploadImageContainerWidth on Step2 Handler
        height: '50%',
        marginTop: 30,
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dotted',
    },
    photoOptionsContainer: {
        width: '100%',
        height: '100%',
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    uploadPhotoButton: {
        width: '90%',
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: COLOR.primaryColor,
    },
    launchCameraButton: {
        width: '90%',
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: COLOR.primaryColor,
    },
    addMakerImageContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dotted',
        overflow: 'hidden',
        borderColor: 'grey',
        marginTop: 20,
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
});

export default EditDeviceScreen;