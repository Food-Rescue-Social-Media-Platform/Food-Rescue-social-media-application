import React from "react";
import Routes from './Routes';
import { AuthProvider } from "./AuthProvider";
import { Provider } from 'react-redux';
import {AppRegistry} from 'react-native';
import {name} from '../app.json';
import store from "../redux/store";


const Providers = () => {    
    return (
        <Provider store={store}>
                 <AuthProvider>
                       <Routes />
                 </AuthProvider>
        </Provider>
        );
    }
    
AppRegistry.registerComponent(name, () => Providers);
export default Providers;


