import React from 'react';
import { View } from 'react-native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import HeaderStyles from '../../constants/Theme/headerStyle';

// components
import AlertNotifications from '../../components/AlertNotifications';
import HeaderBackButton from '../../components/HeaderBackButton';
import RefreshButton from '../../components/RefreshButton';
// screens
import ProfileScreen from '../../screens/UserScreens/ProfileScreen';
import EditProfileScreen from '../../screens/UserScreens/EditProfileScreen';
import LanguageSettingScreen from '../../screens/UserScreens/LanguageSettingScreen';
import FontSizeSettingScreen from '../../screens/UserScreens/FontSizeSettingScreen';
import VideoGuideScreen from '../../screens/UserScreens/VideoGuideScreen';
import EmergencyContactsScreen from '../../screens/EmergencyContactScreen/EmergencyContactsScreen';
import CreateEmergencyContactScreen from '../../screens/EmergencyContactScreen/CreateEmergencyContactScreen';
import EditEmergencyContactScreen from '../../screens/EmergencyContactScreen/EditEmergencyContactScreen';
import AccountMemberListScreen from '../../screens/AccountMemberScreen/AccountMemberListScreen';
import InviteAccountMemberScreen from '../../screens/AccountMemberScreen/InviteAccountMemberScreen';
import NetworkErrorScreen from '../../screens/NetworkErrorScreen';
import ErrorScreen from '../../screens/ErrorScreen';
import AmbienceDeviceListScreen from '../../screens/AmbienceScreen/AmbienceDeviceListScreen'
import AmbienceDeviceScreen from '../../screens/AmbienceScreen/AmbienceDeviceScreen';
import AmbienceDeviceChartScreen from '../../screens/AmbienceScreen/AmbienceDeviceChartScreen';
import PrivacyPolicyScreen from '../../screens/UserScreens/PrivacyPolicyScreen';

import COLOR from '../../constants/Theme/color';


const UserStack = createStackNavigator();

export const UserStackScreen = (props: any) => {

    const { t } = useTranslation();

    return (
        <UserStack.Navigator
            screenOptions={({ navigation }) => ({
                headerStyle: HeaderStyles.headerStyle,
                headerTitleStyle: HeaderStyles.headerTitleStyle,
                headerTitle: t('navigate:profile'),
                headerRight: () => (
                    <View style={{ flexDirection: 'row' }}>
                        <RefreshButton name='refresh' size={18} target='user' />
                        <AlertNotifications
                            name='bell-o'
                            size={18}
                            onPress={() => navigation.navigate("Alerts", { screen: 'AlertsScreen' })}
                        />
                    </View>
                ),
                headerBackImage: () => <HeaderBackButton color={COLOR.headerButtonColor} />,
                headerBackTitleVisible: false,
                // ...TransitionPresets.SlideFromRightIOS
            })}
        >
            <UserStack.Screen name="ProfileScreen" component={ProfileScreen} options={
                {
                    headerTitle: t('navigate:profile'),
                }
            } />
            <UserStack.Screen name="VideoGuideScreen" component={VideoGuideScreen} options={
                {
                    headerTitle: t('navigate:userGuide'),
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // <- Have to add this to prevent crash when naviagting to other screen
                }
            } />
            <UserStack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} options={
                {
                    headerTitle: t('navigate:privacyPolicy'),
                    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // <- Have to add this to prevent crash when naviagting to other screen
                }
            } />
            <UserStack.Screen name="LanguageSettingScreen" component={LanguageSettingScreen} options={
                {
                    headerTitle: t('navigate:languageSetting'),
                }
            } />
            <UserStack.Screen name="FontSizeSettingScreen" component={FontSizeSettingScreen} options={
                {
                    headerTitle: t('navigate:fontSizeSetting'),
                }
            } />
            <UserStack.Screen name="EditProfileScreen" component={EditProfileScreen} options={
                {
                    headerTitle: t('navigate:editProfileScreen'),
                }
            } />
            <UserStack.Screen name="EmergencyContactsScreen" component={EmergencyContactsScreen} options={
                {
                    headerTitle: t('navigate:contacts'),
                }
            } />
            <UserStack.Screen name="EditEmergencyContactScreen" component={EditEmergencyContactScreen} options={
                {
                    headerTitle: t('navigate:editContact'),
                }
            } />
            <UserStack.Screen name="CreateEmergencyContactScreen" component={CreateEmergencyContactScreen} options={
                {
                    headerTitle: t('navigate:createContact'),
                }
            } />
            <UserStack.Screen name="AccountMemberListScreen" component={AccountMemberListScreen} options={
                {
                    headerTitle: t('navigate:accountMember'),
                }
            } />
            <UserStack.Screen name="InviteAccountMemberScreen" component={InviteAccountMemberScreen} options={
                {
                    headerTitle: t('navigate:inviteMember'),
                }
            } />
            <UserStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} options={
                {
                    headerTitle: t('navigate:error'),
                }
            } />
            <UserStack.Screen name="ErrorScreen" component={ErrorScreen} options={
                {
                    headerTitle: t('navigate:error'),
                }
            } />

            {/* Ambience Stack */}
             <UserStack.Screen name="AmbienceDeviceListScreen" component={AmbienceDeviceListScreen} options={
                {
                    headerTitle: t('navigate:ambienceList'),
                }
            } />
            <UserStack.Screen name="AmbienceDeviceScreen" component={AmbienceDeviceScreen} options={
                {
                    headerTitle: t('navigate:ambienceDevice'),
                }
            } />
            <UserStack.Screen name="AmbienceDeviceChartScreen" component={AmbienceDeviceChartScreen} options={
                {
                    headerTitle: '',
                }
            } />
     
        </UserStack.Navigator>
    )
};