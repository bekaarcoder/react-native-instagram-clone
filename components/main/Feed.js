import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, FlatList, Image, StyleSheet, Text, View } from "react-native";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const userState = useSelector((state) => state.userState);
  const { currentUser, following } = userState;

  const usersState = useSelector((state) => state.usersState);
  const { users, usersLoaded } = usersState;

  console.log(posts);

  useEffect(() => {
    let allPosts = [];
    if (usersLoaded == following.length) {
      following.forEach((id) => {
        const user = users.find((el) => el.uid === id);
        if (user != undefined) {
          allPosts = [...allPosts, ...user.posts];
        }
      });

      allPosts.sort((x, y) => x.date_created - y.date_created);

      setPosts(allPosts);
    }
  }, [usersLoaded]);

  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Text style={styles.container}>{item.user.name}</Text>
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
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
});

export default Feed;
