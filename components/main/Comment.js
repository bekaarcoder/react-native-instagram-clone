import React, { useState, useEffect } from "react";
import firebase from "firebase";
import "@firebase/firestore";
import { Button, FlatList, TextInput, View, Text } from "react-native";

const Comment = (props) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");
  const [input, setInput] = useState(null);
  const [posting, setPosting] = useState(false);

  const { post_id, uid } = props.route.params;

  useEffect(() => {
    if (post_id !== postId && !posting) {
      firebase
        .firestore()
        .collection("posts")
        .doc(uid)
        .collection("userPosts")
        .doc(post_id)
        .collection("comments")
        .onSnapshot((snapshot) => {
          let comments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setComments(comments);
        });
      setPostId(post_id);
    }
  }, [post_id, posting]);

  const onSaveComment = () => {
    setPosting(true);
    firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .doc(post_id)
      .collection("comments")
      .add({
        uid: firebase.auth().currentUser.uid,
        username: firebase.auth().currentUser.email,
        comment: text,
      })
      .then(() => {
        input.clear();
        setPosting(false);
      });
  };

  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold", marginRight: 7 }}>
              {item.username.split("@")[0]}
            </Text>
            <Text>{item.comment}</Text>
          </View>
        )}
      />

      <View>
        <TextInput
          placeholder="Add a comment..."
          onChangeText={(text) => setText(text)}
          ref={(ref) => setInput(ref)}
        />
        <Button
          onPress={() => onSaveComment()}
          title={posting ? "Posting" : "Post"}
        />
      </View>
    </View>
  );
};

export default Comment;
