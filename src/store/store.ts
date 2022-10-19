import { createStore, combineReducers, applyMiddleware, AnyAction } from 'redux';
import thunk, { ThunkDispatch as OldThunkDispatch } from 'redux-thunk';
import { alertsReducer, AlertsState } from './reducers/alerts';
import { thingsReducer, ThingsState } from './reducers/things';
import { authReducer, AuthState } from './reducers/auth';
import { userReducer, UserState } from './reducers/user';
import { iconsReducer, IconState } from './reducers/icons';
import { modalReducer, ModalState } from './reducers/modal';
import { accountReducer, AccountState } from './reducers/account';
import { ambienceReducer, AmbienceState } from './reducers/ambience';
import { locationsReducer, LocationsState } from './reducers/locations';
import { composeWithDevTools } from 'redux-devtools-extension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const thingsPersistConfig = {
  key: 'things',
  storage: AsyncStorage,
  whitelist: ['things']
};

const alertsPersistConfig = {
  key: 'alerts',
  storage: AsyncStorage,
  whitelist: ['allAlerts']
};

const iconsPersistConfig = {
  key: 'icons',
  storage: AsyncStorage,
  whitelist: ['icons']
};

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
  whitelist: ['user'],
}

const accountPersistConfig = {
  key: 'account',
  storage: AsyncStorage,
  whitelist: ['account'],
}

const ambiencePersistConfig = {
  key: 'ambience',
  storage: AsyncStorage,
  whitelist: ['ambienceDevices', 'ambienceDevicesDataSet'],
}

const locationsPersistConfig = {
  key: 'locations',
  storage: AsyncStorage,
  whitelist: ['locations'],
}

export type ThunkDispatch = OldThunkDispatch<RootState, null, AnyAction>;

export interface RootState {
  alerts: AlertsState,
  things: ThingsState,
  auth: AuthState,
  user: UserState,
  icons: IconState,
  account: AccountState,
  modal: ModalState,
  ambience: AmbienceState,
  locations: LocationsState,
};

// export const rootReducer = combineReducers<RootState>({
export const rootReducer = combineReducers({
  // alerts: alertsReducer,
  // things: thingsReducer,
  // user: userReducer,
  alerts: persistReducer(alertsPersistConfig, alertsReducer),
  things: persistReducer(thingsPersistConfig, thingsReducer),
  auth: authReducer,
  icons: persistReducer(iconsPersistConfig, iconsReducer),
  user: persistReducer(userPersistConfig, userReducer),
  account: persistReducer(accountPersistConfig, accountReducer),
  modal: modalReducer,
  ambience: persistReducer(ambiencePersistConfig, ambienceReducer),
  locations: persistReducer(locationsPersistConfig, locationsReducer),
});

const middlewareEnhancer = applyMiddleware(thunk);
const composedEnhancers = composeWithDevTools(middlewareEnhancer)

// const store = createStore(rootReducer, applyMiddleware(thunk));

export const store = createStore(rootReducer, composedEnhancers);
export const persistor = persistStore(store);