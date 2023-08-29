import React, { useState } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
// Components
import CustomButton from '../../components/CustomButton';
import MessagePopUp from '../../components/MessagePopUp';
import CustomText from '../../components/Text/CustomText';
import CustomTitle from '../../components/Text/CustomTitle';
import COLOR from '../../constants/Theme/color';
import { closeModal } from '../../store/actions/modal';
import Loader from '../../components/Loader';
import { getAccountInfo } from '../../store/actions/account';

const AccountMemberListScreen = (props: any) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const accountId = useSelector((state: RootState) => state.user.user.default_account_id);
    const accountMembers = useSelector((state: RootState) => state.account.account.users);
    const isLoading = useSelector((state: RootState) => state.account.isLoading);
    const [showRemoveButton, setShowRemoveButton] = useState(false);
    const dispatchPopUp = useSelector((state: RootState) => state.modal.showModal);
    const dispatchMsg = useSelector((state: RootState) => state.modal.messages);
    const [isDispatchShowModal, setIsDispatchShowModal] = useState(false);

    useEffect(() => {
        if (dispatchPopUp) {
            // console.log('Dispatch Pop Up', dispatchPopUp);
            setIsDispatchShowModal(dispatchPopUp)
        };

        if (!dispatchPopUp) {
            // console.log('Dispatch Pop Up', dispatchPopUp);
            // dispatch(closeModal());
        };

    }, [dispatchPopUp])


    const inviteMemberHandler = () => {
        props.navigation.navigate('InviteAccountMemberScreen', {}, {});
    };

    const ContactItem = (props: any) => {
        return (
            <TouchableOpacity
                // onPress={() => { props.navigation.navigate('EditEmergencyContactScreen', { contactId: props.id }, {}) }}
                style={styles.contactItem}>

                <View style={styles.contactItemContainer}>

                    <View>
                        <CustomTitle>{props.name}</CustomTitle>
                        <CustomText>{props.email}</CustomText>
                    </View>

                    {showRemoveButton &&
                        <TouchableOpacity style={styles.removeButton}>
                            <CustomText>{t('buttons:remove')}</CustomText>
                        </TouchableOpacity>
                    }

                </View>
            </TouchableOpacity>
        )
    }


    const onRefresh = () => {
        if (!accountId) {
            return
        }

        dispatch(getAccountInfo(accountId));
    }


    return (
        <ScrollView style={styles.screen}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={onRefresh}
                />
            }>

            {isLoading && <Loader />}

            {dispatchMsg === 'Invitation has been sent' &&
                <MessagePopUp
                    visible={isDispatchShowModal}
                    title={t('sentence:invitationHasBeenSent')}
                    buttonText={t('alert:ok')}
                    onPress={() => {
                        setIsDispatchShowModal(false)
                        dispatch(closeModal())
                    }}
                    buttonNumber="1"
                />
            }

            {dispatchMsg === 'Duplicated invitation' &&
                <MessagePopUp
                    visible={isDispatchShowModal}
                    title={t('sentence:duplicatedInvitation')}
                    buttonText={t('alert:ok')}
                    onPress={() => {
                        setIsDispatchShowModal(false)
                        dispatch(closeModal())
                    }}
                    buttonNumber="1"
                />
            }

            {dispatchMsg === 'User not found' &&
                <MessagePopUp
                    visible={isDispatchShowModal}
                    title={t('sentence:userNotFound')}
                    buttonText={t('alert:ok')}
                    onPress={() => {
                        setIsDispatchShowModal(false)
                        dispatch(closeModal())
                    }}
                    buttonNumber="1"
                />
            }

            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <CustomButton onPress={() => { inviteMemberHandler() }}>{t('buttons:inviteMember')}</CustomButton>
                {/* <CustomButton onPress={() => { setShowRemoveButton(!showRemoveButton) }}>{t('buttons:removeMembers')}</CustomButton> */}
            </View>

            {accountMembers && accountMembers.length > 0 &&
                <View>
                    {accountMembers.map(member => {
                        return (
                            <ContactItem name={member.name} email={member.email} key={member.id} id={member.id} navigation={props.navigation} />
                        )
                    })}
                </View>
            }

            <View style={{ height: 20 }}></View>

        </ScrollView>
    )
};

const styles = StyleSheet.create({
    screen: {
        backgroundColor: COLOR.bgColor,
    },
    contactItem: {
        padding: 10,
        marginBottom: 2,
        backgroundColor: 'white',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 10,
    },
    contactItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    removeButton: {
        backgroundColor: '#DC143C',
        height: '100%',
        padding: 10,
        alignItems: 'center',
        width: 90
    },
});

export default AccountMemberListScreen;