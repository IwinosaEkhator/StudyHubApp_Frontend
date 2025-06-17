// ChatListScreen.jsx

import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { fetchConversations } from "../../api/chatService";
import AddCircleOutlineIcon from "../../components/icons/AddCircleOutlineIcon";
import DefaultChatProfileIcon from "../../components/icons/DefaultChatProfileIcon";
import images from "../../constants/images";
import CustomButton from "../../components/CustomButton";

function ChatListScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations()
      .then((convs) => {
        console.log("got convos:", convs);
        setConversations(convs);
      })
      .catch((e) => {
        console.error("failed loading convos", e);
        Alert.alert("Error", "Could not load conversations");
      });
  }, []);

  const renderItem = ({ item }) => {
    const { other_user, last_message, last_time, unread_count } = item;

    // find the other participant
    const other = item.users.find((u) => u.id !== user.id);
    return (
      <TouchableOpacity
        style={styles.chatContainer}
        onPress={() =>
          navigation.navigate("ChatRoom", {
            conversationId: item.id,
            otherUser: {
              id: other.id,
              username: other.username,
              profile_photo: other.profile_photo,
            },
          })
        }
      >
        <View style={styles.avatarContainer}>
          {other.profile_photo ? (
            <Image
              source={{
                uri: `${API_BASE_URL}/storage/${other.profile_photo}`,
              }}
              style={styles.avatar}
            />
          ) : (
            <DefaultChatProfileIcon style={styles.profileImage} />
          )}
        </View>
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{other.username}</Text>
            {/* <Text style={styles.time}>{last_message_time}</Text> */}
          </View>
        </View>
      </TouchableOpacity>
    );

    // return (
    //   <>
    //     <TouchableOpacity
    //       style={styles.chatContainer}
    //       onPress={() =>
    //         navigation.navigate("ChatRoom", {
    //           conversationId: item.id,
    //           otherUser: item.other_user,
    //         })
    //       }
    //     >
    //       <View style={styles.avatarContainer}>
    //         {other_user.profile_photo ? (
    //           <Image
    //             source={{
    //               uri: `${API_ENDPOINTS.profile_photo_base_url}/storage/${other_user.profile_photo}`,
    //             }}
    //             style={styles.avatar}
    //           />
    //         ) : (
    //           <DefaultChatProfileIcon style={styles.profileImage} />
    //         )}
    //         {/* green dot if online */}
    //         {other_user.isOnline && <View style={styles.onlineDot} />}
    //       </View>

    //       <View style={styles.textContainer}>
    //         <View style={styles.headerRow}>
    //           <Text style={styles.name}>{other_user.username}</Text>
    //           <Text style={styles.time}>{last_time}</Text>
    //         </View>

    //         <View style={styles.messageRow}>
    //           <Text style={styles.message} numberOfLines={1}>
    //             {last_message || "No messages yet."}
    //           </Text>

    //           {/* {unread_count > 0 && (
    //             <View style={styles.unreadBadge}>
    //               <Text style={styles.unreadText}>{unread_count}</Text>
    //             </View>
    //           )} */}
    //         </View>
    //       </View>
    //     </TouchableOpacity>
    //   </>
    // );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View className="flex-row justify-between items-center px-5 pt-5">
          <Text className="text-4xl font-bold">Chat</Text>
          <AddCircleOutlineIcon
            fill="black"
            onPress={() => navigation.navigate("AddPeople")}
          />
        </View>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={() => (
            <View style={{ marginTop: 120, padding: 20 }}>
              <View>
                <Image
                  source={images.chatImage}
                  style={{ width: 300, height: 200, alignSelf: "center" }}
                />
                <Text className="text-2xl font-bold text-center">
                  Welcome to Chat!
                </Text>
                <Text
                  className="text-center"
                  style={{
                    color: "rgba(0, 0, 0, 0.5)",
                  }}
                >
                  Feel free to start a new conversation {`\n`} by tapping the
                  button below
                </Text>
                <CustomButton
                  title={
                    <View className="flex-row item-center">
                      <AddCircleOutlineIcon
                        style={{ marginRight: 6 }}
                        fill="white"
                      />
                      <Text style={{ color: "#fff", fontSize: 18 }}>
                        Start New Chat
                      </Text>
                    </View>
                  }
                  containerStyles="mt-8 min-h-[57px]"
                  handlePress={() => navigation.navigate("AddPeople")}
                />
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    // padding: 20,
  },

  chatContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineDot: {
    width: 12,
    height: 12,
    backgroundColor: "#4CD964",
    borderRadius: 6,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "#fff",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  messageRow: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "center",
    justifyContent: "space-between",
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: "#2E7CFF",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginLeft: 80,
  },
});

export default ChatListScreen;
