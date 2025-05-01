import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import icons from "../../constants/icons";

export default function CategoryScreen({ route, navigation }) {
  const { type } = route.params;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Only one effect: load the first page (and subsequent when type changes)
  useEffect(() => {
    // reset state when category changes
    setBooks([]);
    setStartIndex(0);
    setHasMore(true);
    loadMore();
  }, [type]);

  const fetchBooks = async (tag, start = 0) => {
    // do not flip loading off until after setBooks
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${tag}&maxResults=20&startIndex=${start}`
      );
      const data = await res.json();
      return data.items || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const newBooks = await fetchBooks(type, startIndex);
    setBooks((b) => [...b, ...newBooks]);
    setStartIndex((i) => i + newBooks.length);
    if (newBooks.length < 20) setHasMore(false);
    setLoading(false);
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return <ActivityIndicator style={{ margin: 16 }} />;
  };

  if (loading && books.length === 0) {
    // show spinner only on the very first load
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (books.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No books found in “{type}”.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icons.blackArrowBack}
            style={styles.backIcon}
            resizeMethod="contain"
          />
        </TouchableOpacity>
        <Text style={styles.header}>{type} Books</Text>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
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
              <Text style={styles.title} numberOfLines={2}>
                {item.volumeInfo.title}
              </Text>
              <Text style={styles.author} numberOfLines={1}>
                {item.volumeInfo.authors?.join(", ") || "Unknown Author"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: { flexDirection: "row", alignItems: "center", paddingBottom: 18 },
  backIcon: { width: 24, height: 24 },
  header: { fontSize: 22, fontWeight: "bold", marginLeft: 12 },
  row: { flexDirection: "row", marginBottom: 12 },
  thumb: { width: 60, height: 90, borderRadius: 4, backgroundColor: "#eee" },
  noImage: { justifyContent: "center", alignItems: "center" },
  info: { flex: 1, marginLeft: 12, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "600" },
  author: { fontSize: 14, color: "#555" },
});
