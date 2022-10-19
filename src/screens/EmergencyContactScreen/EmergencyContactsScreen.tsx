import React, { useState } from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/Text/CustomText';
import CustomTitle from '../../components/Text/CustomTitle';
import MessagePopUp from '../../components/MessagePopUp';
import { getEmergencyContacts, setUserReceiveEmail } from '../../store/actions/user';
import { RootState } from '../../store/store';
import COLOR from '../../constants/Theme/color';
import CustomReminderText from '../../components/Text/CustomReminderText';
import { closeModal } from '../../store/actions/modal';

const EmergencyContactsScreen = (props: any) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const contacts = useSelector((state: RootState) => state.user.emergencyContacts);
    const userEmail = useSelector((state: RootState) => state.user.user.email);
    const userReceiveEmail = useSelector((state: RootState) => state.user.isUserReceiveEmail?.isUserReceiveEmail);
    const userEmailId = useSelector((state: RootState) => state.user.isUserReceiveEmail?.userEmailId);
    const showModalCause = useSelector((state: RootState) => state.modal.cause);
    const actionShowModal = useSelector((state: RootState) => state.modal.showModal);
    const actionMsg = useSelector((state: RootState) => state.modal.messages);
    const [createContactShowModal, setCreateContactShowModal] = useState(false);
    const [isDeleteContactShowModal, setIsDeleteContactShowModal] = useState(false);
    const [isSetUserReceiveEmailShowModal, setIsSetUserReceiveEmailShowModal] = useState(false);

    const [isUserReceiveEmail, setIsUserReceiveEmail] = useState(false);

    useEffect(() => {
        if (actionShowModal && showModalCause === 'Remove Contact') {
            //console.log('Delete Contact Show Modal', actionShowModal);
            setIsDeleteContactShowModal(actionShowModal)
        };


        if (actionShowModal && showModalCause === 'Set user receive email') {
            //console.log('Set user receive email', actionShowModal);
            setIsSetUserReceiveEmailShowModal(actionShowModal)
        };

        if (!actionShowModal && showModalCause == 'Remove Contact') {
            //console.log('Delete Contact Show Modal', actionShowModal);
        };

    }, [actionShowModal])

    useEffect(() => {
        dispatch(getEmergencyContacts());
    }, [])

    useEffect(() => {
        setIsUserReceiveEmail(userReceiveEmail);

    }, [userReceiveEmail])

    const toggleUserReceiveEmail = () => {

        setIsUserReceiveEmail(!isUserReceiveEmail);

        // going to be false
        if (isUserReceiveEmail && userEmailId) {
            dispatch(setUserReceiveEmail(false, userEmailId))
        }

        // going to be true
        if (!isUserReceiveEmail) {
            dispatch(setUserReceiveEmail(true, null))
        }

    }

    const createContactHandler = () => {

        if (contacts.length >= 2) {
            setCreateContactShowModal(true)
            return
        }

        props.navigation.navigate("CreateEmergencyContactScreen", {}, {})
    }

    const ContactItem = (props: any) => {

        const phone = props.phone;
        const email = props.email

        return (
            <TouchableOpacity
                onPress={() => { props.navigation.navigate('EditEmergencyContactScreen', { contactId: props.id }, {}) }}
                style={styles.contactItem}>
                <CustomTitle>{props.name}</CustomTitle>

                {phone.trim() != '' && <CustomText>{phone}</CustomText>}
                {email.trim() != '' && <CustomText>{email}</CustomText>}

            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.screen}>

            {isDeleteContactShowModal && actionMsg === 'The Stakeholderss was deleted' &&
                <MessagePopUp
                    visible={isDeleteContactShowModal}
                    title={t('alert:contactDeleted')}
                    buttonText={t('alert:ok')}
                    onPress={() => { dispatch(closeModal()), setIsDeleteContactShowModal(false), dispatch(getEmergencyContacts()) }}
                    buttonNumber="1"
                />
            }

            {isSetUserReceiveEmailShowModal && actionMsg === 'The Stakeholderss was created' &&
                <MessagePopUp
                    visible={isSetUserReceiveEmailShowModal}
                    title={t('sentence:save')}
                    buttonText={t('alert:ok')}
                    onPress={() => { dispatch(closeModal()), setIsSetUserReceiveEmailShowModal(false), dispatch(getEmergencyContacts()) }}
                    buttonNumber="1"
                />
            }

            {isSetUserReceiveEmailShowModal && actionMsg === 'The Stakeholderss was deleted' &&
                <MessagePopUp
                    visible={isSetUserReceiveEmailShowModal}
                    title={t('sentence:save')}
                    buttonText={t('alert:ok')}
                    onPress={() => { dispatch(closeModal()), setIsSetUserReceiveEmailShowModal(false), dispatch(getEmergencyContacts()) }}
                    buttonNumber="1"
                />
            }

            <MessagePopUp
                visible={createContactShowModal}
                title={t('alert:exceed2Contacts')}
                text={t('alert:pleaseReturn')}
                buttonText={t('alert:ok')}
                onPress={() => setCreateContactShowModal(!createContactShowModal)}
                buttonNumber="1"
            />

            <View style={styles.userItem}>
                <View style={{ paddingVertical: 10 }}>
                    <CustomText>{t('common:defaultEmail')}</CustomText>
                    <CustomText>{userEmail}</CustomText>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Switch
                        trackColor={{ false: "#767577", true: COLOR.primaryColor }}
                        // thumbColor={showUploadContainer ? "white" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleUserReceiveEmail}
                        value={isUserReceiveEmail}
                    />

                    <CustomText style={{ marginLeft: 10, }}>{isUserReceiveEmail ? t('buttons:yes') : t('buttons:no')}</CustomText>
                </View>
            </View>


            {contacts?.length > 0 ?
                <View>
                    {contacts.map(contact => {
                        return (
                            <ContactItem name={contact.name} phone={contact.phone_no} email={contact.email} key={contact.id} id={contact.id} navigation={props.navigation} />
                        )
                    })}
                </View>

                :

                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.8, }}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={require('../../assets/images/screen_main_images/messages.jpg')} />
                    </View>
                    <CustomText style={{ textAlign: "center" }}>
                        {t('sentence:haveNoEmergencyContact')} {'\n'}
                        {t('sentence:pressBelowButtonToAddContact')}
                    </CustomText>

                </View>
            }

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <CustomButton onPress={() => { createContactHandler() }}>{t('buttons:addContact')}</CustomButton>
            </View>

            <View style={styles.bottomContainer}>
                <CustomReminderText >{t('sentence:reminder')}</CustomReminderText>
                <CustomReminderText >{t('sentence:emergenceyContactsReminder1')}</CustomReminderText>
                <CustomReminderText >{t('sentence:emergenceyContactsReminder2')}</CustomReminderText>
                <CustomReminderText >{t('sentence:emergenceyContactsReminder3')}</CustomReminderText>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLOR.bgColor,
    },
    contactItem: {
        padding: 10,
        marginBottom: 2,
        backgroundColor: 'white',
    },
    userItem: {
        padding: 10,
        marginBottom: 2,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
    },
    imageContainer: {
        width: 220,
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        marginVertical: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        marginVertical: 20,
    },
});

export default EmergencyContactsScreen