import React, { useEffect, useRef, useState, useContext } from 'react';
import {
    View,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ToastAndroid,
    PermissionsAndroid,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import GeoLocation from 'react-native-geolocation-service';
import { AuthContext } from '../../navigation/AuthProvider';
import { getDoc, doc } from 'firebase/firestore';
import { database } from '../../firebase';
import { getPostsNearby } from '../../FirebaseFunctions/collections/post';

const MapScreen = () => {
    const { user, login } = useContext(AuthContext);
    const mapRef = useRef(null);
    const [position, setPosition] = useState(null);
    const [locationMarkers, setLocationMarkers] = useState([]);
    const navigation = useNavigation();
    const radiusInMeters = 100000;

    const hasPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version < 23) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
        }

        return false;
    };

    const getLocation = async () => {
        const userConnected = await fetchUser(user.uid);
        if (!userConnected) {
            console.error('User not found in database');
            return;
        }
        
        const hasLocationPermission = await hasPermission();

        if (!hasLocationPermission) {
            console.log('Permission denied by user');
            return;
        }
        console.log('Permission granted by user');

        try {
            GeoLocation.getCurrentPosition(
                ({ coords }) => {
                    setPosition({ latitude: coords.latitude, longitude: coords.longitude });
                    console.log("getCurrentPosition, coords:", coords);
                },
                error => {
                    setPosition(null);
                    ToastAndroid.show(
                        "We couldn't fetch your location. Please check your device location service!",
                        ToastAndroid.LONG,
                    );
                    console.log(error);
                },
                {
                    accuracy: {
                        android: 'high',
                    },
                    enableHighAccuracy: false,
                    timeout: 30000,
                    maximumAge: 10000,
                    distanceFilter: 0,
                    forceRequestLocation: true,
                    forceLocationManager: false,
                    showLocationDialog: true,
                },
            );
        } catch (error) {
            console.error('Error getting location:', error);
        }
    };

    useEffect(() => {
        const focusListener = navigation.addListener('focus', async () => {
            await getLocation();
            const posts = await getPostsNearby([37.4220737, -122.084923], radiusInMeters);
            console.log('Nearby posts:', posts);
            setLocationMarkers(posts.map(post => ({
                id: post.id,
                latitude: post.coordinates[0],
                longitude: post.coordinates[1],
                title: post.postText,
            })));
        });
        focusListener();
        // const blurListener = navigation.addListener('blur', () => {
        //     clearInterval(interval.current);
        //     interval.current = null;
        // });

        return () => {
            focusListener();
            // blurListener;
        };
    }, [navigation]);

    // useEffect(() => {
    //     getLocation();
    //     getPostsNearby([position.latitude, position.longitude], radiusInMeters).then(posts => {
    //         console.log('Nearby posts:', posts);
    //         setLocationMarkers(posts.map(post => ({
    //             id: post.id,
    //             latitude: post.coordinates[0],
    //             longitude: post.coordinates[1],
    //             title: post.postText,
    //         })));
    //     });
    // }, [position]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View style={styles.container}>
                <MapView
                    region={{
                        latitude: 37.4220737,
                        longitude: -122.084923,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    style={{ flex: 1, opacity: 0.6 }}
                >
                    {locationMarkers.map(location => (
                        <Marker
                            key={location.id}
                            coordinate={location.coordinates}
                            title={location.title}
                            pinColor='blue'
                        />
                    ))}
                </MapView>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { height: '100%', width: '100%' },
});

export default MapScreen;

const fetchUser = async (id) => {
    try {
        const docRef = doc(database, "users", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            return null;
        }
        return docSnap.data();
    } catch (error) {
        console.error("fetchUser, Error getting document:", error);
        return null;
    }
};
