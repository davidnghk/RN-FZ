import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { login, rememeberCredentials, getCredentials, removeCredentials } from '../../store/actions/auth'
import { RootState } from '../../store/store';
import LoadingScreen from '../LoadingScreen';
import CustomButton from '../../components/CustomButton';
import Card from '../../components/Elements/Card';
import MessagePopUp from '../../components/MessagePopUp';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CheckBox } from 'react-native-elements';
import { getUniqueId } from 'react-native-device-info';
import { closeModal } from '../../store/actions/modal';


const LoginScreen = (props: any) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailIsValid, setEmailIsValid] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [toggleRememberMe, setToggleRememberMe] = useState(false);
    const [deviceId, setDeviceID] = useState('');

    const isLoading = useSelector((state: RootState) => state.auth.isLoading);
    // const isShowModal = useSelector((state: RootState) => state.auth.showModal.visible);
    const isShowModal = useSelector((state: RootState) => state.modal.showModal);
    const showModalMsg = useSelector((state: RootState) => state.modal.messages);

    const tempCredential = useSelector((state: RootState) => state.auth.tempCredentials);

    const loginHandler = (email: string, password: string) => {
        const trimEmail = email.trim();
        const trimPassword = password.trim();

        if (trimEmail.length == 0) {
            setEmailIsValid(false);
            return
        } else {
            setEmailIsValid(true);
        };

        if (trimPassword.length == 0) {
            setPasswordIsValid(false);
            return
        } else {
            setPasswordIsValid(true);
        };

        if (toggleRememberMe == true) {
            dispatch(rememeberCredentials(email, password));
        } else {
            dispatch(removeCredentials());
        }

        dispatch(login(trimEmail, trimPassword, deviceId));

    };

    // Get Device Unique ID
    useEffect(() => {
        let uniqueId = getUniqueId();
        setDeviceID(uniqueId);

    }, [])


    useEffect(() => {
        dispatch(getCredentials());
    }, [])

    useEffect(() => {

        if (tempCredential.email != '') {
            setToggleRememberMe(true);
            setEmail(tempCredential.email);
            setPassword(tempCredential.password);
        }

    }, [tempCredential])


    return (
        <View style={styles.screen}>

            {isLoading ?

                <LoadingScreen />

                :

                <Card style={styles.card}>

                    {isShowModal && showModalMsg === 'Login fail' &&
                        <MessagePopUp
                            visible={isShowModal}
                            title={t('alert:emailOrPasswordNotValid')}
                            buttonText={t('alert:ok')}
                            onPress={() => dispatch(closeModal())}
                            buttonNumber="1"
                        />
                    }


                    <Text style={styles.title}>{t('buttons:login')}</Text>

                    <View style={styles.inputRow}>
                        <Text style={styles.label}>{t('form:email')}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.emailInput}
                                placeholder={t('form:email')}
                                value={email}
                                keyboardType='email-address'
                                autoCapitalize="none"
                                onFocus={() => setEmailIsValid(true)}
                                onChangeText={(text) => { setEmail(text) }}
                            />
                        </View>

                        {!emailIsValid && <Text style={styles.errorMsg}>{t('sentence:pleaseEnterEmail')}</Text>}
                    </View>

                    <View>
                        <Text style={styles.label}>{t('form:password')}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('form:password')}
                                value={password}
                                secureTextEntry={showPassword ? false : true}
                                autoCapitalize='none'
                                onChangeText={(text) => { setPassword(text) }}
                            />
                            <TouchableOpacity onPress={() => { setShowPassword(!showPassword) }}>
                                {showPassword ?
                                    <Ionicons name='eye-off' color='#c5c5c5' size={20} style={{ width: 26 - 32 }} />
                                    :
                                    <Ionicons name='eye' color='#c5c5c5' size={20} style={{ width: 26 - 32 }} />
                                }
                            </TouchableOpacity>
                        </View>

                        {!passwordIsValid && <Text style={styles.errorMsg}>{t('sentence:pleaseEnterPassword')}</Text>}

                    </View>

                    <View style={styles.checkBoxContainer}>
                        <CheckBox size={24}
                            checked={toggleRememberMe}
                            onPress={() => setToggleRememberMe(!toggleRememberMe)}
                            containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, margin: 0, padding: 0 }}
                        />
                        <Text>{t('buttons:rememberMe')}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomButton onPress={() => { loginHandler(email, password) }}>{t('buttons:login')}</CustomButton>
                    </View>

                    <TouchableOpacity style={styles.forgetPassowrdContainer} onPress={() => { props.navigation.navigate('ForgotPasswordScreen') }}>
                        <Text style={styles.forgetPasswordText}>{t('buttons:forgotPassword')}</Text>
                    </TouchableOpacity>
                </Card>
            }
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        // backgroundColor: 'white',
    },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: '80%',
        marginTop: 20,
        padding: 20,
    },
    inputRow: {
        marginVertical: 20,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 5,
        height: 45,
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        width: '90%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        textAlignVertical: 'center',
    },
    emailInput: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        textAlignVertical: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '400'
    },
    errorMsg: {
        marginTop: 10,
        color: 'red',
    },
    loginStatusMsg: {
        marginTop: 20,
        textAlign: 'center',
        color: 'red',
    },
    forgetPassowrdContainer: {
        marginVertical: 10,
    },
    forgetPasswordText: {
        textAlign: 'center',
        color: 'gray',
    },
    checkBoxContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        // backgroundColor: 'pink',
    },
});

export default LoginScreen;