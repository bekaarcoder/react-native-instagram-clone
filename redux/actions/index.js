import firebase from "firebase";
import { USER_STATE_CHANGE } from "../constants/index";

export const fetchUser = () => (dispatch) => {
  firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(doc.data());
        dispatch({
          type: USER_STATE_CHANGE,
          payload: doc.data(),
        });
      } else {
        console.log("User does not exist");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
