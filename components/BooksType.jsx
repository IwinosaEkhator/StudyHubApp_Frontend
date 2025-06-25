import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";

const BooksType = ({ type, navigation }) => {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks(type);
  }, [type]);

  const fetchBooks = async (tag) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${tag}`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="pt-4">
      {loading ? (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#007bff" />
        </SafeAreaView>
      ) : books.length === 0 ? (
        <Text style={{ textAlign: "center", fontSize: 16, color: "#888" }}>
          No books found.
        </Text>
      ) : (
        <>
          <View className="flex-row justify-between align-center">
            <Text className="text-[22px] font-bold">{type}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Category", { type })}
            >
              <Text style={{ color: "#000" }}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("infoPage", { book: item });
                }}
              >
                <View className="rounded-lg bg-white my-2 mr-4 py-2 w-[120px]">
                  <View>
                    {item.volumeInfo.imageLinks?.thumbnail ? (
                      <Image
                        source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                        className="w-[120px] h-[180px] rounded-lg"
                      />
                    ) : (
                      <View className="w-[120px] h-[180px] rounded-lg bg-gray-300 items-center justify-center">
                        <Text className="text-[12px] text-center">
                          No Image
                        </Text>
                      </View>
                    )}
                    {item.volumeInfo.averageRating && (
                      <View className="px-2 py-1 absolute bg-white rounded-lg bottom-3 left-2">
                        <Text className="text-[12px] text-center">
                          ⭐ {item.volumeInfo.averageRating.toFixed(1)}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="mt-2">
                    <Text
                      className="text-[14px] font-bold"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.volumeInfo.title || "No Title"}
                    </Text>
                    <Text
                      className="text-[12px]"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.volumeInfo.authors
                        ? item.volumeInfo.authors.join(", ")
                        : "Unknown Author"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
});

export default BooksType;
