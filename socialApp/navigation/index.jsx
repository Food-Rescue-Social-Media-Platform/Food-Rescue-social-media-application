import React from "react";
import Routes from './Routes';
import { AuthProvider } from "./AuthProvider";
import { Provider } from 'react-redux';
import {AppRegistry} from 'react-native';
import {name} from '../app.json';



const Providers = () => {    
    return (
        <Provider store={storePersist}>
                 <AuthProvider>
                       <Routes />
                 </AuthProvider>
        </Provider>
        );
    }
    
AppRegistry.registerComponent(name, () => Providers);
export default Providers;


