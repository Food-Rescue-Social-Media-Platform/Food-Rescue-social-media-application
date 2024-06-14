import React, { useEffect, useState,useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useDarkMode } from '../styles/DarkModeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNRestart from 'react-native-restart';
import { COLORS, DARKCOLORS } from '../styles/colors';
import FormButton from '../components/formButtonsAndInput/FormButton';
import { AuthContext } from './AuthProvider';
import { categoriesList } from '../utils/categories';
import { CheckBox } from 'react-native-elements';

const CustomDrawerContent = (props) => {
  const { isDarkMode, setIsDarkMode, theme } = useDarkMode();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [ currentFeedChoice, setCurrentFeedChoice ] = useState('For You');
  // const [ categories, setCategories ] = useState([]);
  const [ selectedCategories, setSelectedCategories ] = useState([]);
  const [categories, setCategories] = useState(categoriesList.map((category) => ({ value: category })));
  const { logout } = useContext(AuthContext);
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'العربية', value: 'ar' },
    { label: 'עברית', value: 'he' },
  ];

  const feedChoice = [
    { label: 'For You', value: 'For You' },
    { label: 'Following', value: 'Following' },
  ]

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

  const changeFeedChoice = async (feed) => {
    try {
      setCurrentFeedChoice(feed);
    } catch (error) {
      console.error("Error changing feed choice:", error);
    }
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.feedChoiceContainer}>
        {feedChoice.map((feed) => (
            <TouchableOpacity
              key={feed.value}
              style={[styles.drawerItem, currentFeedChoice === feed.value && styles.selectedDrawerItem]}
              onPress={() => changeFeedChoice(feed.value)}
            >
              <Text style={{color:currentFeedChoice == feed.value? '#FFF' : '#000'}}>
                {feed.label}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          {categories.map((category) => (
              <CheckBox
                  style={[styles.checkboxWrapper, { backgroundColor: themeColors.secondaryBackground }]}
                  key={category.value}
                  title={category.value}
                  checked={selectedCategories.includes(category.value)}
                  onPress={() => handleCheck(category)}
                  textStyle={{ color: themeColors.primaryText }}
                  containerStyle={{ backgroundColor: themeColors.secondaryBackground }}
              />
          ))}
      </View>

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
  feedChoiceContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  drawerItem: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedDrawerItem: {
    backgroundColor: '#007BFF', // Blue color for the selected button
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
