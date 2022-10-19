import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Keyboard, Touchable, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import { forgotPassword } from '../../store/actions/auth';
import { RootState } from '../../store/store';
import Loader from '../../components/Loader';
import { validateEmail } from '../../utils/resuableMethods';

const ForgotPasswordScreen = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [isEmailValid, setEmailValid] = useState(true);
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);

    // Components
    const ErrorRow = (props: any) => {
        return (
            <View style={styles.errorRow}>
                <View style={styles.errorMsgContainer}>
                    {!props.condition ? <Text style={{ color: 'red', fontStyle: 'italic' }}>{props.msg}</Text> : <Text></Text>}
                </View>
            </View>
        )
    }

    const submitHandler = () => {

        if (!validateEmail(email)) {
            setEmailValid(false);
            return
        };

        dispatch(forgotPassword(email));
    }

    const behavior = Platform.OS === 'ios' ? 'position' : undefined;

    return (
        <View style={styles.screen}>
            <TouchableWithoutFeedback style={{ alignItems: 'center', }} onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView style={styles.keyboardAvoidViewStyle} behavior={behavior}>
                    <View style={styles.insideView}>

                        <Text style={{ fontSize: 20 }}>{t('form:forgotPassword')}</Text>

                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={require('../../assets/images/backup/ForgetPassword.jpg')} />
                        </View>

                        <Text style={{ marginVertical: 2 }}>{t('sentence:forgetPasswordP1')}</Text>
                        <Text style={{ marginVertical: 2 }}>{t('sentence:forgetPasswordP2')}</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder={t('form:email')}
                                autoCapitalize="none"
                                value={email}
                                onFocus={() => { setEmailValid(true) }}
                                onChangeText={(text) => { setEmail(text) }}
                            />
                        </View>

                        <ErrorRow condition={isEmailValid} msg={t('sentence:emailIsNotValid')} />

                        <TouchableOpacity style={{ marginVertical: 15 }} onPress={() => { submitHandler() }}>

                            {isLoading ?

                                <TouchableOpacity disabled>
                                    <Loader />
                                </TouchableOpacity>
                                :
                                <CustomButton >{t('buttons:submit')}</CustomButton>
                            }
                        </TouchableOpacity>

                    </View>

                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </View>


    )
}

const styles = StyleSheet.create({

    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    imageContainer: {
        width: 200,
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    inputContainer: {
        width: '65%',
        borderBottomWidth: 1,
        padding: 10,
        marginVertical: 20,
        color: 'white'
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
    keyboardAvoidViewStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent:
            'center',
        width: '100%',
    },
    insideView: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: Platform.OS === 'ios' ? undefined : '100%'
    },
});

export default ForgotPasswordScreen