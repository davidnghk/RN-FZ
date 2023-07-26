import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

// components
import AlertNotifications from '../../components/AlertNotifications';
import RefreshButton from '../../components/RefreshButton';
// import HeaderTitle from '../components/HeaderTitle';

// Screens
import HomeScreen from '../../screens/HomeScreens/HomeScreen';
import AlertsScreen from '../../screens/AlertsScreen/AlertsScreen';
import ThingsScreen from '../../screens/ThingsScreens/ThingsScreen';
import AlertDetailsScreen from '../../screens/AlertsScreen/AlertDetailsScreen';
import ThingDetailsScreen from '../../screens/ThingsScreens/ThingDetailsScreen';
// import LoginScreen from '../screens/visitor/LoginScreen';
// import LandingScreen from '../screens/visitor/LandingScreen';
import ProfileScreen from '../../screens/UserScreens/ProfileScreen';
import EditDeviceScreen from '../../screens/backup/EditDeviceScreen';
import DeviceAdded from '../../screens/UserAddDevice/AddDeviceCompletedScreen';
import ScanDeviceScreen from '../../screens/UserAddDevice/ScanDeviceScreen';
import AddMarkerScreen from '../../screens/backup/AddMarkerScreen';
import NetworkErrorScreen from '../../screens/NetworkErrorScreen';
import VideoGuideScreen from '../../screens/UserScreens/VideoGuideScreen';
import LanguageSettingScreen from '../../screens/UserScreens/LanguageSettingScreen';
import FontSizeSettingScreen from '../../screens/UserScreens/FontSizeSettingScreen';
import EditProfileScreen from '../../screens/UserScreens/EditProfileScreen';
import EmergencyContactsScreen from '../../screens/EmergencyContactScreen/EmergencyContactsScreen';
import EditEmergencyContactScreen from '../../screens/EmergencyContactScreen/EditEmergencyContactScreen';
import CreateEmergencyContactScreen from '../../screens/EmergencyContactScreen/CreateEmergencyContactScreen';


// Create Screens Stacks
// export const HomeStack = createStackNavigator();
// export const AlertStack = createStackNavigator();
// export const ThingStack = createStackNavigator();
// export const AuthStack = createStackNavigator();
// export const UserStack = createStackNavigator();

// export const HomeStackScreen = (props: any) => {

//     // const navigation = useNavigation();
//     const { t } = useTranslation();

//     return (
//         <HomeStack.Navigator
//             screenOptions={({ navigation }) => ({
//                 headerStyle: {
//                     elevation: 0, // remove shadow on Android
//                     shadowOpacity: 0, // remove shadow on iOS
//                     borderBottomWidth: 0, // Just in case.
//                     // backgroundColor: '#EFEFEF',
//                 },
//                 headerTitle: t('navigate:home'),
//                 headerRight: () => (
//                     <View style={{ flexDirection: 'row' }}>
//                         <RefreshButton name='refresh' size={18} target='things' />
//                         <AlertNotifications
//                             name='bell-o'
//                             size={18}
//                             // onPress={() => navigation.navigate('AlertsScreen')}
//                             onPress={() => props.navigation.navigate("Alerts", {screen: 'AlertsScreen'})}
//                         />
//                     </View>
//                 ),
//             })}

//         >

//             <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
//             <HomeStack.Screen name="ScanDeviceScreen" component={ScanDeviceScreen} options={
//                 {
//                     headerTitle: t('navigate:scanQRCode'),
//                 }
//             } />
//             <HomeStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} options={
//                 {
//                     headerTitle: t('navigate:error'),
//                 }
//             } />

//         </HomeStack.Navigator>
//     )
// };

// export const AlertStackScreen = () => {

//     const navigation = useNavigation();
//     const { t } = useTranslation();

//     return (

//         <AlertStack.Navigator
//             screenOptions={({ navigation }) => ({
//                 headerTitle: t('navigate:alerts'),
//                 headerRight: () =>
//                 (
//                     <View style={{ flexDirection: 'row' }}>
//                         <RefreshButton name='refresh' size={18} target='alerts' />
//                         <AlertNotifications
//                             name='bell-o'
//                             size={18}
//                             onPress={() => navigation.navigate('AlertsScreen')}
//                         />
//                     </View>
//                 ),
//             })}
//         >
//             <AlertStack.Screen name="AlertsScreen" component={AlertsScreen} options={
//                 {
//                     headerTitle: t('navigate:alerts'),
//                 }
//             } />
//             <AlertStack.Screen name="AlertDetailsScreen" component={AlertDetailsScreen} options={
//                 {
//                     headerTitle: t('navigate:details'),
//                 }
//             } />
//             <AlertStack.Screen name="ThingDetailsScreen" component={ThingDetailsScreen} options={
//                 {
//                     headerTitle: t('navigate:details'),
//                 }
//             } />
//             <AlertStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} options={
//                 {
//                     headerTitle: t('navigate:error'),
//                 }
//             } />
//         </AlertStack.Navigator>
//     )


