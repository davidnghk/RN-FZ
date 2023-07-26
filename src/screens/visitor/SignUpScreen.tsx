import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TextInput, Keyboard, ScrollView, Linking } from 'react-native';
import { signUp } from '../../store/actions/auth';
import { CheckBox } from 'react-native-elements'
import { RootState } from '../../store/store';
import CustomButton from '../../components/CustomButton';
import { useTranslation } from 'react-i18next';
import MessagePopUp from '../../components/MessagePopUp';
import Loader from '../../components/Loader';
import { closeModal } from '../../store/actions/modal';

const SignUpScreen = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isLoading = useSelector((state: RootState) => state.auth.isLoading);
    const isShowModal = useSelector((state: RootState) => state.modal.showModal);
    const errMsg = useSelector((state: RootState) => state.modal.messages);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [checked, setChecked] = useState(false);

    const [nameNotEmpty, setNameNotEmpty] = useState(true);
    const [emailNotEmpty, setEmailNotEmpty] = useState(true);
    const [passwordNotEmpty, setPasswordNotEmpty] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);
    const [confirmPasswordNotEmpty, setConfirmPasswordNotEmpty] = useState(true);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [termsChecked, setTermsChecked] = useState(true);

    const Label = (props: any) => {
        return (
            <Text style={{ ...{ fontWeight: 'bold', fontSize: 16, width: '30%' }, ...props.style }}>{props.children}</Text>
        )
    };

    const ErrorRow = (props: any) => {
        return (
            <View style={styles.errorRow}>
                <View style={styles.errorMsgContainer}>
                    {!props.condition ? <Text style={{ color: 'red', fontStyle: 'italic' }}>{props.msg}</Text> : <Text></Text>}
                </View>
            </View>
        )
    }

    const checkEmpty = (input: string) => {
        if (input.trim() === '') {
            return true
        };
    };

    function verifyInput(name: string, email: string, password: string, confirmPassword: string, checked: boolean) {
        let approved = true;

        if (checkEmpty(name)) {
            setNameNotEmpty(false);
            approved = false;
        };

        if (checkEmpty(email)) {
            setEmailNotEmpty(false);
            approved = false;
        };

        if (checkEmpty(password)) {
            setPasswordNotEmpty(false);
            approved = false;
        };

        if (checkEmpty(confirmPassword)) {
            setConfirmPasswordNotEmpty(false);
            approved = false;
        };

        if (password.length < 6) {
            setPasswordIsValid(false);
            approved = false;
        };

        if (password !== confirmPassword) {
            setPasswordMatch(false);
            approved = false;
        };

        if (!checked) {
            setTermsChecked(false);
            approved = false;
        };

        return approved
    };

    function signUpHandler(name: string, email: string, password: string, confirmPassword: string, checked: boolean) {

        setPasswordMatch(true);
        setPasswordIsValid(true);
        setTermsChecked(true);

        const verify = verifyInput(name, email, password, confirmPassword, checked);

        if (!verify) {
            return
        };

        dispatch(signUp(name, email, password, checked));

    };

    function translate(text: string) {
        switch (text) {

            case 'Email is invalid':
                return t('alert:emailInvalid')
            case 'Password is invalid':
                return t('alert:passwordIsValid')
            case 'Email has already been taken':
                return t('alert:emailTaken')
            default:
                return t('alert:inputInvalid')
        }
    }

    return (

        <ScrollView contentContainerStyle={styles.screen}>
            <View style={styles.container}>

                {isLoading && <Loader />}

                <MessagePopUp
                    visible={isShowModal}
                    title={translate(errMsg)}
                    // title={errMsg}
                    buttonText={t('alert:return')}
                    onPress={() => { dispatch(closeModal()) }}
                    buttonNumber="1"
                />

                <View style={styles.row}>
                    <Label>{t('form:name')}</Label>
                    <View style={styles.inputContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                placeholder={t('form:name')}
                                autoCapitalize="none"
                                value={name}
                                onFocus={() => { setNameNotEmpty(true) }}
                                onChangeText={(text) => { setName(text) }}
                            />
                        </View>
                    </View>
                </View>

                <ErrorRow condition={nameNotEmpty} msg={t('sentence:nameCannotBeEmpty')} />


                <View style={styles.row}>
                    <Label>{t('form:email')}</Label>
                    <View style={styles.inputContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput

                                placeholder={t('form:email')}
                                keyboardType='email-address'
                                autoCapitalize="none"
                                value={email}
                                onFocus={() => { setEmailNotEmpty(true) }}
                                onChangeText={(text) => { setEmail(text) }}
                            />
                        </View>
                    </View>
                </View>

                <ErrorRow condition={emailNotEmpty} msg={t('sentence:emailCannotBeEmpty')} />

                <View style={styles.row}>
                    <Label>{t('form:password')}</Label>
                    <View style={styles.inputContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                placeholder={t('form:password')}
                                autoCapitalize="none"
                                secureTextEntry={true}
                                value={password}
                                onFocus={() => { setPasswordNotEmpty(true) }}
                                onChangeText={(text) => { setPassword(text) }}
                                blurOnSubmit={false}
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        </View>
                    </View>
                </View>

                <ErrorRow condition={passwordNotEmpty} msg={t('sentence:passwordCannotBeEmpty')} />
                {!passwordIsValid && <ErrorRow condition={passwordIsValid} msg={t('sentence:password6Chars')} />}

                <View style={styles.row}>
                    <Label>{t('form:reenterPassword')}</Label>
                    <View style={styles.inputContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                placeholder={t('form:reenterPassword')}
                                autoCapitalize="none"
                                secureTextEntry={true}
                                value={confirmPassword}
                                onFocus={() => { setConfirmPasswordNotEmpty(true) }}
                                onChangeText={(text) => { setConfirmPassword(text) }}
                                blurOnSubmit={false}
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                        </View>
                    </View>
                </View>

                <ErrorRow condition={confirmPasswordNotEmpty} msg={t('sentence:passwordCannotBeEmpty')} />
                {!passwordMatch && <ErrorRow condition={passwordMatch} msg={t('sentence:passwordsNotMatch')} />}

                <View style={styles.checkedRow}>
                    <CheckBox size={24}
                        checked={checked}
                        // title="I accept the terms of service & privacy policy."
                        onPress={() => setChecked(!checked)}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, margin: 0, padding: 5 }}
                    />
                    <Text style={{ width: '80%' }}>{t('sentence:iaccept')}{' '}
                        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://fcw-demo.letsapp.cloud/terms?locale=en')}>
                            {t('sentence:terms')}
                        </Text>
                        <Text>{t('sentence:and')}</Text>
                        <Text style={{ color: 'blue' }} onPress={() => Linking.openURL('https://fcw-demo.letsapp.cloud/privacy?locale=en')}>
                            {t('sentence:privacyPolicy')}
                        </Text>
                    </Text>
                </View>
                {!termsChecked && <Text style={{ color: 'red', fontStyle: 'italic' }}>{t('sentence:termsMustBeAccepted')}</Text>}

                <View style={styles.buttonContainer}>
                    <CustomButton onPress={() => { signUpHandler(name, email, password, confirmPassword, checked) }}>{t('buttons:signup')}</CustomButton>
                </View>



            </View>

   
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    container: {
        width: '100%',
        marginTop: 25,
        alignItems: 'center',
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 20,
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
        width: '100%',
        height: 40,
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingLeft: 5,
    },
    buttonContainer: {
        marginVertical: 10,
    },
});

export default SignUpScreen;