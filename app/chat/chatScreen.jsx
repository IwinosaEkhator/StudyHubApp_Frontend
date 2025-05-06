// ChatScreen.js
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { Audio } from "expo-av";
import icons from "../../constants/icons";
import InfoIcon from "../../components/icons/InfoIcon";
import PlayIcon from "../../components/icons/PlayIcon";
import AddCircleOutlineIcon from "../../components/icons/AddCircleOutlineIcon";
import SendIcon from "../../components/icons/SendIcon";

const initialMessages = [
  {
    id: "1",
    fromMe: false,
    text: "I'm meeting a friend here for dinner. How about you? 😊",
    time: "5:30",
  },
  {
    id: "2",
    fromMe: false,
    voice: require("../../assets/sounds/New Composition #1.mp3"),
    duration: "01:23",
    time: "5:45",
  },
  {
    id: "3",
    fromMe: true,
    text: "I'm doing my homework, but I really need to take a break.",
    time: "5:48",
  },
  {
    id: "4",
    fromMe: false,
    text:
      "On my way home but I needed to stop by the book store to buy a text book. 😎",
    time: "5:58",
  },
];

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const soundRef = useRef(new Audio.Sound());

  // play a voice message
  const handlePlayPause = async (voice) => {
    try {
      const status = await soundRef.current.getStatusAsync();
      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.unloadAsync();
        await soundRef.current.loadAsync(voice);
        await soundRef.current.playAsync();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item }) => {
    const bubbleStyle = item.fromMe ? styles.bubbleMe : styles.bubbleThem;
    const textStyle = item.fromMe ? styles.textMe : styles.textThem;
    return (
      <View
        style={[
          styles.messageRow,
          item.fromMe && { justifyContent: "flex-end" },
        ]}
      >
        <View style={[styles.bubble, bubbleStyle]}>
          {item.text && <Text style={textStyle}>{item.text}</Text>}
          {item.voice && (
            <TouchableOpacity
              style={styles.voiceContainer}
              onPress={() => handlePlayPause(item.voice)}
            >
              <PlayIcon fill={item.fromMe ? "#fff" : "#000"} />
              <Text style={[styles.voiceDuration, textStyle]}>
                {item.duration}
              </Text>
            </TouchableOpacity>
          )}
          <Text
            style={[styles.time, item.fromMe ? styles.timeMe : styles.timeThem]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        fromMe: true,
        text: input,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.blackArrowBack}
            style={{ height: 24, width: 24 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shane Martinez</Text>
        <TouchableOpacity
          onPress={() => {
            /* info action */
          }}
        >
          <InfoIcon />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input bar */}
      <View style={styles.inputRow}>
        <TouchableOpacity>
          <AddCircleOutlineIcon fill="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={handleSend}>
          <SendIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingTop: 20,
    marginBottom: 20,
    // borderBottomWidth: 1,
    // borderColor: "#ddd",
    // backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  messagesList: {
    padding: 12,
    paddingTop: 45,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    backgroundColor: "#fff",
    height: "100%"
  },
  messageRow: { flexDirection: "row", marginVertical: 9 },
  bubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 16,
    position: "relative",
  },
  bubbleMe: { backgroundColor: "#000", borderBottomRightRadius: 0 },
  bubbleThem: { backgroundColor: "#fff", borderWidth: 1, borderBottomLeftRadius: 0 },
  textMe: { color: "#fff", fontSize: 16 },
  textThem: { color: "#000", fontSize: 16 },
  time: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  timeMe: { color: "#e0e0e0" },
  timeThem: { color: "#999" },
  voiceContainer: { flexDirection: "row", alignItems: "center" },
  voiceDuration: { marginLeft: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
  },
});
