import firebase from "firebase";
import {
  USER_FOLLOWING_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
} from "../constants/index";

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

export const fetchUserPosts = () => (dispatch) => {
  firebase
    .firestore()
    .collection("posts")
    .doc(firebase.auth().currentUser.uid)
    .collection("userPosts")
    .orderBy("date_created", "asc")
    .get()
    .then((snapshot) => {
      let posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(posts);
      dispatch({
        type: USER_POSTS_STATE_CHANGE,
        payload: posts,
      });
    });
};

export const fetchUserFollowing = () => (dispatch) => {
  firebase
    .firestore()
    .collection("following")
    .doc(firebase.auth().currentUser.uid)
    .collection("userFollowing")
    .onSnapshot((snapshot) => {
      let following = snapshot.docs.map((doc) => doc.id);
      dispatch({
        type: USER_FOLLOWING_STATE_CHANGE,
        payload: following,
      });
    });
};
