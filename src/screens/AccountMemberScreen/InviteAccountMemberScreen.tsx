import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/Text/CustomText';
import COLOR from '../../constants/Theme/color';
import { sendMemberInvitation } from '../../store/actions/account';
import { RootState } from '../../store/store';
import { validateEmail } from '../../utils/resuableMethods';

const InviteAccountMemberScreen = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [emailNotEmpty, setEmailNotEmpty] = useState(true);
    const [emailIsValid, setEmailIsValid] = useState(true);
    const userId = useSelector((state: RootState) => state.user.user.id);
    const accountId = useSelector((state: RootState) => state.account.account.id);

    const checkEmpty = (input: string) => {
        if (input.trim() === '') {
            return true
        };
    };

    const inviteMemberHandler = () => {

        if (checkEmpty(email)) {
            setEmailNotEmpty(false);
            return
        } else {
            if (!validateEmail(email)) {
                setEmailIsValid(false);
                return
            };
        }

        dispatch(sendMemberInvitation(userId!, accountId!, email, 'Invitation'));

    }

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

    return (
        <View style={styles.screen}>
            <View>


                <View style={styles.row}>
                    <Label>{t('form:email')}</Label>
                    <View style={styles.inputContainer}>
                        <View style={styles.textInputContainer}>
                            <TextInput
                                placeholder={t('form:email')}
                                autoCapitalize="none"
                                value={email}
                                onFocus={() => { setEmailNotEmpty(true), setEmailIsValid(true) }}
                                onChangeText={(text) => { setEmail(text) }}
                            />
                        </View>
                    </View>
                </View>

                <ErrorRow condition={emailNotEmpty} msg={t('sentence:emailCannotBeEmpty')} />
                <ErrorRow condition={emailIsValid} msg={t('sentence:emailIsNotValid')} />


                <View style={styles.buttonContainer}>
                    <CustomButton onPress={() => { inviteMemberHandler() }}>{t('buttons:sendInvitation')}</CustomButton>
                </View>

            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLOR.bgColor,
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
});

export default InviteAccountMemberScreen;