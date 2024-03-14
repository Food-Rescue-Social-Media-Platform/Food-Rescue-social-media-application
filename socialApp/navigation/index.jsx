import React from "react";
import Routes from './Routes';
import { AuthProvider } from "./AuthProvider";
import { Provider } from 'react-redux';
import {AppRegistry} from 'react-native';
import {name as appName} from '../app.json';
import store from '../redux/store'; 
import App from '../App';

const Providers = () => {    
    return (
        <Provider store={store}>
        <AuthProvider>
        <Routes />
        </AuthProvider>
        </Provider>
        );
    }
    
AppRegistry.registerComponent(appName, () => Providers);
export default Providers;


