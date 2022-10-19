import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/Text/CustomText';
import { createEmergencyContact } from '../../store/actions/user';
import COLOR from '../../constants/Theme/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { validateEmail } from '../../utils/resuableMethods';

//@ts-ignore    
const CreateEmergencyContactScreen = ({ route, navigation }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [nameIsEmpty, setNameIsEmpty] = useState(false);
    const [phoneIsValid, setPhoneIsValid] = useState(true);
    const [emailIsValid, setEmailIsValid] = useState(true);
    const [twoFieldsAreEmpty, setTwoFieldsAreEmpty] = useState(false);
    const [showNotice, setShowNotice] = useState(false);

    const checkEmpty = (input: string) => {
        if (input.trim() === '') {
            return true
        };
    };


    const createContactHandler = () => {

        if (checkEmpty(name)) {
            setNameIsEmpty(true);
            setShowNotice(true);
            return
        }

        if (checkEmpty(phone) && checkEmpty(email)) {
            setTwoFieldsAreEmpty(true);
            setShowNotice(true);
            return
        }

        if (!checkEmpty(phone)) {
            let isnum = /^\d+$/.test(phone);
            let phoneLength = phone.length;

            if (!isnum || phoneLength != 8) {
                setShowNotice(true);
                setPhoneIsValid(false);
                return
            } else {
                setPhoneIsValid(true);
            }
        }

        if (!checkEmpty(email)) {
            if (!validateEmail(email)) {
                setShowNotice(true);
                setEmailIsValid(false);
                return
            } else {
                setEmailIsValid(true);
            }
        }

        dispatch(createEmergencyContact(name, phone, email))
    }


    const Label = (props: any) => {
        return (
            <CustomText style={{ ...{ fontWeight: 'bold', fontSize: 16, width: '30%' }, ...props.style }}>{props.children}</CustomText>
        )
    };

    return (
        <View style={styles.screen}>

            {showNotice &&
                <View style={styles.noticeContainer}>

                    {nameIsEmpty &&
                        <View style={styles.noticeItem}>
                            <Ionicons name='information-circle-outline' color='#D96B6F' size={20} style={{ width: 26 - 32 }} />
                            <CustomText style={{ marginHorizontal: 5, color: '#D96B6F' }}>{t('sentence:nameCannotBeEmpty')}</CustomText>
                        </View>
                    }

                    {!phoneIsValid &&
                        <View style={styles.noticeItem}>
                            <Ionicons name='information-circle-outline' color='#D96B6F' size={20} style={{ width: 26 - 32 }} />
                            <CustomText style={{ marginHorizontal: 5, color: '#D96B6F' }}>{t('sentence:phoneIsNotValid')}</CustomText>
                        </View>
                    }

                    {!emailIsValid &&
                        <View style={styles.noticeItem}>
                            <Ionicons name='information-circle-outline' color='#D96B6F' size={20} style={{ width: 26 - 32 }} />
                            <CustomText style={{ marginHorizontal: 5, color: '#D96B6F' }}>{t('sentence:emailIsNotValid')}</CustomText>
                        </View>
                    }

                    {twoFieldsAreEmpty &&
                        <View style={styles.noticeItem}>
                            <Ionicons name='information-circle-outline' color='#D96B6F' size={20} style={{ width: 26 - 32 }} />
                            <CustomText style={{ marginHorizontal: 5, color: '#D96B6F' }}>{t('sentence:eitherOneNeedToBeFilled')}</CustomText>
                        </View>
                    }
                </View>
            }



            <View>
                <View style={styles.row}>
                    <Label>{t('form:name')}</Label>
                    <View style={styles.inputContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                placeholder={t('form:name')}
                                autoCapitalize="none"
                                value={name}
                                maxLength={40} 
                                onFocus={() => { setNameIsEmpty(false) }}
                                onChangeText={(text) => { setName(text) }}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.row}>
                    <Label>{t('form:phoneNumber')}</Label>
                    <View style={styles.inputContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                placeholder={t('form:phoneNumber')}
                                autoCapitalize="none"
                                value={phone}
                                onFocus={() => { setPhoneIsValid(true), setTwoFieldsAreEmpty(false) }}
                                onChangeText={(text) => { setPhone(text) }}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.row}>
                    <Label>{t('form:email')}</Label>
                    <View style={styles.inputContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                placeholder={t('form:email')}
                                autoCapitalize="none"
                                value={email}
                                onFocus={() => { setEmailIsValid(true), setTwoFieldsAreEmpty(false) }}
                                onChangeText={(text) => { setEmail(text) }}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <CustomButton onPress={() => { createContactHandler() }}>{t('buttons:save')}</CustomButton>
                </View>

            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLOR.bgColor,
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
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    noticeContainer: {
        // flexDirection: 'row',
        // alignItems: 'center',
        // backgroundColor: '#FFDDDE',
        // borderRadius: 8,
        // paddingHorizontal: 20,
        // paddingVertical: 5,
        width: '90%',
        marginTop: 10,
    },
    noticeItem: {
        alignItems: 'center',
        backgroundColor: '#FFDDDE',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 5,
        width: '100%',
        flexDirection: 'row',
    },
});


export default CreateEmergencyContactScreen;