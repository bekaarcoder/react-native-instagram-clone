import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Image, TextInput, View } from "react-native";
import firebase from "firebase";
import "@firebase/firestore";
import "@firebase/storage";
import { fetchUserPosts } from "../../redux/actions";

const Save = (props) => {
  const dispatch = useDispatch();
  const { image } = props.route.params;
  const [caption, setCaption] = useState("");

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        image: downloadURL,
        caption: caption,
        date_created: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        dispatch(fetchUserPosts());
        props.navigation.popToTop();
      });
  };

  const uploadImage = async () => {
    const uri = image;
    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase
      .storage()
      .ref()
      .child(
        `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
      )
      .put(blob);

    const taskProgress = (snapshot) => {
      console.log(
        `Transferred : ${
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        }`
      );
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((downloadURL) => {
        savePostData(downloadURL);
        console.log(downloadURL);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: image }} resizeMode="contain" style={{ flex: 1 }} />
      <TextInput
        placeholder="Write a caption..."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save" onPress={uploadImage} />
    </View>
  );
};

export default Save;
