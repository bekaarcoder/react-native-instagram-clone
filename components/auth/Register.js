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
