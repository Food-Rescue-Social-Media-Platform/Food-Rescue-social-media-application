import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Platform, I18nManager } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useDarkMode } from '../styles/DarkModeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, DARKCOLORS } from '../styles/colors';
import { AuthContext } from './AuthProvider';
import { categoriesList } from '../utils/categories';
import { CheckBox, colors } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { windowHeight } from '../utils/Dimentions';
import * as Updates from 'expo-updates';

const MIN_RADIUS = 10;
const MAX_RADIUS = 50;

const CustomDrawerContent = (props) => {
  const { isDarkMode, setIsDarkMode, theme } = useDarkMode();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentFeedChoice, setCurrentFeedChoice] = useState('For You');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories] = useState(categoriesList.map((category) => ({ label: category, value: category })));
  const [isForYou, setIsForYou] = useState(true);
  const [categoriesFilterOpen, setCategoriesFilterOpen] = useState(false);
  const [radiusFilterOpen, setRadiusFilterOpen] = useState(false);
  const [radius, setRadius] = useState(MIN_RADIUS);
  const { logout } = useContext(AuthContext);
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;
  const navigation = useNavigation();


  const languages = [
    { label: 'English', value: 'en' },
    { label: 'العربية', value: 'ar' },
    { label: 'עברית', value: 'he' },
  ];

  const feedChoice = [
    { label: t('For You'), value: 'For You' },
    { label: t('Following'), value: 'Following' },
  ];

  useEffect(() => {
    const fetchLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage) {
        setCurrentLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
        const isRTL = savedLanguage === 'ar' || savedLanguage === 'he';
        I18nManager.forceRTL(isRTL);
      } else {
        setCurrentLanguage('en');
        i18n.changeLanguage('en');
        I18nManager.forceRTL(false);
      }
    };
    fetchLanguage();
  }, []);

  const changeLanguage = async (lng) => {
    try {
      const isRTL = lng === 'ar' || lng === 'he';
      await i18n.changeLanguage(lng);
      await AsyncStorage.setItem('user-language', lng);
      setCurrentLanguage(lng);
      I18nManager.forceRTL(isRTL);
      Updates.reloadAsync();
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const changeFeedChoice = async (feed) => {
    try {
      setCurrentFeedChoice(feed);
      if (feed === 'For You') {
        setIsForYou(true);
      } else {
        setIsForYou(false);
        setTimeout(() => {
          navigation.navigate('Home Page', {
            feedChoice: feed,
            selectedCategories: selectedCategories,
            radius: radius
          });
        }, 100); // Small delay to ensure state updates
      }
    } catch (error) {
      console.error("Error changing feed choice:", error);
    }
  };

  const handleClickCategory = (category) => {
    if (selectedCategories.includes(category.value)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category.value));
    } else {
      setSelectedCategories([...selectedCategories, category.value]);
    }
  };

  const handelClickFilter = () => {
    setTimeout(() => {
      navigation.navigate('Home Page', {
        feedChoice: currentFeedChoice,
        selectedCategories: selectedCategories,
        radius: radius
      });
    }, 100); // Small delay to ensure state updates
    setCategoriesFilterOpen(false);
    setRadiusFilterOpen(false);
  };

  const handelClickClear = () => {
    setCategoriesFilterOpen(false);
    setRadiusFilterOpen(false);
    setSelectedCategories([]);
    setRadius(MIN_RADIUS);
    setTimeout(() => {
      navigation.navigate('Home Page', {
        feedChoice: 'For You',
        selectedCategories: [],
        radius: MIN_RADIUS
      });
    }, 100);
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.container}>
        <View style={styles.feedChoiceContainer}>
          {feedChoice.map((feed) => (
            <TouchableOpacity
              key={feed.value}
              style={[styles.drawerItem, currentFeedChoice === feed.value && styles.selectedDrawerItem]}
              onPress={() => changeFeedChoice(feed.value)}
            >
              <Text style={{ color: '#000' }}>
                {feed.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isForYou && (
          <>
            <View style={{ flex: 1, flexDirection: 'cul' }}>
              <TouchableOpacity
                style={[styles.drawerItem]}
                onPress={() => setCategoriesFilterOpen(!categoriesFilterOpen)}
              >
                <Text style={{ color: colors.black, marginLeft: 10, marginTop: 10 }}>{t("Category Filter")}</Text>
              </TouchableOpacity>

              {categoriesFilterOpen && (
                <>
                  <Text style={{ color: themeColors.primaryText, margin: 17 }}>{t("Select Categories")}:</Text>
                  <View style={styles.categoriesContainer}>
                    {categories.map((category) => (
                      <CheckBox
                        style={styles.checkboxWrapper}
                        key={category.value}
                        title={t(category.value)}
                        checked={selectedCategories.includes(category.value)}
                        onPress={() => handleClickCategory(category)}
                        containerStyle={[styles.checkboxWrapper, { backgroundColor: themeColors.theme,borderRadius:10 }]}
                        textStyle={{ color: themeColors.black }} // Change the text color based on the theme
                      />
                    ))}
                  </View>
                </>
              )}

              {Platform.OS !== 'web' && (
                <>
                  <TouchableOpacity
                    style={[styles.drawerItem]}
                    onPress={() => setRadiusFilterOpen(!radiusFilterOpen)}
                  >
                    <Text style={{ color: colors.black, marginLeft: 10, marginTop: 10 }}>{t("Radius Filter")}</Text>
                  </TouchableOpacity>

                  {radiusFilterOpen && (
                    <View style={styles.sliderContainer}>
                      <Text style={styles.sliderLabel}>{t("Radius")}: {radius} {t("KM")}</Text>
                      <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={MIN_RADIUS}
                        maximumValue={MAX_RADIUS}
                        step={1}
                        value={radius}
                        onValueChange={(value) => setRadius(value)}
                        minimumTrackTintColor="#1EB1FC"
                        maximumTrackTintColor="#d3d3d3"
                        thumbTintColor="#007BFF"
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          </>
        )}
        <View style={styles.filterButtonsContainer}>
            <TouchableOpacity
              style={[styles.drawerItem, styles.filterButton]}
              onPress={() => handelClickFilter()}
            >
              <Text style={{ color: COLORS.black }}>{t("Done")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.drawerItem, styles.filterButton]}
              onPress={() => handelClickClear()}
            >
              <Text style={{ color: COLORS.black }}>{t("Clear")}</Text>
            </TouchableOpacity>
        </View>

        <View style={{ marginTop: '10%' }}>
          <View style={styles.switchContainer}>
            <Text style={{ color: theme.primaryText }}>{t('Dark Mode')}</Text>
            <Switch
              value={isDarkMode}
              onValueChange={(value) => setIsDarkMode(value)}
            />
          </View>

          <Text style={[styles.SelectLanguage,{ color: theme.primaryText }]}>{t('Select Language')}:</Text>
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
                <Text style={{ color: '#000' }}>
                  {language.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.logoutButton}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => logout()}
            >
              <Text style={styles.buttonText}>{t('logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  feedChoiceContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  drawerItem: {
    padding: 8,
    margin: 5,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    flex: 1,
    alignItems: 'center',
  },
  selectedDrawerItem: {
    backgroundColor: '#A7EAAE', // Blue color for the selected button
  },
  checkboxWrapper: {
    padding: 4,
    width:'42%',
    gap:0,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  filterButton: {
    backgroundColor: '#A7EAAE',
    width: '45%',
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 40,
  },
  sliderContainer: {
    padding: 20,
  },
  sliderLabel: {
    textAlign: 'center',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
  },
  languageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '5%',
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
    backgroundColor: '#A7EAAE', // Blue color for the selected button
  },
  SelectLanguage: {
    fontSize: 14,
  },
  logoutButton: {
    marginTop: '5%',
    marginBottom: '5%',
    width: '80%',
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    width: '95%',
    height: windowHeight / 15,
    backgroundColor: "#A7EAAE",
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
});

export default CustomDrawerContent;
