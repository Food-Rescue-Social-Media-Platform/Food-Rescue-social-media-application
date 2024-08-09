import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import FormInput from '../../components/formButtonsAndInput/FormInput';
import FormButton from '../../components/formButtonsAndInput/FormButton';
import SocialButton from '../../components/formButtonsAndInput/SocialButton';
import { AuthContext } from '../../navigation/AuthProvider';
import { COLORS } from '../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // Add Google loading state
  const { login, signInWithGoogle } = useContext(AuthContext);
  const { t } = useTranslation();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields.',
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email address.',
      });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged in successfully.',
      });
      setLoading(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: error.message.includes('auth/invalid-credential') ? 'Invalid email or password.' : 'An error occurred.',
      });
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    await signInWithGoogle();
    setGoogleLoading(false);
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require('../../assets/Images/PhoneAuthLogo.png')}
            style={styles.logo}
          />
          <Text style={styles.text}>{t('Sign in')}</Text>
          <Text style={{ paddingBottom: 10 }}>{t('Rescue The Food From being wasted')}</Text>
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
            placeHolderText={t("Password")}
            iconType="lock"
            labelValue={password}
            onChangeText={(userPassword) => setPassword(userPassword)}
            secureTextEntry={true}
          />
          <View style={styles.forgotButton}>
            <TouchableOpacity>
              <Text style={{ color: '#6ee7f0', fontWeight: 'bold', fontSize: 16 }} onPress={() => navigation.navigate('ForgotMyPasswordScreen')}>{t('Forgot your Password ?')}</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <FormButton
              buttonTitle={t("Sign in")}
              onPress={handleLogin}
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
            <Text style={{ color: COLORS.black, fontWeight: 'bold', fontSize: 16 }}>{t('Dont have an account?')}</Text>
            <TouchableOpacity>
              <Text style={{ color: '#6ee7f0', fontWeight: 'bold', fontSize: 16 }} onPress={() => navigation.navigate('SignUp')}>{t('Sign up')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingTop: 10,
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
  logo: {
    height: 150,
    width: 190,
    resizeMode: 'cover',
    borderRadius: 100,
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  forgotButton: {
    width: '95%',
    alignItems: 'flex-end',
    color: '#34ebde',
    paddingBottom: 8,
    paddingTop: 10,
  },
  createAccountContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  orRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
  SocialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 20,
  },
});
