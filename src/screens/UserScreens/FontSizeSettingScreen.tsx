import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUserFontSizeSetting } from '../../store/actions/user';
import { RootState } from '../../store/store';
import Slider from '@react-native-community/slider';
import COLOR from '../../constants/Theme/color';

// Components
import CustomText from '../../components/Text/CustomText';
import CustomTitle from '../../components/Text/CustomTitle';

const FontSizeSettingScreen = () => {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const sizeSetting = useSelector((state: RootState) => state.user.fontSizeSetting);
  const [fontSize, setFontSize] = useState(0)

  // const SIZES = [
  //   { code: 'size1', label: t('common:superSmall') },
  //   { code: 'size2', label: t('common:small') },
  //   { code: 'size3', label: t('common:medium') },
  //   { code: 'size4', label: t('common:large') },
  //   { code: 'size5', label: t('common:superLarge') },
  // ];

  // Set the value for slider bar
  useEffect(() => {
    switch (sizeSetting) {
      case 'size1':
        return setFontSize(1)
      case 'size2':
        return setFontSize(2)
      case 'size3':
        return setFontSize(3)
      case 'size4':
        return setFontSize(4)
      case 'size5':
        return setFontSize(5)
    }

  }, [sizeSetting])

  const valueHandler = (val: any) => {

    switch (val) {
      case 1:
        return dispatch(setUserFontSizeSetting('size1'));
      case 2:
        return dispatch(setUserFontSizeSetting('size2'));
      case 3:
        return dispatch(setUserFontSizeSetting('size3'));
      case 4:
        return dispatch(setUserFontSizeSetting('size4'));
      case 5:
        return dispatch(setUserFontSizeSetting('size5'));
    }
  }

  return (
    <View style={styles.screen}>

      <View style={styles.wordsContainer}>
        <CustomTitle style={styles.title}>{t('sentence:selectFontSize')}</CustomTitle>

        <View style={styles.articleContainer}>
          <CustomText>FireAlert is a new-generation of Fire Alarm Management System (FAMS), based on the new-generation of wireless Internet of Things (IoT) and LoraWAN-based sensors, to provide long-range, low-power implementation.</CustomText>
        </View>

      </View>

      {/* {SIZES.map(size => {
        const selectedSize = size.code === sizeSetting;

        return (
          <TouchableOpacity
            key={size.code}
            style={[selectedSize ? styles.selectedPressableContainer : styles.pressableContainer]}
            disabled={selectedSize}
            onPress={() => { dispatch(setUserFontSizeSetting(size.code)) }}
          >
            <CustomText >
              {size.label}
            </CustomText>
          </TouchableOpacity>
        );
      })} */}

      <View style={styles.sliderContainer}>
        <Text style={{ fontSize: 14, marginRight: 15 }}>{t('common:small')}</Text>

        <Slider
          style={{ width: 200, height: 100 }}
          minimumValue={1}
          maximumValue={5}
          minimumTrackTintColor={COLOR.primaryColor}
          maximumTrackTintColor="#000000"
          thumbTintColor="white"
          onValueChange={(val) => valueHandler(val)}
          // onSlidingComplete={(val) => valueHandler(val)}
          step={1}
          value={fontSize}
        />

        <Text style={{ fontSize: 19.6, marginLeft: 15 }}>{t('common:large')}</Text>
      </View>

    </View>

  )
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.bgColor,
  },
  wordsContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  articleContainer: {
    marginVertical: 20,
    paddingHorizontal: 30
  },
  pressableContainer: {
    backgroundColor: 'white',
    width: '80%',
    height: 50,
    marginVertical: 5,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 5,

  },
  selectedPressableContainer: {
    backgroundColor: COLOR.primaryColor,
    width: '80%',
    height: 50,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default FontSizeSettingScreen;