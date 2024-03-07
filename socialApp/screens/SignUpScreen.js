import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';

const SignUpScreen = ({ navigation }) => {
  const[firstName, setFirstName] = useState('');
  const[lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const[phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>

        <Text style={styles.text}>Sign up</Text>
        
        <FormInput
          placeHolderText="Fisrt Name"
          iconType="id-card"
          labelValue={firstName}
          onChangeText={(firstName) => setEmail(setFirstName)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          placeHolderText="Last Name"
          iconType="id-card"
          labelValue={lastName}
          onChangeText={(lastName) => setLastName(lastName)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          placeHolderText="Email"
          iconType="email"
          keyboardType="email-address"
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          placeHolderText="Phone Number"
          iconType="phone"
          keyboardType="phone-pad"
          labelValue={phoneNumber}
          onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          placeHolderText="Password"
          iconType="lock"
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          secureTextEntry={true}
        />

        <FormInput
          placeHolderText="Confirm Password"
          iconType="lock-check"
          labelValue={confirmPassword}
          onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
          secureTextEntry={true}
        />

        <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>By registering, you confirm that you accept our{' '}</Text>
            <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
                <Text style={[styles.color_textPrivate, {color: '#e88832'}, {fontWeight:'bold'}]}>Terms of service</Text>
            </TouchableOpacity>
            <Text style={styles.color_textPrivate}> and </Text>
            <Text style={[styles.color_textPrivate, {color: '#e88832'}, {fontWeight:'bold'}]}>Privacy Policy</Text>
        </View>

        <FormButton
          buttonTitle="Sign up"
          onPress={() => alert('Sign Up Clicked')}
        />

        <View style={styles.orRowContainer}>
          <View style={styles.line}></View>
          <Text style={styles.orText}>or</Text>
          <View style={styles.line}></View>
        </View>

        <View style={styles.SocialButtonContainer}>
            <SocialButton
                buttonTitle="Sign In with Facebook"
                btnType="facebook"
                color="#4867aa"
                backgroundColor="#e6eaf4"
                onPress={() => {}}
            />
            <SocialButton
                buttonTitle="Sign In with Google"
                btnType="google"
                color="#de4d41"
                backgroundColor="#f5e7ea"
                onPress={() => {}}
            />
        </View>

        <View style={styles.createAccountContainer}>
          <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>Already have an account? </Text>
          <TouchableOpacity>
            <Text style={{ color: '#6ee7f0', fontWeight: 'bold', fontSize: 16 }} onPress={() => navigation.navigate('Login')}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingTop: 5,
    borderBottomWidth: 0, // Add bottom border
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: '#fff', // Border color
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.1, // Shadow opacity (0 to 1)
    shadowRadius: 3, // Shadow radius
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  createAccountContainer: {
    flexDirection: 'row', // Arrange children horizontally
    marginTop: 20, // Add some margin to separate from the button
    justifyContent: 'center', // Center the items horizontally
  },
  orRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:12,
    marginTop:10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
  },
  orText: {
    width: 50,
    textAlign: 'center',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'center',
    width: '95%',
    
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Roboto',
    color: 'grey',
  },
  SocialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust as needed
    paddingHorizontal: 20, // Adjust as needed
    gap:20,
  },
});
