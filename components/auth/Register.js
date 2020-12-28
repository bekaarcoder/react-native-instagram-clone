import React, { useState } from "react";
import firebase from "firebase";
import { View, Button, TextInput } from "react-native";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .set({
            name: name,
            email: email,
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View>
      <TextInput placeholder="Name" onChangeText={(name) => setName(name)} />
      <TextInput
        placeholder="Email"
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(password) => setPassword(password)}
      />
      <Button onPress={onSignUp} title="Sign Up" />
    </View>
  );
};

export default Register;
