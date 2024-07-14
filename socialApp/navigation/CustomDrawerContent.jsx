import React, { useEffect, useState,useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useDarkMode } from '../styles/DarkModeContext';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNRestart from 'react-native-restart';
import { COLORS, DARKCOLORS } from '../styles/colors';
// import * as Updates from 'expo-updates';
import FormButton from '../components/formButtonsAndInput/FormButton';
import { AuthContext } from './AuthProvider';
import { categoriesList } from '../utils/categories';
import { CheckBox } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import {windowHeight} from '../utils/Dimentions';

const MIN_RADIUS = 10;
const MAX_RADIUS = 50;

const CustomDrawerContent = (props) => {
  const { isDarkMode, setIsDarkMode, theme } = useDarkMode();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('');
  const [ currentFeedChoice, setCurrentFeedChoice ] = useState('For You');
  // const [ categories, setCategories ] = useState([]);
  const [ selectedCategories, setSelectedCategories ] = useState([]);
  const [categories, setCategories] = useState(categoriesList.map((category) => ({ label: category, value: category })));
  const [ isForYou, setIsForYou ] = useState(true);
  const [ categoriesFilterOpen, setCategoriesFilterOpen ] = useState(false);
  const [ RadiusFilterOpen, setRadiusFilterOpen ] = useState(false);
  const [ radius, setRadius ] = useState(MIN_RADIUS);
  const { logout } = useContext(AuthContext);
  const themeColors = isDarkMode ? DARKCOLORS : COLORS;
  const navigation = useNavigation();

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

  const restartApp = async () => {
    try {
      await Updates.reloadAsync();
    } catch (e) {
      console.error('Error restarting app:', e);
    }
  };

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
      // restartApp();
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const changeFeedChoice = async (feed) => {
    try {
      setCurrentFeedChoice(feed);
      if(feed === 'For You'){
        setIsForYou(true);
      } 
      else {
          setIsForYou(false);

          console.info("feed choice from drawer:", currentFeedChoice);
          console.info("feed 92:", feed);
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
  }

  const handleClickCategory = (category) => {
    if (selectedCategories.includes(category.value)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category.value));
    } else {
      setSelectedCategories([...selectedCategories, category.value]);
    }
  }

  const handelClickFilter = () => {
    console.info("feed choice from drawer:", currentFeedChoice);
    setTimeout(() => {
      navigation.navigate('Home Page', {
          feedChoice: currentFeedChoice,
          selectedCategories: selectedCategories,
          radius: radius
      });
    }, 100); // Small delay to ensure state updates
    setCategoriesFilterOpen(false);
    setRadiusFilterOpen(false);
  }

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
  }


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
              <Text style={{color:currentFeedChoice == feed.value? '#FFF' : '#000'}}>
                {feed.label}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      { isForYou ? (
        <>
          <View style={{flex:1, flexDirection:'cul'}}>
                <TouchableOpacity
                  style={[styles.drawerItem]}
                  onPress={() => setCategoriesFilterOpen(!categoriesFilterOpen)}
                >
                    <Text style={{color: themeColors.primaryText, marginLeft: 10, marginTop: 10}}>Category Filter</Text>
                </TouchableOpacity> 
                
                { categoriesFilterOpen &&
                  <>
                  <Text style={{color: themeColors.primaryText, margin: 17}}>Select Categories:</Text>
                  <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding:4 , marginBottom:10}}>
                          {categories.map((category) => (
                              <CheckBox
                                  style={styles.checkboxWrapper}
                                  key={category.value}
                                  title={category.value}
                                  checked={selectedCategories.includes(category.value)}
                                  onPress={() => handleClickCategory(category)}
                                  containerStyle={[styles.checkboxWrapper, {backgroundColor: themeColors.white}]}
                              />
                      ))}
                  </View>
                  </>
                }

                <TouchableOpacity
                  style={[styles.drawerItem]}
                  onPress={() => setRadiusFilterOpen(!RadiusFilterOpen)}
                >
                  <Text style={{color: themeColors.primaryText, marginLeft: 10, marginTop: 10}}>Radius Filter</Text>
                </TouchableOpacity> 

              { RadiusFilterOpen && (
                  <View style={styles.sliderContainer}>
                      <Text style={styles.sliderLabel}>Radius: {radius} KM</Text>
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

              <View style={{flex:1, flexDirection:'row', marginTop:'5%'}}>
                  <TouchableOpacity
                    style={[styles.drawerItem, {backgroundColor: '#A7EAAE', width:'45%', alignSelf:'center', borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: 40}]}
                    onPress={() => handelClickFilter()}
                  >
                  <Text style={{color: COLORS.white}}>Done</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.drawerItem, {backgroundColor: '#A7EAAE', width:'45%', alignSelf:'center', borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: 40}]}
                    onPress={() => handelClickClear()}
                  >
                  <Text style={{color: COLORS.white}}>Clear</Text>
                  </TouchableOpacity>
            </View>
          </View> 
      </>
      ) : (null)}
    
      <View style={{marginTop:'10%'}}>
        <View style={styles.switchContainer}>
          <Text style={{ color: isDarkMode ? theme.lightGray : theme.primaryText }}>{t('Dark Mode')}</Text>
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
  SelectLanguage:{
    fontSize: 14,
  },
  logoutButton:{
    marginTop: '5%',
    marginButton: '5%',
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
      color: COLORS.white,
    },
});

export default CustomDrawerContent;
