import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator'
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store/store';
import { Provider as PaperProvider } from 'react-native-paper';
import './src/constants/IMLocalize';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </PersistGate>
    </Provider>
  )
};
