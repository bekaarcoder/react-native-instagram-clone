import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import firebase from "firebase";
import "@firebase/firestore";

const Profile = (props) => {
  const [profile, setProfile] = useState(null);
  const [profilePosts, setProfilePosts] = useState([]);

  const { uid } = props.route.params;

  const userState = useSelector((state) => state.userState);
  const { currentUser, posts } = userState;

  useEffect(() => {
    if (uid == firebase.auth().currentUser.uid) {
      setProfile(currentUser);
      setProfilePosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setProfile(doc.data());
          } else {
            console.log("User does not exist");
          }
        })
        .catch((error) => {
          console.log(error);
        });

      firebase
        .firestore()
        .collection("posts")
        .doc(uid)
        .collection("userPosts")
        .orderBy("date_created", "asc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProfilePosts(posts);
        });
    }
  }, [firebase, uid]);

  if (profile === null) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{profile.name}</Text>
        <Text>{profile.email}</Text>
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={profilePosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
    margin: 10,
  },
  containerImage: {
    flex: 1 / 3,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    margin: 2,
  },
});

export default Profile;
