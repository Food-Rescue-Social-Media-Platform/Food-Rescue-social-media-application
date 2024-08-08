// googleSignIn.js
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';

export const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    GoogleSignin.configure({});
    const userInfo = await GoogleSignin.signIn();
    const { idToken, accessToken } = await GoogleSignin.getTokens();
    return { ...userInfo, idToken, accessToken };
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          console.log("Sign-in cancelled");
          break;
        case statusCodes.IN_PROGRESS:
          console.log("Sign-in in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log("Play services not available");
          break;
        default:
          console.log("Unknown error: ", error);
      }
    } else {
      console.log("Non-standard error: ", error);
    }
    throw error;
  }
};
