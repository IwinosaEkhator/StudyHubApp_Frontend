import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AddCircleOutlineIcon from "../../components/icons/AddCircleOutlineIcon";
import images from "../../constants/images";
import CustomButton from "../../components/CustomButton";
import { TouchableOpacity } from "react-native";

const myMessagesData = [
  {
    id: 1,
    name: "Mark Zurkerberg",
    message: "Let’s trade in the afternoon, I am not available",
    time: "11:30",
    type: "unread",
    image: (
      <Image
        source={require("../../assets/images/Ellipse 4.png")}
        style={{
          width: 40,
          height: 40,
          resizeMode: "contain",
          marginRight: 10,
        }}
      />
    ),
  },
  {
    id: 2,
    name: "Mark Zurkerberg",
    message: "Let’s trade in the afternoon, I am not available",
    time: "11:30",
    type: "read",
    image: (
      <Image
        source={require("../../assets/images/Ellipse 4.png")}
        style={{
          width: 40,
          height: 40,
          resizeMode: "contain",
          marginRight: 10,
        }}
      />
    ),
  },
  {
    id: 3,
    name: "Mark Zurkerberg",
    message: "Let’s trade in the afternoon, I am not available",
    time: "11:30",
    type: "read",
    image: (
      <Image
        source={require("../../assets/images/Ellipse 4.png")}
        style={{
          width: 40,
          height: 40,
          resizeMode: "contain",
          marginRight: 10,
        }}
      />
    ),
  },
  {
    id: 4,
    name: "Mark Zurkerberg",
    message: "Let’s trade in the afternoon, I am not available",
    time: "11:30",
    type: "read",
    image: (
      <Image
        source={require("../../assets/images/Ellipse 4.png")}
        style={{
          width: 40,
          height: 40,
          resizeMode: "contain",
          marginRight: 10,
        }}
      />
    ),
  },
  {
    id: 5,
    name: "Mark Zurkerberg",
    message: "Let’s trade in the afternoon, I am not available",
    time: "11:30",
    type: "read",
    image: (
      <Image
        source={require("../../assets/images/Ellipse 4.png")}
        style={{
          width: 40,
          height: 40,
          resizeMode: "contain",
          marginRight: 10,
        }}
      />
    ),
  },
];

const ChatListScreen = ({ navigation }) => {
  const hasMessage = myMessagesData.some((item) =>
    ["read", "unread"].includes(item.type)
  );

  const renderMessageItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Chat")}
        style={styles.messageSubContainer}
      >
        {item.image}
        <View style={{ width: "82%" }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={[
                styles.messageName,
                {
                  opacity: item.type === "unread" ? 1 : 0.5,
                },
              ]}
            >
              {item.name}
            </Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.messageText,
              {
                color:
                  item.type === "unread"
                    ? "rgba(0, 0, 0, 0.5)"
                    : "rgba(0, 0, 0, 0.5)",
              },
            ]}
          >
            {item.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View className="flex-row justify-between items-center">
            <Text className="text-4xl font-bold">Chat</Text>
            <AddCircleOutlineIcon fill="black" />
          </View>

          <View style={[styles.myPurchaseContainer]}>
            <FlatList
              data={myMessagesData}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={renderMessageItem}
              nestedScrollEnabled={true} // Allow nested scrolling
              ListEmptyComponent={() => (
                <View style={{ marginTop: 120 }}>
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
                      Feel free to start a new conversation {`\n`} by tapping
                      the button below
                    </Text>
                    <CustomButton
                      title={
                        <View className="flex-row item-center">
                          <AddCircleOutlineIcon
                            style={{ marginRight: 6 }}
                            fill="white"
                          />
                          <Text style={{ color: "#fff" }}>Start New Chat</Text>
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
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    padding: 20,
  },

  myPurchaseContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 5,
  },

  //   Messages
  messageSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingTop: 15,
    paddingBottom: 10,
    width: "100%",
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    borderBottomWidth: 1,
  },
  messageName: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 13,
    fontWeight: 500,
    opacity: 0.5,
  },
  messageText: {
    fontSize: 13,
    fontWeight: 600,
    color: "rgba(0, 0, 0, 0.5)",
  },
});

export default ChatListScreen;
