import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../reducer';
import storage from 'redux-persist/lib/storage' 


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const storePersist = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
});

export const persistor = persistStore(storePersist)