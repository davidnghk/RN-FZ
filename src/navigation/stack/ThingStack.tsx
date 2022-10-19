import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import HeaderStyles from '../../constants/Theme/headerStyle';

// components
import AlertNotifications from '../../components/AlertNotifications';
import RefreshButton from '../../components/RefreshButton';
import HeaderBackButton from '../../components/HeaderBackButton';
// screens
import ThingsScreen from '../../screens/ThingsScreens/ThingsScreen';
import ThingDetailsScreen from '../../screens/ThingsScreens/ThingDetailsScreen';
import AlertDetailsScreen from '../../screens/AlertsScreen/AlertDetailsScreen';
import ScanDeviceScreen from '../../screens/UserAddDevice/ScanDeviceScreen';
import RegisterDeviceScreen from '../../screens/UserAddDevice/RegisterDeviceScreen';
import AddDeviceCompletedScreen from '../../screens/UserAddDevice/AddDeviceCompletedScreen';
import EditDeviceScreen from '../../screens/ThingsScreens/EditDeviceScreen';
import EditCoordinateScreen from '../../screens/ThingsScreens/EditCoordinateScreen';
import NetworkErrorScreen from '../../screens/NetworkErrorScreen';
import ErrorScreen from '../../screens/ErrorScreen';
import COLOR from '../../constants/Theme/color';


const ThingStack = createStackNavigator();

export const ThingStackScreen = () => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
        <ThingStack.Navigator
            screenOptions={({ navigation }) => ({
                headerStyle: HeaderStyles.headerStyle,
                headerTitleStyle: HeaderStyles.headerTitleStyle,
                headerRight: () => (
                    <View style={{ flexDirection: 'row' }}>
                        <RefreshButton name='refresh' size={18} target='alerts,things' />
                        <AlertNotifications
                            name='bell-o'
                            size={18}
                            onPress={() => navigation.navigate("Alerts", { screen: 'AlertsScreen' })} />
                    </View>
                ),
                headerBackImage: () => <HeaderBackButton color="white" />,
                headerBackTitleVisible: false,
                cardStyle: { backgroundColor: COLOR.bgColor },
            })}
        >
            <ThingStack.Screen name="ThingsScreen" component={ThingsScreen} options={
                {
                    headerTitle: t('navigate:devices'),
                }
            } />
            <ThingStack.Screen name="ThingDetailsScreen" component={ThingDetailsScreen} options={
                {
                    headerTitle: t('navigate:details'),
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginLeft: Platform.OS === 'ios' ? 0 : 15 }} onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'ThingsScreen' }],
                            });
                        }}
                        >
                            <HeaderBackButton color="white" />
                        </TouchableOpacity>
                    ),
                }
            } />
            <ThingStack.Screen name="ScanDeviceScreen" component={ScanDeviceScreen} options={
                {
                    headerTitle: t('navigate:scanQRCode'),
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginLeft: Platform.OS === 'ios' ? 0 : 15 }} onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'ThingsScreen' }],
                            });
                        }}
                        >
                            <HeaderBackButton color="white" />
                        </TouchableOpacity>
                    ),
                }
            } />
            <ThingStack.Screen name="RegisterDeviceScreen" component={RegisterDeviceScreen} options={
                {
                    headerTitle: t('navigate:addDevice'),
                }
            } />
            <ThingStack.Screen name="AddDeviceCompletedScreen" component={AddDeviceCompletedScreen} options={
                {
                    headerTitle: '',
                }
            } />
            <ThingStack.Screen name="EditDeviceScreen" component={EditDeviceScreen} options={
                {
                    headerTitle: t('navigate:editInfo'),
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginLeft: Platform.OS === 'ios' ? 0 : 15 }} onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'ThingsScreen' }],
                            });
                        }}
                        >
                            <HeaderBackButton color="white" />
                        </TouchableOpacity>
                    ),
                }
            } />
            <ThingStack.Screen name="AlertDetailsScreen" component={AlertDetailsScreen} options={
                {
                    headerTitle: t('navigate:alerts'),
                }
            } />
              <ThingStack.Screen name="EditCoordinateScreen" component={EditCoordinateScreen} options={
                {
                    headerTitle: t('navigate:editInfo'),
                }
            } />
            <ThingStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} options={
                {
                    headerTitle: t('navigate:error'),
                }
            } />
            <ThingStack.Screen name="ErrorScreen" component={ErrorScreen} options={
                {
                    headerTitle: t('navigate:error'),
                }
            } />
        </ThingStack.Navigator>
    )
};