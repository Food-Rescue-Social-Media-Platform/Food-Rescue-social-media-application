import React, { useEffect, useState,useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useDarkMode } from '../styles/DarkModeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNRestart from 'react-native-restart';
import FormButton from '../components/formButtonsAndInput/FormButton';
import { AuthContext } from './AuthProvider';


const CustomDrawerContent = (props) => {
  const { isDarkMode, setIsDarkMode, theme } = useDarkMode();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('');
  const { logout } = useContext(AuthContext);

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'العربية', value: 'ar' },
    { label: 'עברית', value: 'he' },
  ];

  useEffect(() => {
    const fetchLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
      } else {
        setCurrentLanguage('en'); // Default language if none is saved
      }
    };
    fetchLanguage();
  }, []);

  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      await AsyncStorage.setItem('user-language', lng);
      setCurrentLanguage(lng);
      // if (lng === 'ar' || lng === 'he') {
      //   I18nManager.forceRTL(true);
      // } else {
      //   I18nManager.forceRTL(false);
      // }
      // RNRestart.Restart();
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.container}>
        <View style={styles.switchContainer}>
          <Text style={{ marginLeft:-10,color: isDarkMode ? theme.lightGray : theme.primaryText }}>{t('Dark Mode')}</Text>
          <Switch
            value={isDarkMode}
            onValueChange={(value) => setIsDarkMode(value)}
          />
        </View>
        <Text style={styles.SelectLanguage}>{t('Select Language')}:</Text>
        <View style={styles.languageButtonsContainer}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.value}
              style={[
                styles.languageButton,
                currentLanguage === language.value && styles.selectedLanguageButton,
              ]}
              onPress={() => changeLanguage(language.value)}
            >
              <Text style={{ color: currentLanguage === language.value ? '#FFF' : '#000' }}>
                {language.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.logoutButton}>
            <FormButton buttonTitle={t('logout')} onPress={() => logout()} />
      </View>

    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  languageButton: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedLanguageButton: {
    backgroundColor: '#007BFF', // Blue color for the selected button
  },
  SelectLanguage:{
    fontSize: 14,
    marginLeft:-10,
  },
  logoutButton:{
    marginLeft:10,
  },
});

export default CustomDrawerContent;
