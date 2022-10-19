import React from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RootState } from '../store/store';
import { productIcons } from '../assets/images/mapping';
import { useTranslation } from 'react-i18next';
import ClickableItem from './Elements/ClickableItem';
import CustomText from './Text/CustomText';
import { getTranslateType, formatDateTime } from '../utils/resuableMethods';

interface Alert {
    status: string | null,
    start_datetime: string | null,
    end_datetime: string | null,
    alert_type: string | null,
    thing_name: string | null,
    thing_code: string | null,
    thing_id: number | null,
    onPress: any,
};

const AlertItem = (props: Alert) => {

    const { t } = useTranslation();
    const thing = useSelector((state: RootState) => state.things.things).find(thing => thing.id === props.thing_id);


    return (

        <ClickableItem style={{ ...styles(props.status, props.alert_type).item }} onPress={props.onPress}>

            <View style={styles().content}>

                <View style={styles().imageCol}>
                    {thing ?
                        // <Image style={styles().image} source={productIcons[thing.icon_id]} />
                        <Image style={styles().image} source={{ uri: thing.icon_url }} />
                        :
                        <Image style={styles().image} source={require('../assets/images/company_logo/Logo.png')} />
                    }
                </View>

                <View style={styles().centerContentCol}>
                    <CustomText style={{ fontWeight: 'bold' }}>{props.thing_name}</CustomText>
                    {/* <CustomText numberOfLines={1} >{props.thing_code}</CustomText> */}
                    <CustomText>{formatDateTime(props.start_datetime)}</CustomText>
                    {props.end_datetime ?
                        <CustomText>{formatDateTime(props.end_datetime)}</CustomText>
                        :
                        <Text></Text>
                    }
                </View>

                <View style={styles().statusCol}>
                    {props.status == 'Clear' &&
                        <CustomText style={styles(props.alert_type).alertTypeClear}>
                            {getTranslateType(props.alert_type)}
                        </CustomText>
                    }

                    {props.status == 'Set' &&
                        <CustomText style={styles().alertTypeSet}>
                            {getTranslateType(props.alert_type)}
                        </CustomText>
                    }

                    <CustomText style={styles().status}>
                        {props.status === 'Clear' ? t('common:clear') : t('common:set')}
                    </CustomText>
                </View>

            </View>
        </ClickableItem >
    )
};


const getColorByAlertType = (alertType: string) => {

    switch (alertType) {
        case 'alarm':
            return 'red'
        case 'drill':
            return 'orange'
        case 'boot':
            return 'white'
    }
}

const styles = (props?: any, props2?: any) => StyleSheet.create({
    item: {
        marginVertical: 5,
        marginHorizontal: 12,
        padding: 5,
        backgroundColor: props === 'Set' ? getColorByAlertType(props2) : 'white',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    imageCol: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '80%',
        height: 100,
        resizeMode: 'contain',
    },
    centerContentCol: {
        width: '60%',
        paddingHorizontal: 5,
        paddingVertical: 10,
        justifyContent: 'center',
    },
    alertTypeClear: {
        fontWeight: 'bold',
        color: props == 'alarm' ? 'red' : 'orange'
    },
    alertTypeSet: {
        fontWeight: 'bold',
        color: '#000000',
    },
    statusCol: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    status: {
        fontWeight: 'bold',
    },
});

export default AlertItem;