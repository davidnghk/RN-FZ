import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from 'react-native';
import {RootState} from '../../store/store';
import CustomText from '../../components/Text/CustomText';
import CustomButton from '../../components/CustomButton';
import COLOR from '../../constants/Theme/color';

import {useDispatch, useSelector} from 'react-redux';

import {useTranslation} from 'react-i18next';
import Card from '../../components/Elements/Card';
import {
  getTranslateType,
  dialCall,
  formatDateTime,
} from '../../utils/resuableMethods';
import {fetchAlert} from '../../store/actions/alerts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {updateAlertDetails} from '../../store/actions/alerts';

const Row = (props: any) => {
  return (
    <View style={styles.row}>
      <CustomText style={styles.label}>{props.label}</CustomText>
      <CustomText style={styles.content}>{props.content}</CustomText>
    </View>
  );
};

const Label = (props: any) => {
  return (
    <CustomText style={{...{fontWeight: 'bold', width: '35%'}, ...props.style}}>
      {props.children}
    </CustomText>
  );
};

//@ts-ignore
const EditAlertScreen = (props: any) => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const alert = props.route.params.alert;
  const navigation = props.navigation;
  const thing = useSelector((state: RootState) => state.things.things).find(
    thing => thing.id === alert.thing_id,
  );
  const icon = useSelector((state: RootState) => state.icons.icons).find(
    icon => icon.id === thing?.icon_id,
  );
  const isLoading = useSelector((state: RootState) => state.alerts.isLoading);

  const [details, setDetails] = useState(alert.details ? alert.details : '');
  const [photo, setPhoto] = useState(null || {});
  const [showUploadContainer, setShowUploadContainer] = useState(false);

  const [getphoto, setGetPhoto] = useState(
    alert.photo_url ? alert.photo_url : '',
  );
  const [showGetPhoto, setShowGetPhoto] = useState(
    alert.photo_url ? true : false,
  );

  const onRefresh = () => {
    dispatch(fetchAlert(alert.id));
  };

  const toggleUploadSwitch = () => {
    setShowUploadContainer(showUploadContainer => !showUploadContainer);

    if (showUploadContainer === true) {
      // setPhoto({});
    }

    if (showUploadContainer === false) {
      setPhoto({});
    }
  };

  useEffect(() => {
    console.log('This is showUploadContainer', showUploadContainer);

    if (showUploadContainer === true) {
      setShowGetPhoto(false);
    }
    if (showUploadContainer === false && getphoto != '') {
      setShowGetPhoto(true);
    }
  });

  const handleChoosePhoto = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        return;
      }

      if (response.assets) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const handleTakePhoto = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        return;
      }

      if (response.assets) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const saveFormHandler = () => {
    var dataEdit = new FormData();
    dataEdit.append('details', details);

    if (showUploadContainer) {
      dataEdit.append('photo', {
        name: photo.fileName,
        uri: photo.uri,
        type: photo.type,
      });
    }

    dispatch(updateAlertDetails(alert.id, dataEdit));
  };

  return (
    <ScrollView
      style={{backgroundColor: COLOR.bgColor}}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }>
      {!thing && (
        <View
          style={{
            height: 500,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomText style={{fontWeight: 'bold', textAlign: 'center'}}>
            {t('sentence:deviceHasNotBeenRegistered')}
          </CustomText>
          <CustomButton
            onPress={() => {
              navigation.navigate('Alerts', {screen: 'AlertsScreen'});
            }}>
            Back
          </CustomButton>
        </View>
      )}

      {thing && (
        <Card style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.imageCol}>
              {/* {icon && <Image style={styles.image} source={productIcons[thing.icon_id]} />} */}
              {icon && (
                <Image style={styles.image} source={{uri: thing?.icon_url}} />
              )}
            </View>

            <View style={styles.textCol}>
              <CustomText style={styles.title}>{alert?.thing_name}</CustomText>
              <CustomText>{icon?.name}</CustomText>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <Row label={t('common:model')} content={icon?.code} />
            <Row label={t('common:code')} content={alert?.thing_code} />
            <Row
              label={t('common:alertType')}
              content={getTranslateType(alert?.alert_type)}
            />
            <Row
              label={t('common:status')}
              content={
                alert?.status === 'Clear' ? t('common:clear') : t('common:set')
              }
            />
            <Row
              label={t('common:startTime')}
              content={formatDateTime(alert?.start_datetime)}
            />
            <Row
              label={t('common:endTime')}
              content={
                alert?.end_datetime
                  ? formatDateTime(alert?.end_datetime)
                  : t('common:null')
              }
            />
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <View style={styles.textInputContainer}>
                  <TextInput
                    placeholder={t('form:details')}
                    numberOfLines={3}
                    multiline={true}
                    autoCapitalize="none"
                    value={details}
                    style={{height: 70}}
                    onChangeText={text => setDetails(text)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <Label>{t('form:uploadAlertPhoto')}</Label>
              <View style={styles.inputContainer}>
                <Switch
                  trackColor={{false: '#767577', true: COLOR.primaryColor}}
                  thumbColor={showUploadContainer ? 'white' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleUploadSwitch}
                  value={showUploadContainer}
                />

                <CustomText>
                  {showUploadContainer ? t('buttons:yes') : t('buttons:no')}
                </CustomText>
              </View>
            </View>

            {showGetPhoto && (
              <View style={styles.photoContainer}>
                <Image
                  source={{uri: getphoto}}
                  style={{
                    height: 300,
                    resizeMode: 'contain',
                    backgroundColor: '#d9d9d9',
                  }}
                />
              </View>
            )}

            {showUploadContainer && (
              <View style={styles.uploadImageContainer}>
                {Object.keys(photo).length == 0 ? (
                  <View style={styles.photoOptionsContainer}>
                    <TouchableOpacity
                      style={styles.uploadPhotoButton}
                      onPress={() => {
                        handleChoosePhoto();
                      }}>
                      <Ionicons
                        name="cloud-upload-outline"
                        color="white"
                        size={30}
                        style={{width: 26 - 32}}
                      />
                      <CustomText style={{textAlign: 'center', color: 'white'}}>
                        {t('form:pressToUploadAlertPhoto')}
                      </CustomText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.launchCameraButton}
                      onPress={() => {
                        handleTakePhoto();
                      }}>
                      <Ionicons
                        name="camera-outline"
                        color="white"
                        size={30}
                        style={{width: 26 - 32}}
                      />
                      <CustomText style={{color: 'white'}}>
                        {t('form:takePhoto')}
                      </CustomText>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Image
                    source={{uri: photo.uri}}
                    style={{
                      height: 300,
                      resizeMode: 'contain',
                      backgroundColor: '#d9d9d9',
                    }}
                  />
                )}
              </View>
            )}

            {/* <Row label={t('common:location')} content={`Block 01 ( ${thing?.x_coordinate}, ${thing?.y_coordinate} )`} /> */}
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              style={{width: 150}}
              onPress={() => {
                saveFormHandler();
              }}>
              {t('buttons:save')}
            </CustomButton>
          </View>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  card: {
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageCol: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCol: {
    width: '75%',
    paddingHorizontal: 5,
    flexShrink: 1,
  },
  image: {
    width: '100%',
    height: 80,
    resizeMode: 'contain',
  },
  detailsContainer: {
    marginTop: 20,
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontWeight: 'bold',
    width: '35%',
  },
  content: {
    width: '62%',
  },
  title: {
    fontWeight: 'bold',
  },
  emergencyCallButton: {
    backgroundColor: '#DC143C',
    width: '100%',
    height: 60,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  emergencyCallButtonText: {
    color: 'white',
    //fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  inputContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  textInputContainer: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: '#d9d9d9',
    paddingLeft: 5,
  },
  uploadImageContainer: {
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dotted',
  },
  photoOptionsContainer: {
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  uploadPhotoButton: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: COLOR.primaryColor,
  },
  launchCameraButton: {
    width: '90%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: COLOR.primaryColor,
  },
  photoContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dotted',
  },
});

export default EditAlertScreen;
