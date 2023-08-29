import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootState } from '../store/store';
import * as UserActions from '../store/actions/user';
import COLOR from '../constants/Theme/color';
// import Icon from 'react-native-vector-icons/Ionicons';

const AlertNotification = (props: any) => {

    const hasUnread = useSelector((state: RootState) => state.user.hasUnread);

    return (
        <View style={styles.headerButton}>

            {hasUnread ?
                <TouchableOpacity onPress={props.onPress} >
                    <View style={styles.row}>
                        <Ionicons name={props.name} size={props.size} color={COLOR.headerButtonColor} />
                        <Badge value="" status="error" containerStyle={styles.badgeStyle} />
                    </View>

                </TouchableOpacity>

                :

                <TouchableOpacity onPress={props.onPress} >
                    <Ionicons name={props.name} size={props.size} color={COLOR.headerButtonColor} />
                </TouchableOpacity>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    headerButton: {
        marginVertical: 5,
        marginHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
    },
    badgeStyle: {
        position: 'absolute',
        top: -4,
        right: -5,
      },
});

export default AlertNotification;