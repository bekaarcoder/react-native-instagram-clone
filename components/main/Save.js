import React, { useState } from "react";
import { Button, Image, TextInput, View } from "react-native";
import firebase from "firebase";
import "@firebase/firestore";
import "@firebase/storage";

const Save = (props) => {
  const { image } = props.route.params;
  const [caption, setCaption] = useState("");

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
      <Image source={{ uri: image }} style={{ flex: 1, aspectRatio: 1 }} />
      <TextInput
        placeholder="Write a caption..."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save" onPress={uploadImage} />
    </View>
  );
};

export default Save;
