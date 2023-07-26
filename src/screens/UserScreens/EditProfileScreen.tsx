import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image, ImageBackground, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/CustomButton';
import { RootState } from '../../store/store';
import Card from '../../components/Elements/Card';
import CustomText from '../../components/Text/CustomText';
import CustomTitle from '../../components/Text/CustomTitle';
import { TouchableOpacity } from 'react-native';
import { updateProfile, updateProfilePic, updatePassword } from '../../store/actions/user';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import Loader from '../../components/Loader';
import MessagePopUp from '../../components/MessagePopUp';
import { closeModal } from '../../store/actions/modal';


const EditProfileScreen = () => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [photo, setPhoto] = useState(null || {});

    // Check Input State
    const [nameNotEmpty, setNameNotEmpty] = useState(true);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);

    const user = useSelector((state: RootState) => state.user.user);
    const userId = user.id;
    const profileIsSaving = useSelector((state: RootState) => state.user.isLoading);
    const profilePicIsSaving = useSelector((state: RootState) => state.user.profilePicIsLoading);
    const passwordIsLoading = useSelector((state: RootState) => state.user.passwordIsLoading);

    const isUpdatePasswordSuccessShowModal = useSelector((state: RootState) => state.modal.showModal);
    const actionMsg = useSelector((state: RootState) => state.modal.messages);


    const checkEmpty = (input: string) => {
        if (input.trim() === '') {
            return true
        };
    };

    // Set the Profile Info once getting info from state
    useEffect(() => {
        if (!user) {
            return
        }

        setName(user.name!);

        if (user.phone != null) {
            setPhoneNumber(user.phone);
        }

    }, [user])

    const updateProfileHandler = () => {

        if (!userId) {
            return;
        }

        if (checkEmpty(name)) {
            setNameNotEmpty(false);
            return;
        };

        dispatch(updateProfile(userId, name, phoneNumber))

    };

    const updatePasswordHandler = () => {

        if (newPassword != confirmNewPassword) {
            setPasswordMatch(false);
            return
        };

        if (newPassword.length < 6) {
            setPasswordIsValid(false)
            return
        }

        dispatch(updatePassword(newPassword))

    };


    const choosePhotoHandler = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {

            if (response.didCancel) {
                return;
            };

            if (response.assets) {
                setPhoto(response.assets[0]);
            };

        });
    };

    // To dispatch Thunk Action once photo is selected
    useEffect(() => {

        if (Object.keys(photo).length == 0) {
            return;
        }

        dispatch(updateProfilePic(userId!, photo));

    }, [photo])


    // Setting User Profile Image

    const [imageSource, setImageSource] = useState({ uri: user.avatar_url })
    useEffect(() => {

        if (user.avatar_url == null) {
            setImageSource(require('../../assets/images/default_user_avatar.png'))
        } else {
            setImageSource({ uri: user.avatar_url })
        }

    }, [user.avatar_url])


    // Components
    const ErrorRow = (props: any) => {
        return (
            <View style={styles.errorRow}>
                <View style={styles.errorMsgContainer}>
                    {!props.condition ? <CustomText style={{ color: 'red', fontStyle: 'italic' }}>{props.msg}</CustomText> : <Text></Text>}
                </View>
            </View>
        )
    }

    const Label = (props: any) => {
        return (
            <CustomText style={{ ...{ fontWeight: 'bold', fontSize: 16, width: '30%' }, ...props.style }}>{props.children}</CustomText>
        )
    };

    const behavior = Platform.OS === 'ios' ? 'position' : undefined;


    return (
        <View style={{ flex: 1 }}>

            {isUpdatePasswordSuccessShowModal && actionMsg === 'Update password success' &&
                <MessagePopUp
                    visible={isUpdatePasswordSuccessShowModal}
                    title={t('alert:passwordUpdated')}
                    buttonText={t('alert:ok')}
                    onPress={() => { dispatch(closeModal()) }}
                    buttonNumber="1"
                    style={{ zindex: 5 }}
                />
            }

            {isUpdatePasswordSuccessShowModal && actionMsg === 'Update password fail' &&
                <MessagePopUp
                    visible={isUpdatePasswordSuccessShowModal}
                    title={t('alert:passwordFailUpdated')}
                    buttonText={t('alert:ok')}
                    onPress={() => { dispatch(closeModal()) }}
                    buttonNumber="1"
                    style={{ zindex: 5 }}
                />
            }

            <KeyboardAvoidingView behavior={behavior} style={{ flexGrow: 1 }}>
                <ScrollView style={{ flexGrow: 1 }}>
                    <View style={styles.container}>

                        {/* ********** Update Profile Container ********** */}

                        <Card style={styles.card}>

                            <CustomTitle style={styles.title}>{t('form:editProfile')}</CustomTitle>

                            <TouchableOpacity style={styles.imageContainer} onPress={() => { choosePhotoHandler() }}>
                                {/* <Image style={styles.image} source={require('../assets/images/avatar.jpeg')} /> */}

                                {profilePicIsSaving ?
                                    <Loader />
                                    :
                                    <ImageBackground style={styles.image} source={imageSource}>
                                        <CustomText style={styles.profileText}>{t('buttons:update')}</CustomText>
                                    </ImageBackground>


                                }

                            </TouchableOpacity>

                            <View style={styles.row}>
                                <Label>{t('form:name')}</Label>
                                <View style={styles.inputContainer}>
                                    <View style={styles.textInputContainer}>
                                        <TextInput
                                            placeholder={t('form:name')}
                                            autoCapitalize="none"
                                            value={name}
                                            maxLength={40} 
                                            onFocus={() => { setNameNotEmpty(true) }}
                                            onChangeText={(text) => { setName(text) }}
                                        />
                                    </View>
                                </View>
                            </View>

                            <ErrorRow condition={nameNotEmpty} msg={t('sentence:nameCannotBeEmpty')} />

                            <View style={styles.row}>
                                <Label>{t('form:phoneNumber')}</Label>
                                <View style={styles.inputContainer}>
                                    <View style={styles.textInputContainer}>
                                        <TextInput
                                            placeholder={t('form:phoneNumber')}
                                            autoCapitalize="none"
                                            value={phoneNumber}
                                            // onFocus={() => { setNameNotEmpty(true) }}
                                            onChangeText={(text) => { setPhoneNumber(text) }}
                                        />
                                    </View>
                                </View>
                            </View>


                            <View style={styles.buttonContainer}>
                                <CustomButton onPress={() => { updateProfileHandler() }}>

                                    {profileIsSaving ?
                                        <CustomText>{t('buttons:saving')}</CustomText>
                                        :
                                        <CustomText>{t('buttons:update')}</CustomText>
                                    }

                                </CustomButton>
                            </View>

                        </Card>

                        {/* ********** Update Password Container ********** */}

                        <Card style={styles.card}>

                            <CustomTitle style={styles.title}>{t('form:updatePassword')}</CustomTitle>

                            <View style={styles.row}>
                                <Label>{t('form:newPassword')}</Label>
                                <View style={styles.inputContainer}>
                                    <View style={styles.textInputContainer}>
                                        <TextInput
                                            placeholder={t('form:newPassword')}
                                            autoCapitalize="none"
                                            value={newPassword}
                                            onFocus={() => { setPasswordIsValid(true) }}
                                            secureTextEntry={true}
                                            onChangeText={(text) => { setNewPassword(text) }}
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => Keyboard.dismiss()}
                                        />
                                    </View>
                                </View>
                            </View>

                            {!passwordIsValid && <ErrorRow condition={passwordIsValid} msg={t('sentence:password6Chars')} />}


                            <View style={styles.row}>
                                <Label>{t('form:reenterPassword')}</Label>
                                <View style={styles.inputContainer}>
                                    <View style={styles.textInputContainer}>
                                        <TextInput
                                            placeholder={t('form:reenterPassword')}
                                            autoCapitalize="none"
                                            value={confirmNewPassword}
                                            secureTextEntry={true}
                                            onChangeText={(text) => { setConfirmNewPassword(text) }}
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => Keyboard.dismiss()}
                                        />
                                    </View>
                                </View>
                            </View>

                            {!passwordMatch && <ErrorRow condition={passwordMatch} msg={t('sentence:passwordsNotMatch')} />}


                            <View style={styles.buttonContainer}>
                                {passwordIsLoading ?
                                    <Loader />
                                    :
                                    <CustomButton onPress={() => { updatePasswordHandler() }}>{t('buttons:update')}</CustomButton>
                                }

                            </View>
                        </Card>

                    </View>

                </ScrollView >
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        width: '100%',
        marginTop: 25,
        alignItems: 'center',
    },
    profileText: {
        backgroundColor: 'grey',
        opacity: 0.85,
        color: 'white',
        padding: 8,
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold',
    },

    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 100,
        overflow: 'hidden',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: '#f3f3f3',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        // marginBottom: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },

    card: {
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        marginVertical: 20,
    },

    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 15,

    },
    checkedRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 10,
    },
    errorRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 30,
        paddingTop: 0,
        paddingBottom: 0,
    },
    errorMsgContainer: {
        width: '70%',
        justifyContent: 'flex-end',
    },
    label: {
        width: '30%'
    },
    inputContainer: {
        width: '70%',
    },
    textInputContainer: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'grey',
        width: '100%',
        height: 40,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 5,
    },
    buttonContainer: {
        marginVertical: 30,
    },
})

export default EditProfileScreen;