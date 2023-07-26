import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Loader from './Loader';
import CustomText from './Text/CustomText';

const ViewMasterFloorplan = (props: any) => {

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
        // if (winWidth > 400) {
        //     return 18;
        // } else if (winWidth > 250) {
        //     return 13;
        // } else {
        //     return 12;
        // }

        return 18
    }

    // Below for testing purpose
    // useEffect(() => {
    //     if (props.things) {
    //         for (let thing of props.things) {
    //             console.log(thing.name)
    //             console.log('Y coordinate: ', thing.y_coordinate / 1000 * conWidth);
    //             console.log('X coordinate: ', thing.x_coordinate / 1000 * conWidth);
    //         }

    //     };

    // }, [props])

    return (
        <View style={styles.container}>

            <View style={styles.imageContainer} onLayout={onLayout}>

                {isLoading && <Loader />}

                {imageUrl != '' && <ImageBackground
                    style={[{ width: conWidth, height: conWidth }]}
                    resizeMode='contain'
                    source={{ uri: imageUrl }}
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setImageUrl(''),
                            setIsLoading(false)
                    }}
                >

                    {props.things.map((thing: { id: React.Key | null | undefined; onoff_status: string; y_coordinate: number; x_coordinate: number; }) => (
                        <View key={`${thing.id}${Date.now()}`}>
                            {thing.onoff_status === 'drill' || thing.onoff_status === 'alarm' ?
                                <TouchableOpacity
                                    style={
                                        {
                                            position: 'absolute',
                                            top: calCoordinate(thing.y_coordinate) - 16 || 0,
                                            left: calCoordinate(thing.x_coordinate) - 16 || 0,
                                        }}
                                    onPress={() => {
                                        props.navigation.navigate('ThingDetailsScreen', {
                                            id: thing.id
                                        })
                                    }}>
                                        <View style={{
                                        right:5,
                                        bottom:40,
                                        
                                    }}>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: "white",
                                                borderColor: "black",
                                                borderStyle: "solid",
                                                borderWidth: 1,

                                            }}>
                                            <CustomText>{thing.name}</CustomText>

                                        </TouchableOpacity> 
                                    <MaterialIcons name={"location-on"} color={"red"} size={32}>
                                    </MaterialIcons>
                                    </View>
                                </TouchableOpacity>

                                :
                                    
                                <TouchableOpacity
                                    style={[
                                        styles.point,
                                         {
                                           position: 'absolute',
                                           top: calCoordinate(thing.y_coordinate) - (pointSizer(winWidth) / 2) || 0,
                                           left: calCoordinate(thing.x_coordinate) - (pointSizer(winWidth) / 2) || 0,
                                            //  backgroundColor: 'blue',
                                            //  width: pointSizer(winWidth),
                                            //  height: pointSizer(winWidth),
                                             opacity: thing.y_coordinate ? 100 : 0,
                                        }
                                    ]}

                                    

                                    onPress={() => {
                                            props.navigation.navigate('ThingDetailsScreen', {
                                                id: thing.id
                                            })
                                    }}
                                >
                                    <View style={{
                                        right:5,
                                        bottom:40,
                                        
                                    }}>
                                        <TouchableOpacity
                                            style={{
                                                backgroundColor: "white",
                                                borderColor: "black",
                                                borderStyle: "solid",
                                                borderWidth: 1,

                                            }}>
                                            <CustomText>{thing.name}</CustomText>

                                        </TouchableOpacity> 
                                    <MaterialIcons name={"location-on"} color={thing.onoff_status == "Normal" ? "green" : "blue"} size={32}>
                                    </MaterialIcons>
                                    </View>
                                    
                                </TouchableOpacity>
                            }
                        </View>
                    ))}
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

export default ViewMasterFloorplan;