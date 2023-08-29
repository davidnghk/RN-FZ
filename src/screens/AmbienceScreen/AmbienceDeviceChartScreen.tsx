import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryZoomContainer, Background } from "victory-native";
import CustomText from '../../components/Text/CustomText';
import CustomTitle from '../../components/Text/CustomTitle';
import COLOR from '../../constants/Theme/color';
import { RootState } from '../../store/store';
import { getTitleForAmbienceScreen } from '../../utils/resuableMethods';

//@ts-ignore
const AmbienceChartScreen = ({ route, navigation }) => {

    const { t } = useTranslation();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const { title, id, } = route.params;
    const dataSetName = title + 'Data';

    //@ts-ignore
    const chartData = useSelector((state: RootState) => state.ambience.ambienceDevicesDataSet.find((dataset) => dataset.id === id)?.dataSet[dataSetName]['data']);
    //@ts-ignore
    const chartMinMax = useSelector((state: RootState) => state.ambience.ambienceDevicesDataSet.find((dataset) => dataset.id === id))?.dataSet[dataSetName]['minMax'];


    const getMin = (title: string) => {

        if (chartMinMax.min <= 0) {
            return 0
        } else if (title === 'hcho') {
            return chartMinMax.min - 0.01
        } else {
            return chartMinMax.min - 1
        }

    }

    const getMax = (title: string) => {

        if (title === 'hcho') {
            return chartMinMax.max + 0.01
        } else {
            return chartMinMax.max + 1
        }
    }

    return (
        <View style={styles.screen}>

            <CustomTitle style={styles.title}>{getTitleForAmbienceScreen(title)}</CustomTitle>

            {chartData.length > 0 ?

                <View style={styles.chartContainer}>

                    <VictoryChart theme={VictoryTheme.material}
                        width={windowWidth * 0.95}
                        height={windowHeight * 0.65}
                        // minDomain={{ y: chartMinMax.min <= 0 ? 0 : chartMinMax.min - 1 }}
                        // maxDomain={{ y: chartMinMax.max + 1 }}
                        minDomain={{ y: getMin(title) }}
                        maxDomain={{ y: getMax(title) }}
                        containerComponent={
                            <VictoryZoomContainer />
                        }
                    >
                        <VictoryAxis dependentAxis />

                        <VictoryAxis
                            fixLabelOverlap

                            style={{ tickLabels: { padding: 15, fontSize: 9 } }}
                        />

                        <VictoryLine
                            style={{
                                data: { stroke: COLOR.lineColor },
                                parent: { border: "1px solid #ccc" },
                            }}
                            //data={chartData}
                            data={[
                                { x: 1, y: 2 },
                                { x: 2, y: 3 },
                                { x: 3, y: 5 },
                                { x: 4, y: 4 },
                                { x: 5, y: 6 }
                              ]}
                        />

                    </VictoryChart>

                </View> :

                <View style={{ marginVertical: 20 }}>
                    <CustomText>{t('sentence:noRecentData')}</CustomText>
                </View>
            }

        </View >
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.bgColor,
    },
    chartContainer: {
        width: '100%',
        backgroundColor: COLOR.lineChartBgColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        marginBottom: 10,
    }
});

export default AmbienceChartScreen;