// };

// export const ThingStackScreen = () => {

//     const navigation = useNavigation();
//     const { t } = useTranslation();

//     return (
//         <ThingStack.Navigator
//             screenOptions={({ navigation }) => ({

//                 headerRight: () => (
//                     <View style={{ flexDirection: 'row' }}>
//                         <RefreshButton name='refresh' size={18} target='things' />
//                         <AlertNotifications
//                             name='bell-o'
//                             size={18}
//                             onPress={() => navigation.navigate('AlertsScreen')} />
//                     </View>
//                 )
//             })}
//         >
//             <ThingStack.Screen name="ThingsScreen" component={ThingsScreen} options={
//                 {
//                     headerTitle: t('navigate:devices'),
//                 }
//             } />
//             <ThingStack.Screen name="ThingDetailsScreen" component={ThingDetailsScreen} options={
//                 {
//                     headerTitle: t('navigate:details'),
//                 }
//             } />
//             <ThingStack.Screen name="AlertDetailsScreen" component={AlertDetailsScreen} options={
//                 {
//                     headerTitle: t('navigate:alerts'),
//                 }
//             } />
//             <ThingStack.Screen name="EditDeviceScreen" component={EditDeviceScreen} options={
//                 {
//                     headerTitle: t('navigate:addDevice'),
//                 }
//             } />
//             <ThingStack.Screen name="DeviceAdded" component={DeviceAdded} />
//             <ThingStack.Screen name="ScanDeviceScreen" component={ScanDeviceScreen} options={
//                 {
//                     headerTitle: t('navigate:scanQRCode'),
//                 }
//             } />
//             <ThingStack.Screen name="AddMarkerScreen" component={AddMarkerScreen} options={
//                 {
//                     headerTitle: t('navigate:addLocation'),
//                 }
//             } />
//             <ThingStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} options={
//                 {
//                     headerTitle: t('navigate:error'),
//                 }
//             } />

//         </ThingStack.Navigator>
//     )
// };

// export const UserStackScreen = () => {

//     const navigation = useNavigation();
//     const { t } = useTranslation();

//     return (
//         <UserStack.Navigator
//             screenOptions={({ navigation }) => ({
//                 headerTitle: t('navigate:profile'),
//                 headerRight: () => (
//                     <AlertNotifications
//                         name='bell-o'
//                         size={18}
//                         onPress={() => navigation.navigate('AlertsScreen')}
//                     />
//                 ),
//             })}
//         >
//             <UserStack.Screen name="ProfileScreen" component={ProfileScreen} options={
//                 {
//                     headerTitle: t('navigate:profile'),
//                 }
//             } />
//             <UserStack.Screen name="VideoGuideScreen" component={VideoGuideScreen} options={
//                 {
//                     headerTitle: t('navigate:userGuide'),
//                 }
//             } />
//             <UserStack.Screen name="LanguageSettingScreen" component={LanguageSettingScreen} options={
//                 {
//                     headerTitle: t('navigate:languageSetting'),
//                 }
//             } />
//             <UserStack.Screen name="FontSizeSettingScreen" component={FontSizeSettingScreen} options={
//                 {
//                     headerTitle: t('navigate:fontSizeSetting'),
//                 }
//             } />
//             <UserStack.Screen name="EditProfileScreen" component={EditProfileScreen} options={
//                 {
//                     headerTitle: t('navigate:editProfileScreen'),
//                 }
//             } />
//             <UserStack.Screen name="EmergencyContactsScreen" component={EmergencyContactsScreen} options={
//                 {
//                     // headerTitle: t('navigate:editProfileScreen'),
//                 }
//             } />
//             <UserStack.Screen name="EditEmergencyContactScreen" component={EditEmergencyContactScreen} options={
//                 {
//                     // headerTitle: t('navigate:editProfileScreen'),
//                 }
//             } />
//             <UserStack.Screen name="CreateEmergencyContactScreen" component={CreateEmergencyContactScreen} options={
//                 {
//                     // headerTitle: t('navigate:editProfileScreen'),
//                 }
//             } />
//             <UserStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} options={
//                 {
//                     headerTitle: t('navigate:error'),
//                 }
//             } />

//         </UserStack.Navigator>
//     )
// };

// export const AuthStackScreen = () => {
//     <AuthStack.Navigator>
//         <AuthStack.Screen name="LandingScreen" component={LandingScreen} />
//         <AuthStack.Screen name="Login" component={Login} />
//         <AuthStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen}
//             options={
//                 {
//                     headerTitle: "Error",
//                 }
//             } />
//     </AuthStack.Navigator>
// };