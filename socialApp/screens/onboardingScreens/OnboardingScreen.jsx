import React from 'react';
import {View, Text, Button, Image, TouchableOpacity, StyleSheet} from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';
import {COLORS} from '../../styles/colors';

const Done = ({... props}) => (
    <TouchableOpacity 
        style={{marginHorizontal:8}}
        {... props}
    ><Text style={{fontSize:16, marginHorizontal:8, color: COLORS.black }}>Done</Text></TouchableOpacity>
);

const OnboardingScreen = ({navigation}) => {
    return (
        <Onboarding
        DoneButtonComponent={Done}
        onSkip={() => navigation.replace("Login")}
        onDone={() => navigation.navigate("Login")}
        pages={[
            {
            backgroundColor: '#e9bcbe',
            image: <Image source={require('../../assets/Images/onboarding-img1.png')} />,
            title: 'Connect to our Awesome Community',
            subtitle: 'A New Way to Save Food from Wasting',
            },
            {
            backgroundColor: '#fdeb93',
            image: <Image source={require('../../assets/Images/onboarding-img2.png')} />,
            title: 'Share Your Food',
            subtitle: 'Share your Surplus Food',
            },
            {
            backgroundColor: '#a6e4d0',
            image: <Image source={require('../../assets/Images/onboarding-img3.png')} />,
            title: 'Become An Advertising Star',
            subtitle: 'Be One of the Food Rescuer to Reducing Food Waste',
            },
        ]}
        />
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default OnboardingScreen;
