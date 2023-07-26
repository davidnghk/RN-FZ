import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, Text, Switch, Image } from 'react-native';
import CustomText from '../../components/Text/CustomText';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLOR from '../../constants/Theme/color';
import { RootState } from '../../store/store'
import { useDispatch, useSelector } from 'react-redux';
import { updateLocation } from '../../store/actions/locations';
import { useTranslation } from 'react-i18next';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';


//@ts-ignore
const EditLocationScreen = ({ route, navigation }) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const locationId = route.params.id;

    const isLoading = useSelector((state: RootState) => state.things.isLoading);
    const location = useSelector((state: RootState) => state.locations.locations).find(location => location.id === locationId);

    const [name, setName] = useState(location?.name || '');
    const [code, setCode] = useState(location?.code || '');
    const [photo, setPhoto] = useState(null || {});
    const [isNameEmpty, setIsNameEmpty] = useState(false);
    const [showUploadContainer, setShowUploadContainer] = useState(false);
    const [showNextButton, setShowNextButton] = useState(true);

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
            setPhoto({});
            console.log("Remove phot")
        }
    };

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

    function editLocationHandler() {
        if (name.length <= 0) {
            setIsNameEmpty(true);
            return;
        };

        dispatch(updateLocation(locationId, name, code, photo));
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

                    <View style={styles.row}>
                        <Label>{t('form:code')}</Label>
                        <View style={styles.inputContainer}>
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    placeholder={t('form:code')}
                                    autoCapitalize="none"
                                    value={code}
                                    maxLength={40}
                                    onFocus={() => { setIsNameEmpty(false), setShowNextButton(false) }}
                                    onBlur={() => setShowNextButton(true)}
                                    onEndEditing={() => setShowNextButton(true)}
                                    onChangeText={(text) => { setCode(text) }}
                                />
                            </View>
                        </View>
                    </View>

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

                                :

                                <Image
                                    source={{ uri: photo.uri }}
                                    style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                                />
                            }
                        </View>
                    }

                </View>

                {/* ********** Button Container ********** */}

                {showNextButton && <View style={styles.bottomContainer}>
                    {isLoading ?
                        <Loader />
                        :
                        <View>
                            <CustomButton onPress={() => { editLocationHandler() }} > {t('buttons:save')}</CustomButton>
                        </View>
                    }
                </View>}



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
    uploadImageContainer: {
        width: '85%',       // Make sure that when you change this field, also change uploadImageContainerWidth on Step2 Handler
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
});

export default EditLocationScreen;