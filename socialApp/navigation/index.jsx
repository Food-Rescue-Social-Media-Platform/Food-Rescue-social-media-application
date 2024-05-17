import React from "react";
import Routes from './Routes';
import { AuthProvider } from "./AuthProvider";
import { Provider } from 'react-redux';
import {AppRegistry} from 'react-native';
import {name} from '../app.json';
import { storePersist, persistor } from "../redux/store/configurationStore"; 
import { PersistGate } from "redux-persist/integration/react";


const Providers = () => {    
    return (
        <Provider store={storePersist}>
             <PersistGate loading={null} persistor={persistor}>
                 <AuthProvider>
                       <Routes />
                 </AuthProvider>
            </PersistGate>
        </Provider>
        );
    }
    
AppRegistry.registerComponent(name, () => Providers);
export default Providers;


