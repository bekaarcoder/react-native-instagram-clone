import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/actions/index";

const Main = () => {
  const dispatch = useDispatch();

  const userState = useSelector((state) => state.userState);
  const { currentUser } = userState;
  console.log(currentUser);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text>{currentUser && `${currentUser.name} Logged In.`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Main;
