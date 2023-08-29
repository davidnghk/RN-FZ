import React from 'react';
import { View, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import COLOR from '../../constants/Theme/color';
import HeaderStyles from '../../constants/Theme/headerStyle';

// components
import AlertNotifications from '../../components/AlertNotifications';
import RefreshButton from '../../components/RefreshButton';
import CustomHeaderBackground from '../../components/CustomeHeaderBackground';
import CustomHeaderImageTitle from '../../components/CustomHeaderImageTitle';
import HeaderBackButton from '../../components/HeaderBackButton';
// screens
import HomeScreen from '../../screens/HomeScreens/HomeScreen';
import AlertDetailsScreen from '../../screens/AlertsScreen/AlertDetailsScreen';
import ThingDetailsScreen from '../../screens/ThingsScreens/ThingDetailsScreen';
import ErrorScreen from '../../screens/ErrorScreen';
import NetworkErrorScreen from '../../screens/NetworkErrorScreen';


const HomeStack = createStackNavigator();

export const HomeStackScreen = (props: any) => {

    const { t } = useTranslation();
    const platform = Platform.OS;

    return (
        <HomeStack.Navigator
            screenOptions={({ navigation }) => ({
                headerStyle: HeaderStyles.headerStyle,
                headerTitleStyle: HeaderStyles.headerTitleStyle,
                headerRight: () => (
                    <View style={{ flexDirection: 'row' }}>
                        <RefreshButton name='refresh' size={18} target='things' />
                        <AlertNotifications
                            name='notifications'
                            size={18}
                            onPress={() => navigation.navigate("Alerts", { screen: 'AlertsScreen' })}
                        />
                    </View>
                ),
                headerBackImage: () => <HeaderBackButton color={COLOR.headerButtonColor} />,
                headerBackTitleVisible: false,
                cardStyle: { backgroundColor: COLOR.bgColor },
            })}
        >
            <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={
                {
                    headerTitle: () => (<CustomHeaderImageTitle platform={platform} />),
                    headerBackground: () => (<CustomHeaderBackground platform={platform} />),
                }
            } />
            <HomeStack.Screen name="AlertDetailsScreen" component={AlertDetailsScreen} options={
                {
                    headerTitle: t('navigate:details'),
                }
            } />
            <HomeStack.Screen name="ThingDetailsScreen" component={ThingDetailsScreen} options={
                {
                    headerTitle: t('navigate:details'),
                }
            } />
            <HomeStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} options={
                {
                    headerTitle: t('navigate:error'),
                }
            } />
            <HomeStack.Screen name="ErrorScreen" component={ErrorScreen} options={
                {
                    headerTitle: t('navigate:error'),
                }
            } />

        </HomeStack.Navigator>
    )
};