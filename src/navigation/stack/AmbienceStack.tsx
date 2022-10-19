import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import HeaderStyles from '../../constants/Theme/headerStyle';
import COLOR from '../../constants/Theme/color';

// components
import AlertNotifications from '../../components/AlertNotifications';
import RefreshButton from '../../components/RefreshButton';
import HeaderBackButton from '../../components/HeaderBackButton';
// screens
import AmbienceDeviceListScreen from '../../screens/AmbienceScreen/AmbienceDeviceListScreen'
import AmbienceDeviceScreen from '../../screens/AmbienceScreen/AmbienceDeviceScreen';
import AmbienceDeviceChartScreen from '../../screens/AmbienceScreen/AmbienceDeviceChartScreen';
import NetworkErrorScreen from '../../screens/NetworkErrorScreen';

const AmbienceStack = createStackNavigator();

export const AmbienceStackScreen = () => {

    const navigation = useNavigation();
    const { t } = useTranslation();

    return (

        <AmbienceStack.Navigator
            screenOptions={({ navigation }) => ({
                headerTitle: t('navigate:alerts'),
                headerStyle: HeaderStyles.headerStyle,
                headerTitleStyle: HeaderStyles.headerTitleStyle,
                headerRight: () =>
                (
                    <View style={{ flexDirection: 'row' }}>
                        <RefreshButton name='refresh' size={18} target='ambience' />
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
            <AmbienceStack.Screen name="AmbienceeviceListScreen" component={AmbienceDeviceListScreen} options={
                {
                    headerTitle: t('navigate:ambienceList'),
                }
            } />
            <AmbienceStack.Screen name="AmbienceDeviceScreen" component={AmbienceDeviceScreen} options={
                {
                    headerTitle: t('navigate:ambienceDevice'),
                }
            } />
            <AmbienceStack.Screen name="AmbienceDeviceChartScreen" component={AmbienceDeviceChartScreen} options={
                {
                    headerTitle: '',
                }
            } />
            <AmbienceStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} options={
                {
                    headerTitle: t('navigate:error'),
                }
            } />
        </AmbienceStack.Navigator>
    )
};