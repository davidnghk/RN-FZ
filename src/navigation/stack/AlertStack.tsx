import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

// components
import AlertNotifications from '../../components/AlertNotifications';
import RefreshButton from '../../components/RefreshButton';
import HeaderBackButton from '../../components/HeaderBackButton';
// screens
import AlertsScreen from '../../screens/AlertsScreen/AlertsScreen';
import AlertDetailsScreen from '../../screens/AlertsScreen/AlertDetailsScreen';
import ThingDetailsScreen from '../../screens/ThingsScreens/ThingDetailsScreen';
import NetworkErrorScreen from '../../screens/NetworkErrorScreen';
import ErrorScreen from '../../screens/ErrorScreen';
import HeaderStyles from '../../constants/Theme/headerStyle';
import COLOR from '../../constants/Theme/color';

const AlertStack = createStackNavigator();

export const AlertStackScreen = (props: any) => {

    const { t } = useTranslation();

    return (

        <AlertStack.Navigator
            screenOptions={({ navigation }) => ({
                headerStyle: HeaderStyles.headerStyle,
                headerTitleStyle: HeaderStyles.headerTitleStyle,
                headerTitle: t('navigate:alerts'),
                headerRight: () =>
                (
                    <View style={{ flexDirection: 'row' }}>
                        <RefreshButton name='refresh' size={18} target='alerts' />
                        <AlertNotifications
                            name='bell-o'
                            size={18}
                            onPress={() => navigation.navigate('AlertsScreen')}
                        />
                    </View>
                ),
                headerBackImage: () => <HeaderBackButton color={COLOR.headerButtonColor} />,
                headerBackTitleVisible: false,
            })}
        >
            <AlertStack.Screen name="AlertsScreen" component={AlertsScreen} options={
                {
                    headerTitle: t('navigate:alerts'),
                }
            } />
            <AlertStack.Screen name="AlertDetailsScreen" component={AlertDetailsScreen} options={
                {
                    headerTitle: t('navigate:details'),
                    headerLeft: () => (
                        <TouchableOpacity style={{ marginLeft: Platform.OS === 'ios' ? 0 : 15 }} onPress={() => {
                            props.navigation.reset({
                                index: 0,
                                routes: [{ name: 'AlertsScreen' }],
                            });
                        }}
                        >
                            <HeaderBackButton color="white" />
                        </TouchableOpacity>
                    ),
                }
            } />
            <AlertStack.Screen name="ThingDetailsScreen" component={ThingDetailsScreen} options={
                {
                    headerTitle: t('navigate:details'),
                }
            } />
            <AlertStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} options={
                {
                    headerTitle: t('navigate:error'),
                }
            } />
            <AlertStack.Screen name="ErrorScreen" component={ErrorScreen} options={
                {
                    headerTitle: t('navigate:error'),
                }
            } />
        </AlertStack.Navigator>
    )
};