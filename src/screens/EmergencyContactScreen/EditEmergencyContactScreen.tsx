import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CustomText from '../../components/Text/CustomText';
import { RootState } from '../../store/store';
import CustomButton from '../../components/CustomButton';
import { removeEmergencyContact, updateEmergencyContact } from '../../store/actions/user';
import { useEffect } from 'react';
import MessagePopUp from '../../components/MessagePopUp';
import COLOR from '../../constants/Theme/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { validateEmail } from '../../utils/resuableMethods';


//@ts-ignore
const EditEmergencyContactScreen = ({ route, navigation }) => {

    const { t } = useTranslation();
    const { contactId } = route.params;
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [nameIsEmpty, setNameIsEmpty] = useState(false);
    const [phoneIsValid, setPhoneIsValid] = useState(true);
    const [emailIsValid, setEmailIsValid] = useState(true);
    const [twoFieldsAreEmpty, setTwoFieldsAreEmpty] = useState(false);
    const [showNotice, setShowNotice] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const contactInfo = useSelector((state: RootState) => state.user.emergencyContacts.filter(contact => contact.id === contactId)[0]);

    useEffect(() => {
        setName(contactInfo.name);
        setEmail(contactInfo.email);
        setPhone(contactInfo.phone_no);

    }, [])


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

    const checkEmpty = (input: string) => {
        if (input.trim() === '') {
            return true
        };
    };

    const updateContactHandler = () => {

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

        dispatch(updateEmergencyContact(contactId, name, phone, email))
    };

    if (!contactInfo) {
        return (
            <View>

            </View>
        )
    };

    return (
        <View style={styles.screen}>

            <MessagePopUp
                visible={showModal}
                title={t('alert:areYouSureToDelete')}
                buttonText={t('alert:ok')}
                onPress={() => { dispatch(removeEmergencyContact(contactId)) }}
                onPressCancel={() => setShowModal(!showModal)}
                buttonNumber="2"
            />

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

            <View style={styles.row}>
                <Label>{t('form:name')}</Label>
                <View style={styles.inputContainer}>
                    <View style={styles.textInputContainer}>
                        <TextInput
                            placeholder={t('form:name')}
                            autoCapitalize="none"
                            value={name}
                            maxLength={40} 
                            // onFocus={() => { setFirstNameNotEmpty(true) }}
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
                <CustomButton style={{ backgroundColor: 'red', width: 100, marginHorizontal: 10 }} onPress={() => { setShowModal(true); }}>{t('buttons:delete')}</CustomButton>
                <CustomButton style={{ width: 100, marginHorizontal: 10 }} onPress={() => { updateContactHandler() }}>{t('buttons:update')}</CustomButton>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLOR.bgColor,
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

export default EditEmergencyContactScreen;