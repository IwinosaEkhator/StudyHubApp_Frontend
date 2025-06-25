// screens/chat/ChatScreen.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import * as DocumentPicker from "expo-document-picker";

import icons from "../../constants/icons";
import InfoIcon from "../../components/icons/InfoIcon";
import AddCircleOutlineIcon from "../../components/icons/AddCircleOutlineIcon";
import SendIcon from "../../components/icons/SendIcon";
import { AuthContext } from "../../context/AuthContext";
import useEcho from "../../context/useEcho";
import { fetchMessages, sendMessage } from "../../api/chatService";

export default function ChatScreen({ route, navigation }) {
  const { conversationId, otherUser } = route.params;
  const { user } = useContext(AuthContext);
  const echo = useEcho();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // preview step state
  const [pendingAsset, setPendingAsset] = useState(null);
  // pendingAsset = { field: "image"|"video"|… , asset: {uri, name, type} }

  // fetch history + subscribe
  useEffect(() => {
    let mounted = true;
    fetchMessages(conversationId)
      .then((data) => mounted && setMessages(data))
      .catch(console.error)
      .finally(() => mounted && setLoading(false));

    const channel = echo
      .channel(`chat.${conversationId}`)
      .listen(".message.sent", (e) =>
        setMessages((prev) => [...prev, e.message])
      );

    return () => {
      mounted = false;
      echo.leaveChannel(`chat.${conversationId}`);
    };
  }, [conversationId]);

  // send text
  const sendText = async () => {
    if (!input.trim() || sending) return;
    const body = input.trim();
    setInput("");
    setSending(true);

    const tempId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        user_id: user.id,
        body,
        created_at: new Date().toISOString(),
        user,
      },
    ]);

    try {
      const saved = await sendMessage(conversationId, body, {});
      setMessages((prev) => prev.map((m) => (m.id === tempId ? saved : m)));
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not send message");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  // send attachment after preview
  const commitAttachment = async () => {
    if (!pendingAsset || sending) return;
    const { field, asset } = pendingAsset;
    setSending(true);
    setPendingAsset(null);

    const tempId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        user_id: user.id,
        [field]: asset,
        created_at: new Date().toISOString(),
        user,
      },
    ]);

    try {
      const saved = await sendMessage(conversationId, "", { [field]: asset });
      setMessages((prev) => prev.map((m) => (m.id === tempId ? saved : m)));
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not send attachment");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  // picking functions
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibrary({ mediaType: "photo" });
    if (res.didCancel || !res.assets?.length) return null;
    const a = res.assets[0];
    return { uri: a.uri, fileName: a.fileName, type: a.type };
  };
  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibrary({ mediaType: "video" });
    if (res.didCancel || !res.assets?.length) return null;
    const a = res.assets[0];
    return { uri: a.uri, fileName: a.fileName, type: a.type };
  };
  const pickDocument = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    return res.type === "success"
      ? { uri: res.uri, name: res.name, type: res.mimeType }
      : null;
  };

  // open + menu
  const openMenu = () => {
    setPendingAsset({ field: "__MENU__", asset: null });
  };
  const onMenuSelect = async (option) => {
    setPendingAsset(null); // close menu stub
    if (sending) return;
    let asset = null;
    switch (option) {
      case "Photo":
        asset = await pickImage();
        asset && setPendingAsset({ field: "image", asset });
        break;
      case "Video":
        asset = await pickVideo();
        asset && setPendingAsset({ field: "video", asset });
        break;
      case "Audio":
        asset = await pickDocument();
        asset &&
          asset.type.startsWith("audio") &&
          setPendingAsset({ field: "audio", asset });
        break;
      case "File":
        asset = await pickDocument();
        asset && setPendingAsset({ field: "file", asset });
        break;
      case "Link Book":
        Alert.prompt(
          "Link a Book",
          "Paste Google Books URL",
          (url) => url && setPendingAsset({ field: "book_link", asset: url }),
          "plain-text"
        );
        break;
      default:
        break;
    }
  };

  // render message
  const renderItem = ({ item }) => {
    const me = item.user_id === user.id;
    return (
      <View style={[styles.messageRow, me && { justifyContent: "flex-end" }]}>
        <View style={[styles.bubble, me ? styles.bubbleMe : styles.bubbleThem]}>
          {item.body && (
            <Text style={me ? styles.textMe : styles.textThem}>
              {item.body}
            </Text>
          )}
          {item.image && (
            <Image
              source={{ uri: item.image.uri }}
              style={{ width: 120, height: 80, marginTop: 6 }}
            />
          )}
          {item.video && <Text>🎬 Video</Text>}
          {item.audio && <Text>🎵 Audio</Text>}
          {item.file && <Text>📎 File</Text>}
          {item.book_link && (
            <Text style={{ color: "#06c" }}>📖 {item.book_link}</Text>
          )}
          <Text style={[styles.time, me ? styles.timeMe : styles.timeThem]}>
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.blackArrowBack}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{otherUser.username}</Text>
        <InfoIcon />
      </View>

      {/* Messages or loading */}
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
        />
      )}

      {/* Input row */}
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={openMenu} disabled={sending}>
          <AddCircleOutlineIcon fill="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Message"
          value={input}
          onChangeText={setInput}
          editable={!sending}
        />
        <TouchableOpacity onPress={sendText} disabled={sending}>
          {sending ? <ActivityIndicator /> : <SendIcon />}
        </TouchableOpacity>
      </View>

      {/* + Menu */}
      <Modal
        visible={pendingAsset?.field === "__MENU__"}
        transparent
        animationType="slide"
        onRequestClose={() => setPendingAsset(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setPendingAsset(null)}
        >
          <View style={styles.modal}>
            {["Photo", "Video", "Audio", "File", "Link Book", "Cancel"].map(
              (opt, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.modalItem}
                  onPress={() => onMenuSelect(opt)}
                  disabled={sending}
                >
                  <Text
                    style={[
                      styles.modalText,
                      opt === "Cancel" && { color: "red" },
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Preview & Send */}
      <Modal
        visible={!!(pendingAsset && pendingAsset.field !== "__MENU__")}
        transparent
        animationType="fade"
      >
        <View style={styles.previewOverlay}>
          <View style={styles.previewBox}>
            {pendingAsset?.field === "image" && (
              <Image
                source={{ uri: pendingAsset.asset.uri }}
                style={styles.previewImage}
              />
            )}
            {pendingAsset?.field === "video" && <Text>🎬 Video selected</Text>}
            {pendingAsset?.field === "audio" && (
              <Text>🎵 {pendingAsset.asset.name}</Text>
            )}
            {pendingAsset?.field === "file" && (
              <Text>📎 {pendingAsset.asset.name}</Text>
            )}
            {pendingAsset?.field === "book_link" && (
              <Text style={{ color: "#06c" }}>📖 {pendingAsset.asset}</Text>
            )}
            <View style={styles.previewButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setPendingAsset(null)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={commitAttachment}
              >
                <Text style={{ color: "white" }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", paddingTop: 30, },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  messagesList: { padding: 12, flexGrow: 1 },
  messageRow: { flexDirection: "row", marginVertical: 6 },
  bubble: { maxWidth: "75%", padding: 10, borderRadius: 16 },
  bubbleMe: { backgroundColor: "#000", borderBottomRightRadius: 0 },
  bubbleThem: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderBottomLeftRadius: 0,
  },
  textMe: { color: "#fff" },
  textThem: { color: "#000" },
  time: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  timeMe: { color: "#e0e0e0" },
  timeThem: { color: "#999" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalItem: { paddingVertical: 12 },
  modalText: { fontSize: 18, textAlign: "center" },

  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  previewImage: { width: 200, height: 120, marginBottom: 12 },
  previewButtons: {
    flexDirection: "row",
    marginTop: 16,
    width: "100%",
    justifyContent: "space-between",
  },
  cancelBtn: { padding: 10 },
  sendBtn: { padding: 10, backgroundColor: "#007AFF", borderRadius: 4 },
});
