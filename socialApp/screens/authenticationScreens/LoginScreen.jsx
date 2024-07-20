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
  const { login } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleLogin = async () => {
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

  return (
    <View style={styles.outerContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={require('../../assets/Images/PhoneAuthLogo.png')}
            style={styles.logo}
          />
          <Text style={styles.text}>{t('Sign in')}</Text>
          <Text style={{ paddingBottom: 10 }}>{t('Rescue The Food From Wasting')}</Text>
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
              <SocialButton
                  buttonTitle={t("Sign In with Google")}
                  btnType="google"
                  color="#de4d41"
                  backgroundColor="#f5e7ea"
                  onPress={() => {}}
              />
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
    width: '95%', // Set the width to 95% of the screen
    alignItems: 'flex-end', // Align items to the right
    color: '#34ebde',
    paddingBottom: 8,
    paddingTop: 10,
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
  SocialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust as needed
    paddingHorizontal: 20, // Adjust as needed
    gap:20,
  },
});
