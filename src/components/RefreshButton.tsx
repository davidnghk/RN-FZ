import React from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as AlertsActions from '../store/actions/alerts';
import * as ThingsActions from '../store/actions/things';
import * as UserActions from '../store/actions/user';
import { fetchAmbienceDevices } from '../store/actions/ambience';
import { fetchLocations, fetchLocation } from '../store/actions/locations'
import COLOR from '../constants/Theme/color';

const RefreshButton = (props: any) => {

    const dispatch = useDispatch();

    const refreshHandler = (target: string, id?: number) => {

        if (target.includes("alerts")) {
            dispatch(AlertsActions.fetchAllAlerts());
        }

        if (target.includes('things')) {
            dispatch(ThingsActions.fetchThings());
        }; 

        if (target == 'user') {
            dispatch(UserActions.getUserInfo());
            return
        }

        if (target == 'locations' ) {
            dispatch(fetchLocations());
            return
        }
        
        if (target == 'location' && id ) {
            dispatch(fetchLocation(id));
            return
        }

        if (target == 'ambience' ) {
            dispatch(fetchAmbienceDevices());
            return
        }
 
    };

    return (
        <View style={styles.headerButton}>
            <TouchableOpacity onPress={() => {refreshHandler(props.target, props.id)}} >
                <View style={styles.row}>
                    <Icon name={props.name} size={props.size} color={COLOR.headerButtonColor} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        marginVertical: 5,
    },
    row: {
        flexDirection: 'row',
    },
});

export default RefreshButton;