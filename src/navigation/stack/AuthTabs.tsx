import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLOR from '../../constants/Theme/color';

// Stacks
import { UserStackScreen } from './UserStack';
import { HomeStackScreen } from './HomeStack'
import { AlertStackScreen } from './AlertStack';
import { ThingStackScreen } from './ThingStack';
import { AmbienceStackScreen } from './AmbienceStack';
import { LocationStackScreen } from './LocationStack';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AlarmPopUp from '../../components/AlarmPopUp';

const Tabs = createBottomTabNavigator();

const AuthTabs = (props: any) => {

    const { t } = useTranslation();

    const screenOptions = (route: any, color: string) => {
        let iconName;

        switch (route.name) {
            case 'Home':
                iconName = 'home';
                break;
            case 'Alerts':
                iconName = 'flame';
                break;
            case 'Devices':
                iconName = 'reader';
                break
            case 'User':
                iconName = 'person';
                break
            // case 'Ambience':
            //     iconName = 'thermometer';
            //     break
            case 'Locations':
                iconName = 'location';
                break
            default:
                break;
        }

        return <Ionicons name={iconName} color={color} size={24} style={{ width: 26 - 32 }} />
    };

    const alarmPopUp = useSelector((state: RootState) => state.alerts.alarmPopUp);
    const alarmPopUpShowModal = useSelector((state: RootState) => state.alerts.alarmPopUp.showAlarmPopUp);
    const [isalarmPopUp, setIsalarmPopUp] = useState(false);

    useEffect(() => {

        if (alarmPopUpShowModal) {
            setIsalarmPopUp(alarmPopUpShowModal)
        };

        if (!alarmPopUpShowModal) {
            setIsalarmPopUp(false)
        }

    }, [alarmPopUpShowModal])



    return (

        <>
            {isalarmPopUp &&
                <AlarmPopUp
                    visible={isalarmPopUp}
                    name={alarmPopUp.alert?.thing_name}
                    id={alarmPopUp.alert?.id}
                    alertType={alarmPopUp.alert?.alert_type}
                    navigation={props.navigation}
                />
            }



            <Tabs.Navigator
                tabBarOptions={{
                    activeTintColor: COLOR.primaryColor,
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: (({ color }) => screenOptions(route, color)),
                })}>
                <Tabs.Screen name="Home" component={HomeStackScreen} options={{ tabBarLabel: t('tab:home') }} />
                <Tabs.Screen name="Alerts" component={AlertStackScreen} options={{ tabBarLabel: t('tab:alerts') }} />
                {/* <Tabs.Screen name="Ambience" component={AmbienceStackScreen} options={{ tabBarLabel: t('tab:ambience') }} /> */}
                <Tabs.Screen name="Locations" component={LocationStackScreen} options={{ tabBarLabel: t('tab:locations') }} />
                <Tabs.Screen name="Devices" component={ThingStackScreen} options={{ tabBarLabel: t('tab:devices') }} />
                <Tabs.Screen name="User" component={UserStackScreen} options={{ tabBarLabel: t('tab:user') }} />

            </Tabs.Navigator>
        </>

    )
}

export default AuthTabs