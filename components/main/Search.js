import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import firebase from "firebase";
import "@firebase/firestore";

const Search = (props) => {
  const [users, setUsers] = useState([]);

  const fetchUsers = (searchInput) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", ">=", searchInput)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(users);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search user..."
        onChangeText={(searchInput) => fetchUsers(searchInput)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("Profile", { uid: item.id })
            }
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
});

export default Search;
