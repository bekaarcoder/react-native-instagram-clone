import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import firebase from "firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        onChangeText={(email) => setEmail(email)}
      />
      <TextInput
        secureTextEntry={true}
        placeholder="Password"
        onChangeText={(password) => setPassword(password)}
      />
      <Button onPress={onSignIn} title="Sign In" />
    </View>
  );
};

export default Login;
