import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CustomText from '../../components/Text/CustomText';
import CustomButton from '../../components/CustomButton';
import Loader from '../../components/Loader';
import COLOR from '../../constants/Theme/color';
import {RootState} from '../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {getAllAccounts, switchAccount} from '../../store/actions/account';

const Label = (props: any) => {
  return (
    <CustomText style={{...{fontWeight: 'bold', width: '35%'}, ...props.style}}>
      {props.children}
    </CustomText>
  );
};

//@ts-ignore
const SwitchAccountScreen = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const user = useSelector((state: RootState) => state.user.user);
  const accounts = useSelector((state: RootState) => state.account.accounts);
  const isLoading = useSelector((state: RootState) => state.things.isLoading);

  const [selectedAccountId, setSelectedAccountId] = useState<null | number>(
    user.default_account_id,
  );

  function updateAccountHandler() {
    if (!user?.id || !selectedAccountId) {
      return;
    }

    dispatch(switchAccount(user.id, selectedAccountId));
  }

  useEffect(() => {
    dispatch(getAllAccounts());
  }, [dispatch]);

  return (
    <TouchableWithoutFeedback style={styles.screen} onPress={Keyboard.dismiss}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={styles.container}>
          <View style={styles.row}>
            <Label>{t('common:account')}</Label>
          </View>

          <View style={[{...styles.row}]}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedAccountId}
                onValueChange={itemValue => [setSelectedAccountId(itemValue)]}
                style={styles.picker}
                itemStyle={styles.pickerItem}>
                <Picker.Item
                  key=""
                  label={`-- ${t('buttons:selectAccount')} --`}
                  value={null}
                  enabled={true}
                />

                {accounts &&
                  accounts.map(account => {
                    return (
                      <Picker.Item
                        label={account.name || ''}
                        value={account.id}
                        key={account.id}
                      />
                    );
                  })}
              </Picker>
            </View>
          </View>
        </View>

        {/* ********** Button Container ********** */}

        <View style={styles.bottomContainer}>
          {isLoading ? (
            <Loader />
          ) : (
            <View>
              <CustomButton
                onPress={() => {
                  updateAccountHandler();
                }}>
                {t('buttons:save')}
              </CustomButton>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: COLOR.bgColor,
    alignItems: 'center',
  },
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
  label: {
    width: '30%',
  },
  inputContainer: {
    width: '65%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  textInputContainer: {
    borderRadius: 8,
    width: '100%',
    height: 40,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingLeft: 5,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFDDDE',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: '90%',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'column',
  },
  button: {
    width: 150,
    marginHorizontal: 10,
  },
  pickerContainer: {
    width: '100%',
    // height: 100,
    height: Platform.OS === 'ios' ? 120 : 50,
    borderRadius: 5,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  pickerItem: {
    height: '100%',
    fontSize: 16,
  },
});

export default SwitchAccountScreen;
