import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";


export const fetchUser = async (id) => {
    try {
      const docRef = doc(db, "users", id);
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