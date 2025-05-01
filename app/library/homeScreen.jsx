import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import icons from "../../constants/icons";
import BooksType from "../../components/BooksType";

const HomeScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use an effect to fetch books when searchQuery changes, with a debounce.
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchBooks(searchQuery);
      } else {
        setBooks([]); // Clear search results when no query is present.
      }
    }, 300); // Adjust the delay (milliseconds) as needed.

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  

  const fetchBooks = async (query) => {
    if (!query) return; // Don't fetch if query is empty
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBooks(searchQuery);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View className="flex-1 p-[20px] bg-white">
          {/* Top Section */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Image
                source={icons.temLogo}
                className="w-[22px] h-[30px]"
                resizeMode="contain"
              />
              <Text className="ms-2 text-[20px] font-bold">StudyHub</Text>
            </View>
            <Image
              source={icons.notificationOn}
              className="w-[20px] h-[25px]"
              resizeMode="contain"
            />
          </View>

          {/* Search Bar */}
          <View className="space-y-2">
            <View className="w-full h-16 px-4 bg-secondary rounded-3xl items-center flex-row">
              <Image
                source={icons.search}
                className="w-6 h-6 me-3"
                resizeMethod="contain"
              />
              <TextInput
                className="flex-1 w-full text-primary font-psemibold text-base"
                style={{ color: "#7b7b8b" }}
                placeholder="Search..."
                placeholderTextColor="#7b7b8b"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </View>
          </View>

          {/* Search Results */}
          {searchQuery ? (
            loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : books.length > 0 ? (
              <FlatList
                data={books}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("infoPage", { book: item })
                    }
                  >
                    <View className="rounded-lg bg-white m-2 p-2 flex-row items-center">
                      {/* Book Image */}
                      {item.volumeInfo.imageLinks?.thumbnail ? (
                        <Image
                          source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                          className="w-[60px] h-[90px] rounded-lg"
                        />
                      ) : (
                        <View className="w-[60px] h-[90px] rounded-lg bg-gray-300 items-center justify-center">
                          <Text className="text-[12px] text-center">
                            No Image
                          </Text>
                        </View>
                      )}

                      {/* Book Details */}
                      <View className="ml-4">
                        <Text
                          className="text-[14px] font-bold"
                          numberOfLines={1}
                        >
                          {item.volumeInfo.title || "No Title"}
                        </Text>
                        <Text
                          className="text-[12px] text-gray-500"
                          numberOfLines={1}
                        >
                          {item.volumeInfo.authors?.join(", ") ||
                            "Unknown Author"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text className="text-center text-gray-500 mt-4">
                No results found.
              </Text>
            )
          ) : (
            // Show categories when no search query is entered
            <>
              <BooksType type="Science" navigation={navigation} />
              <BooksType type="Mathematics" navigation={navigation} />
              <BooksType type="English" navigation={navigation} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

export default HomeScreen;
