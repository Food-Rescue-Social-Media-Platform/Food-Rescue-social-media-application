import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reducer from "../reducer";


const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
});

export default store;