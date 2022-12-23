import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from './Loader';
import CustomText from './Text/CustomText';

const ViewFloorplan = (props: any) => {

    const photoUrl = props.photoUrl;

    const [isLoading, setIsLoading] = useState(true);
    const [conWidth, setConWidth] = useState(0);
    const [winWidth, setWinWidth] = useState(0);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        // To get the width of the window to Cal size of point
        const win = Dimensions.get('window');
        setWinWidth(win.width);

        // Set Photo URL
        if (photoUrl !== null && !photoUrl?.includes('default_empty_image.jpeg')) {
            setImageUrl(photoUrl)
        } else {
            setImageUrl('');
            setIsLoading(false);
            return
        }

    }, [photoUrl]);


    // To get the width of the image container
    const onLayout = useCallback(({ nativeEvent: { layout: { width, height } } }) => {
        setConWidth(width);

    }, []);

    function calCoordinate(coordinate: number) {
        return (coordinate / 1000) * conWidth;
    };

    function pointSizer(winWidth: number) {
        if (winWidth > 400) {
            return 18;
        } else if (winWidth > 250) {
            return 13;
        } else {
            return 12;
        }
    }

    const BlinkingFire = () => {
        const [showPoint, setShowPoint] = useState(true);

        useEffect(() => {
            // Change the state every second or the time given by User.
            const interval = setInterval(() => {
                setShowPoint((showPoint) => !showPoint);
            }, 500);
            return () => clearInterval(interval);
        }, []);

        return (

            <Ionicons name={"location-sharp"} color={"red"} size={32} style={
                {
                    position: 'absolute',
                    top: props.y_coordinate ? calCoordinate(props.y_coordinate) - 28 : 0,
                    left: calCoordinate(props.x_coordinate) - 16 || 0,
                    opacity: showPoint ? 0 : 100,
                }
            } />
        )
    }

    // Below for testing purpose
    // useEffect(() => {
    //     if (props) {
    //         console.log("View Floorplan")
    //         console.log(props.name)
    //         console.log('Y coordinate: ', props.y_coordinate / 1000 * conWidth);
    //         console.log('X coordinate: ', props.x_coordinate / 1000 * conWidth);
    //     };

    // }, [props])

    return (
        <View style={styles.container}>

            <View style={styles.imageContainer} onLayout={onLayout}>

                {isLoading && photoUrl !== undefined && <Loader />}

                {imageUrl != '' && photoUrl !== undefined && <ImageBackground
                    style={[{ width: conWidth, height: conWidth }]}
                    resizeMode='contain'
                    source={{ uri: imageUrl }}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setImageUrl(''),
                        setIsLoading(false)
                    }}
                >

                    {props.onOffStatus === 'drill' || props.onOffStatus === 'alarm' ?

                        <BlinkingFire />

                        :

                        <View style={[
                            styles.point,
                            {
                                position: 'absolute',
                                top: calCoordinate(props.y_coordinate) - (pointSizer(winWidth) / 2) || 0,
                                left: calCoordinate(props.x_coordinate) - (pointSizer(winWidth) / 2) || 0,
                                // backgroundColor: 'green',
                                // width: pointSizer(winWidth),
                                // height: pointSizer(winWidth),
                                opacity: props.y_coordinate ? 100 : 0
                            }
                        ]}>
                             <View style={{
                                        right:5,
                                        bottom:20,
                                        
                                    }}>

                                    <Ionicons name={"location-sharp"} color={props.onOffStatus == "Normal" ? "green" : "purple"} size={32}>
                                    </Ionicons>
                                    </View>
                        </View>
                    }

                </ImageBackground>}

            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    imageContainer: {
        width: '100%',
        // backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    point: {
        borderRadius: 30,
        position: 'absolute',
    },
    imageLoadContainer: {
        marginTop: 15,
        padding: 50,
        borderWidth: 1,
        borderColor: '#c5c5c5',
        width: '90%',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }

});

export default ViewFloorplan;