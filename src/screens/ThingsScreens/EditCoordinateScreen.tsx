import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ImageBackground, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CustomText from '../../components/Text/CustomText';
import { RootState } from '../../store/store';
import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import { updateDevice } from '../../store/actions/things';

// Components

//@ts-ignore
const EditCoordinateScreen = ({ route, navigation }) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const thingId = route.params.thingId;
    const thingName = route.params.thingName;
    const locationId = route.params.locationId;
    const action = route.params.action;
    const win = Dimensions.get('window');

    const [locationX, setLocationX] = useState(0);
    const [locationY, setLocationY] = useState(0);
    const [winWidth, setWinWidth] = useState(0);
    const [isMarkerShow, setIsMarkerShow] = useState(false)

    const location = useSelector((state: RootState) => state.locations.locations).find(location => location.id === locationId);
    const isLoading = useSelector((state: RootState) => state.things.isLoading);

    // Set the width of the window for calculating Point Sizer
    useEffect(() => {
        setWinWidth(win.width);
    }, [win]);

    function markerContainerOnPressHandler(event: any) {
        setLocationX(event.nativeEvent.locationX);
        setLocationY(event.nativeEvent.locationY);
        setIsMarkerShow(true);
    };

    function pointSizer(winWidth: number) {
        if (winWidth > 400) {
            return 18;
        } else if (winWidth > 250) {
            return 13;
        } else {
            return 12;
        }
    };

    function saveCoordinate() {
        let addMakerImageContainerWidth = win.width * 0.85; // 0.85 <-- define at styles
        let xCoordinate;
        let yCoordinate;
        
        // console.log('New x: ', xCoordinate);
        // console.log('New y: ', yCoordinate);

        if (xCoordinate == 0 || yCoordinate == 0) {
            xCoordinate = null;
            yCoordinate = null;
        } else {
            xCoordinate = Math.round(locationX / addMakerImageContainerWidth * 1000);
            yCoordinate = Math.round(locationY / addMakerImageContainerWidth * 1000);
        }

        dispatch(updateDevice(thingId, thingName, locationId, xCoordinate, yCoordinate, action))
        
    }

    return (

        <View style={styles.container}>
            <View style={styles.row}>
                <CustomText style={{ fontWeight: 'bold', textAlign: 'center' }}>{t('sentence:tapToAddMarker')}</CustomText>
            </View>

            <View style={[styles.addMakerImageContainer]} >
                <TouchableOpacity onPress={(event) => { markerContainerOnPressHandler(event) }}>
                    {location && location.floorplan &&
                        <ImageBackground
                            source={{ uri: location.floorplan }}
                            style={[{ width: '100%', aspectRatio: 1 }]}
                            resizeMode='contain'
                        >
                            {isMarkerShow &&
                                <TouchableWithoutFeedback>
                                    <View style={[
                                        styles.point,
                                        {
                                            top: locationY - (pointSizer(winWidth) / 2),
                                            left: locationX - (pointSizer(winWidth) / 2),
                                            width: pointSizer(winWidth),
                                            height: pointSizer(winWidth),
                                        }
                                    ]}></View>
                                </TouchableWithoutFeedback>
                            }
                        </ImageBackground>
                    }


                </TouchableOpacity>
            </View>

            {isLoading ?
                <Loader />
                :
                <CustomButton style={styles.button} onPress={() => { saveCoordinate() }}>
                    {t('buttons:save')}
                </CustomButton>
            }
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 25,
        alignItems: 'center',
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    addMakerImageContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dotted',
        overflow: 'hidden',
        borderColor: 'grey',
        marginTop: 20,
    },
    point: {
        borderRadius: 10,
        backgroundColor: 'blue',
        position: 'absolute',
    },
    button: {
        width: 150,
        marginHorizontal: 10,
    },

});

export default EditCoordinateScreen;
