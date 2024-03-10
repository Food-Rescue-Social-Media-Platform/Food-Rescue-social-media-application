import React, { useEffect, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import SingleChat from '../screens/chat/SingleChat';


const Routes = () => {
  // <AuthStack/>
  return(
    <NavigationContainer>
    <SingleChat/>
    </NavigationContainer>
    );
};

export default Routes;