import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, ActivityIndicator } from 'react-native';
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
  const [googleLoading, setGoogleLoading] = useState(false); // Google loading state
  const { t } = useTranslation();

  const { register, signInWithGoogle } = useContext(AuthContext); // Added signInWithGoogle

  const [topPadding, setTopPadding] = useState(5);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTopPadding(48);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setTopPadding(1);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const validateFirstName = (name) => {
    return /^[A-Za-z]{2,10}$/.test(name);
  };

  const validateLastName = (name) => {
    return /^[A-Za-z]{2,10}$/.test(name);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhoneNumber = (number) => {
    return /^[0-9]{9,15}$/.test(number);
  };

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{12,20}$/.test(password);
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    if (!validateFirstName(firstName)) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: 'First name must be between 2 and 10 letters',
      });
      return;
    }

    if (!validateLastName(lastName)) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: 'Last name must be between 2 and 10 letters',
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: 'Please enter a valid email address',
      });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: 'Phone number must be between 9 and 15 digits',
      });
      return;
    }

    if (!validatePassword(password)) {
      Toast.show({
        type: 'error',
        text1: 'Password must be 12-20 chars long, with at least:',
        text2: 'one uppercase letter, one lowercase letter and one number.',
        visibilityTime: 8000,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: 'Passwords do not match',
      });
      return;
    }

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
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Google Sign-In Error',
        text2: error.message,
      });
    } finally {
      setGoogleLoading(false);
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
            {/* <SocialButton
              buttonTitle={t("Sign In with Facebook")}
              btnType="facebook"
              color="#4867aa"
              backgroundColor="#e6eaf4"
              onPress={() => {}}
            /> */}
            {googleLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <SocialButton
                buttonTitle={t("Sign In with Google")}
                btnType="google"
                color="#de4d41"
                backgroundColor="#f5e7ea"
                onPress={handleGoogleSignIn}
              />
            )}
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
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  orRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingRight: 11,
    paddingLeft: 11,
    marginTop: 10,
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 20,
  },
});
