import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import ClickableItem from './Elements/ClickableItem';
import CustomText from './Text/CustomText';
import { getTranslateType, formatDateTime } from '../utils/resuableMethods';

const HistoryItem = (props: any) => {

    const { t } = useTranslation();

    return (

        <ClickableItem onPress={props.onPress} style={styles.item}>

            <View style={styles.indexCol}>
                <CustomText >{props.index + 1}</CustomText>
            </View>

            <View style={styles.timeCol}>
                <CustomText>
                    {formatDateTime(props.start_datetime)}
                </CustomText>
                <CustomText>
                    {props.end_datetime ? formatDateTime(props.end_datetime) : t('common:null')}
                </CustomText>
            </View>

            <View style={styles.typeCol}>
                <CustomText>{getTranslateType(props.alert_type)}</CustomText>
            </View>

        </ClickableItem>

    )
};

const styles = StyleSheet.create({
    item: {
        marginVertical: 8,
        marginHorizontal: 20,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    indexCol: {
        width: '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeCol: {
        width: '65%',
        alignItems: 'center',
    },
    typeCol: {
        width: '20%',
        textAlign: 'center',
        alignItems: 'center',
    }
});

export default HistoryItem;