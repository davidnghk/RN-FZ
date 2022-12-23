import React from 'react';
import { TouchableOpacity, View, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import HeaderStyles from '../../constants/Theme/headerStyle';
import COLOR from '../../constants/Theme/color';

// components
import AlertNotifications from '../../components/AlertNotifications';
import RefreshButton from '../../components/RefreshButton';
import HeaderBackButton from '../../components/HeaderBackButton';
// screens
import LocationsScreen from '../../screens/LocationsScreen/LocationsScreen';
import LocationDetailsScreen from '../../screens/LocationsScreen/LocationDetailsScreen';
import EditLocationScreen from '../../screens/LocationsScreen/EditLocationScreen';
import ThingDetailsScreen from '../../screens/ThingsScreens/ThingDetailsScreen';

const LocationStack = createStackNavigator();

export const LocationStackScreen = (props: any) => {

    const { t } = useTranslation();

    return (

        <LocationStack.Navigator
            screenOptions={({ navigation }) => ({
                headerTitle: t('navigate:locations'),
                headerStyle: HeaderStyles.headerStyle,
                headerTitleStyle: HeaderStyles.headerTitleStyle,
                headerRight: () =>
                (
                    <View style={{ flexDirection: 'row' }}>
                        <RefreshButton name='refresh' size={18} target='locations' />
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
            <LocationStack.Screen name="LocationsScreen" component={LocationsScreen} options={
                {
                    headerTitle: t('navigate:locations'),
                }
            } />
            <LocationStack.Screen name="LocationDetailsScreen" component={LocationDetailsScreen} options={({ route }) =>
                ({
                headerTitle: t('navigate:details'),
                headerLeft: () => (
                    <TouchableOpacity style={{ marginLeft: Platform.OS === 'ios' ? 0 : 15 }} onPress={() => {
                        if (route.params?.parent_id)  {
                            props.navigation.push('LocationDetailsScreen', {id: route.params.parent_id});

                        } else {
                            props.navigation.navigate('LocationsScreen');
                        }
                    }}
                    >
                        <HeaderBackButton color="white" />
                    </TouchableOpacity>
                ),
                headerRight: () =>
                (
                    <View style={{ flexDirection: 'row' }}>
                        <RefreshButton name='refresh' size={18} target='location' id={route.params.id} />
                        <AlertNotifications
                            name='bell-o'
                            size={18}
                            onPress={() => {
                                props.navigation.navigate("Alerts", {
                                    screen: 'AlertsScreen',
                                    params: { },
                                    initial: false
                                });
                            }}
                        />
                    </View>
                ),
            })

            } />
             <LocationStack.Screen name="EditLocationScreen" component={EditLocationScreen} options={
                {
                    headerTitle: t('navigate:editInfo'),
                }
            } />


            <LocationStack.Screen name="ThingDetailsScreen" component={ThingDetailsScreen} options={
                {
                    headerTitle: t('navigate:details'),
                }
            } />

        </LocationStack.Navigator>
    )
};