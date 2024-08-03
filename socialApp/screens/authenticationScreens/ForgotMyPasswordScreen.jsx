import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import FormInput from '../../components/formButtonsAndInput/FormInput';
import FormButton from '../../components/formButtonsAndInput/FormButton';
import { AuthContext } from '../../navigation/AuthProvider';
import { COLORS } from '../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

const ForgotMyPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email address.',
      });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Recovery email sent successfully.',
      });
      setLoading(false);
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
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
          <Text style={styles.text}>{t('Forgot My Password')}</Text>
          <Text style={{ paddingBottom: 10 }}>{t('Enter your Email to continue')}</Text>
          <FormInput
            placeHolderText="Email"
            iconType="email"
            keyboardType="email-address"
            labelValue={email}
            onChangeText={(userEmail) => setEmail(userEmail)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.rememberPasswordButton}>
            <TouchableOpacity>
              <Text style={{ color: '#6ee7f0', fontWeight: 'bold', fontSize: 16 }} onPress={() => navigation.navigate('Login')}>{t('I remember my password')}</Text>
            </TouchableOpacity>
          </View>
          <FormButton
            buttonTitle={t("Send recovery mail")}
            onPress={handleForgotPassword}
          />
          {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
          <View style={styles.createAccountContainer}>
            <Text style={{ color: COLORS.black, fontWeight: 'bold', fontSize: 16 }}>{t('Dont have an account?')} </Text>
            <TouchableOpacity>
              <Text style={{ color: '#6ee7f0', fontWeight: 'bold', fontSize: 16 }} onPress={() => navigation.navigate('SignUp')}>{t('Sign up')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ForgotMyPasswordScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    paddingTop: 5,
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
  rememberPasswordButton: {
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
