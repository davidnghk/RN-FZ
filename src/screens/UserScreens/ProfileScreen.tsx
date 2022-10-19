import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, Linking, Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../store/store';
import * as AuthActions from '../../store/actions/auth';
import * as UserActions from '../../store/actions/user';
import { clearAccountInfo } from '../../store/actions/account';
import { clearThings } from '../../store/actions/things'
import { clearAlerts } from '../../store/actions/alerts';
import CustomText from '../../components/Text/CustomText';
import Card from '../../components/Elements/Card';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLOR from '../../constants/Theme/color';
import { dialCall } from '../../utils/resuableMethods';
import { Config } from '../../config/config'
import { clearAmbienceDevices } from '../../store/actions/ambience';
import { clearLocations } from '../../store/actions/locations';

const ProfileScreen = (props: any) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const account = useSelector((state: RootState) => state.account.account);
    const accountId = user.default_account_id;

    useEffect(() => {
        dispatch(UserActions.getUserInfo());

    }, [accountId]);

    const UserButton = (props: any) => {
        return (
            <TouchableOpacity style={styles.pressableContainer} onPress={props.onPress}>
                <View style={[{ ...styles.pressable }, { ...props.style }]} >
                    <CustomText style={{ color: COLOR.buttonColor }}>{props.children}</CustomText>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: COLOR.bgColor, flexGrow: 1 }}>

            <Card style={styles.card}>

                <TouchableOpacity style={styles.editProfileButton} onPress={() => { props.navigation.navigate('EditProfileScreen') }}>
                    <Ionicons name='settings' color='#404040' size={22} style={{ width: 26 - 32 }} />
                </TouchableOpacity>

                <View style={styles.imageContainer}>

                    {user.avatar_url == null ?
                        <Image style={styles.image} source={require('../../assets/images/default_user_avatar.png')} /> :
                        <Image style={styles.image} source={{ uri: user.avatar_url }} />
                    }

                </View>

                <View style={styles.row}>
                    <CustomText style={styles.label}>{t('common:user')}: </CustomText>
                    <CustomText style={styles.content}>{user.name}</CustomText>
                </View>

                <View style={styles.row}>
                    <CustomText style={styles.label}>{t('common:account')}: </CustomText>
                    <CustomText style={styles.content}>{account.name}</CustomText>
                </View>

                <View style={styles.row}>
                    <CustomText style={styles.label}>{t('common:email')}: </CustomText>
                    <CustomText style={styles.content}>{user.email == null ? 'N/A' : user.email}</CustomText>
                </View>

                {/* <View style={styles.row}>
                    <CustomText style={styles.label}>{t('common:expiryDate')}: </CustomText>
                    <CustomText style={styles.content}>{user.subscription_expiry_date}</CustomText>
                </View> */}

            </Card>


            {account.modules.includes("AIR") &&
                <UserButton onPress={() => { props.navigation.navigate('AmbienceDeviceListScreen') }}>{t('buttons:ambience')}</UserButton>
            }

            <UserButton onPress={() => { props.navigation.navigate('LanguageSettingScreen') }}>{t('buttons:languageSetting')}</UserButton>
            <UserButton onPress={() => { props.navigation.navigate('FontSizeSettingScreen') }}>{t('buttons:fontSizeSetting')}</UserButton>
            {/* <UserButton onPress={() => { dispatch(AuthActions.setTutorialSeen(false)); }}>{t('buttons:appTutorial')}</UserButton> */}
            <UserButton onPress={() => { props.navigation.navigate('AccountMemberListScreen') }}>{t('buttons:accountMember')}</UserButton>
            <UserButton onPress={() => { props.navigation.navigate('EmergencyContactsScreen') }}>{t('buttons:emergencyContact')}</UserButton>
            <UserButton onPress={() => { props.navigation.navigate('VideoGuideScreen') }}>{t('buttons:userGuide')}</UserButton>
            {/* <UserButton style={{ backgroundColor: 'red' }} onPress={() => { dialCall('+852999') }}>{t('buttons:emergencyCall')}</UserButton> */}
            <UserButton onPress={() => {
                [
                    dispatch(AuthActions.logout()),
                    dispatch(clearAccountInfo()),
                    dispatch(UserActions.clearUserInfo()),
                    dispatch(clearAlerts()),
                    dispatch(clearThings()),
                    dispatch(clearAmbienceDevices()),
                    dispatch(clearLocations()),
                ]
            }}>{t('buttons:logout')}</UserButton>

            <View style={{ marginTop: 10 }}>
                <Text style={{ textAlign: 'center', fontSize: 13, color: COLOR.shadowColor }}>Version {Config.versionNumber}</Text>
            </View>

            <View style={{ height: 20 }}></View>

        </ScrollView >
    )
};

const styles = StyleSheet.create({
    card: {
        margin: 20,
        padding: 10,
        alignItems: 'center',
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 100,
        overflow: 'hidden',
        marginVertical: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        marginBottom: 10,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 5,
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink',
    },
    pressableContainer: {
        // backgroundColor: 'pink',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        marginVertical: 5,

    },
    pressable: {
        backgroundColor: COLOR.primaryColor,
        width: '80%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 1,
    },
    label: {
        width: '40%',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    content: {
        width: '60%',
        textAlign: 'center'
    },
    editProfileButton: {
        position: 'absolute',
        right: 15,
        top: 15,

    },
});

export default ProfileScreen;