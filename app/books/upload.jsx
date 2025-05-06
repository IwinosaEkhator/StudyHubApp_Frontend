import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import API_ENDPOINTS from "../../api/apiConfig";

export default function UploadBookScreen() {
  const { accessToken } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickCover = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permission required");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      quality: 0.7,
    });
    if (!res.canceled) setCover(res.assets[0]);
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/epub+zip"],
        copyToCacheDirectory: true,
        multiple: false,
      });
      console.log("Document picker result:", res);

      // New API shape: res.canceled + res.assets[]
      if (res.canceled === false && res.assets?.length > 0) {
        // Grab the first picked file
        const asset = res.assets[0];
        setFile({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType,
        });
        console.log("Picked file:", asset);
      } else {
        console.log("User cancelled or no assets:", res);
      }
    } catch (err) {
      console.error("Document picker error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!title || !file) {
      return Alert.alert("Title & file are required");
    }

    setLoading(true);

    // 1) Simple reachability test with fetch()
    try {
      console.log("▶️ Testing GET:", API_ENDPOINTS.books);
      const test = await fetch(API_ENDPOINTS.books, { method: "GET" });
      console.log("⬅️ Fetch status:", test.status);
    } catch (e) {
      console.error("❌ Fetch failed:", e);
      Alert.alert(
        "Network Error",
        `Cannot reach API at:\n${API_ENDPOINTS.books}\n\nCheck that your Laravel server is running on 0.0.0.0:8000 and that your device/emulator can see that host.`
      );
      setLoading(false);
      return;
    }

    // 2) Build FormData
    const form = new FormData();
    form.append("title", title);
    form.append("authors", authors);
    form.append("description", description);
    if (cover) {
      const ext = cover.uri.split(".").pop();
      form.append("cover", {
        uri: cover.uri,
        name: `cover.${ext}`,
        type: `image/${ext}`,
      });
    }
    form.append("file", {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    });

    // 3) Try Axios POST
    try {
      console.log("▶️ Axios POST to:", API_ENDPOINTS.books);
      const resp = await axios.post(API_ENDPOINTS.books, form, {
        headers: {
          // NOTE: Do NOT manually set Content‑Type; Axios will do it for FormData
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("⬅️ Axios response:", resp.data);
      Alert.alert("Success", resp.data.message);
      // Optionally clear form or navigate
      setTitle("");
      setAuthors("");
      setDescription("");
      setCover(null);
      setFile(null);
    } catch (axiosErr) {
      console.error(
        "❌ Axios error:",
        axiosErr.toJSON ? axiosErr.toJSON() : axiosErr
      );
      // 4) Fallback: try with fetch multipart
      try {
        console.log("▶️ Fallback fetch POST");
        const fetchResp = await fetch(API_ENDPOINTS.books, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // do NOT set Content-Type
          },
          body: form,
        });
        const data = await fetchResp.json();
        console.log("⬅️ Fetch POST response:", data);
        if (!fetchResp.ok) throw new Error(data.message || "Upload failed");
        Alert.alert("Success (via fetch)", data.message);
      } catch (fetchErr) {
        console.error("❌ Fetch POST error:", fetchErr);
        Alert.alert("Upload Error", fetchErr.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.label}>Title*</Text>
      <TextInput style={s.input} value={title} onChangeText={setTitle} />
      <Text style={s.label}>Authors</Text>
      <TextInput style={s.input} value={authors} onChangeText={setAuthors} />
      <Text style={s.label}>Description</Text>
      <TextInput
        style={[s.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {cover && <Image source={{ uri: cover.uri }} style={s.coverPreview} />}
      <TouchableOpacity style={s.btn} onPress={pickCover}>
        <Text style={s.btnText}>{cover ? "Change Cover" : "Pick Cover"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.btn} onPress={pickFile}>
        <Text style={s.btnText}>{file ? file.name : "Pick PDF/EPUB"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[s.btn, s.submit]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.btnText}>Upload Book</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  label: { marginTop: 10, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
  },
  btn: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  submit: { backgroundColor: "#28a745" },
  btnText: { color: "#fff", fontWeight: "600" },
  coverPreview: { width: 100, height: 150, marginTop: 10, borderRadius: 5 },
});
