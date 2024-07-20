import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Keyboard, Alert, ActivityIndicator } from 'react-native';
import FormInput from '../../components/formButtonsAndInput/FormInput';
import FormButton from '../../components/formButtonsAndInput/FormButton';
import SocialButton from '../../components/formButtonsAndInput/SocialButton';
import { AuthContext } from '../../navigation/AuthProvider';
import { COLORS } from '../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const { register } = useContext(AuthContext);
  const [topPadding, setTopPadding] = useState(5); // Initial top padding

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTopPadding(48); // Update top padding when keyboard is shown
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTopPadding(1); // Reset top padding when keyboard is hidden
      }
    );

    // Cleanup function to remove listeners
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'Registration Error',
          text2: 'Please fill in all fields',
        });
    } else if (password !== confirmPassword) {
        Toast.show({
          type: 'error',
          text1: 'Registration Error',
          text2: 'Passwords do not match',
        });
    } else {
        setLoading(true);
        try {
            await register(email, password, {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber
            });
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Account created successfully.',
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Registration Error',
                text2: error.message,
            });
        } finally {
            setLoading(false);
        }
    }
  };

  return (
    <View style={[styles.outerContainer, { paddingTop: topPadding }]}>
      <ScrollView>
        <View style={styles.container}>

          <Text style={styles.text}>{t('Sign up')}</Text>
          
          <FormInput
            placeHolderText={t("First Name")}
            iconType="id-card"
            labelValue={firstName}
            onChangeText={(firstName) => setFirstName(firstName)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput
            placeHolderText={t("Last Name")}
            iconType="id-card"
            labelValue={lastName}
            onChangeText={(lastName) => setLastName(lastName)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput
            placeHolderText={t("Email")}
            iconType="email"
            keyboardType="email-address"
            labelValue={email}
            onChangeText={(userEmail) => setEmail(userEmail)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput
            placeHolderText={t("Phone Number")}
            iconType="phone"
            keyboardType="phone-pad"
            labelValue={phoneNumber}
            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormInput
            placeHolderText={t("Password")}
            iconType="lock"
            labelValue={password}
            onChangeText={(userPassword) => setPassword(userPassword)}
            secureTextEntry={true}
          />

          <FormInput
            placeHolderText={t("Confirm Password")}
            iconType="lock-check"
            labelValue={confirmPassword}
            onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
            secureTextEntry={true}
          />

          <View style={styles.textPrivate}>
              <Text style={styles.color_textPrivate}>{t('By registering, you confirm that you accept our')}{' '}</Text>
              <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
                  <Text style={[styles.color_textPrivate, {color: '#e88832'}, {fontWeight:'bold'}]}>{t('Terms of service')}</Text>
              </TouchableOpacity>
              <Text style={styles.color_textPrivate}> {t('and')} </Text>
              <Text style={[styles.color_textPrivate, {color: '#e88832'}, {fontWeight:'bold'}]}>{t('Privacy Policy')}</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <FormButton
              buttonTitle={t("Sign up")}
              onPress={handleSignUp}
            />
          )}

          <View style={styles.orRowContainer}>
            <View style={styles.line}></View>
            <Text style={styles.orText}>{t('or')}</Text>
            <View style={styles.line}></View>
          </View>

          <View style={styles.SocialButtonContainer}>
              <SocialButton
                  buttonTitle={t("Sign In with Facebook")}
                  btnType="facebook"
                  color="#4867aa"
                  backgroundColor="#e6eaf4"
                  onPress={() => {}}
              />
              <SocialButton
                  buttonTitle={t("Sign In with Google")}
                  btnType="google"
                  color="#de4d41"
                  backgroundColor="#f5e7ea"
                  onPress={() => {}}
              />
          </View>

          <View style={styles.createAccountContainer}>
            <Text style={{ color: COLORS.black, fontWeight: 'bold', fontSize: 16 }}>{t('Already have an account?')}</Text>
            <TouchableOpacity>
              <Text style={{ color: '#6ee7f0', fontWeight: 'bold', fontSize: 16 }} onPress={() => navigation.navigate('Login')}>{t('Sign in')}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    borderBottomWidth: 0, // Add bottom border
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: COLORS.white, // Border color
    shadowColor: COLORS.black, // Shadow color
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
    fontSize: 28,
    marginBottom: 5,
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
    padding:5,
    paddingRight: 11,
    paddingLeft: 11,
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
    marginVertical: 5,
    justifyContent: 'center',
    width: '95%',
    
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    color: 'grey',
  },
  SocialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust as needed
    paddingHorizontal: 20, // Adjust as needed
    gap:20,
  },
});
