// src/screens/BookmarksScreen.js
import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { BookmarkContext } from "../../context/BookmarkContext";
import { SafeAreaView } from "react-native";
import icons from "../../constants/icons";

export default function BookmarksScreen({ navigation }) {
  const { bookmarks } = useContext(BookmarkContext);

  if (bookmarks.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No bookmarks yet.</Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.safeArea} classname="bg-white w-full h-full">
        <View style={{ padding: 20 }}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={icons.blackArrowBack} style={styles.backIcon} />
            </TouchableOpacity>
            <Text style={styles.header}>My Bookmarks</Text>
            <View></View>
          </View>
          <FlatList
            data={bookmarks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.row}
                onPress={() => navigation.navigate("infoPage", { book: item })}
              >
                {item.volumeInfo.imageLinks?.thumbnail ? (
                  <Image
                    source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                    style={styles.thumb}
                  />
                ) : (
                  <View style={[styles.thumb, styles.noImage]}>
                    <Text>No Image</Text>
                  </View>
                )}
                <View style={styles.info}>
                  <Text numberOfLines={2} style={styles.title}>
                    {item.volumeInfo.title}
                  </Text>
                  <Text numberOfLines={1} style={styles.author}>
                    {item.volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        {/* Navigation Back */}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  // Navigation Back
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 25,
  },
  backIcon: { width: 26, height: 26 },
  header: { fontSize: 22, fontWeight: "bold", marginLeft: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  thumb: { width: 60, height: 90, borderRadius: 4, backgroundColor: "#eee" },
  noImage: { justifyContent: "center", alignItems: "center" },
  info: { flex: 1, marginLeft: 12, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "600" },
  author: { fontSize: 14, color: "#555" },
});
