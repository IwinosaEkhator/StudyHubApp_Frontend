import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import { BookmarkContext } from "../../context/BookmarkContext";

const InfoPage = ({ route, navigation }) => {
  const book = route?.params?.book;
  // const bookData = book ? JSON.parse(book) : null;

  if (!book) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <Text>No book data provided.</Text>
      </View>
    );
  }

  const {
    title,
    authors,
    averageRating,
    pageCount,
    description,
    imageLinks = {},
    language,
    previewLink
  } = book.volumeInfo;

  const handleReadBook = (book) => {
    if (previewLink) {
      navigation.navigate("ReadBook", { url: previewLink });
    } else {
      Alert.alert("No Preview Available", "This book doesn't have a preview.");
    }
  };

  const { isBookmarked, addBookmark, removeBookmark } = useContext(BookmarkContext);
  const bookmarked = isBookmarked(book.id);

  const toggle = () => {
    if (bookmarked) removeBookmark(book.id);
    else addBookmark(book);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 110 }}>
        <View>
          <Image
            source={{ uri: imageLinks?.thumbnail }}
            style={{ width: "100%", height: 350 }}
          />

          {/* Blur Effect at the Bottom */}
          <LinearGradient
            colors={["transparent", "#fff"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 350,
            }}
          />
        </View>

        <View className="w-[100%] absolute top-6 flex-row justify-between items-center px-6">
          <TouchableOpacity style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", padding: 7, borderRadius: 10 }} onPress={() => navigation.goBack()}>
            <Image
              source={icons.arrowBack}
              className="w-7 h-7"
              resizeMethod="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: "rgba(0, 0, 0, 0.2)", padding: 7, borderRadius: 10 }} onPress={toggle}>
            <Image
              source={bookmarked ? icons.bookmarkFilled : icons.bookmarkOutlined}
              className="w-7 h-7"
              resizeMethod="contain"
            />
          </TouchableOpacity>
        </View>

        <View className="mt-24 w-full absolute">
          <View className="w-full flex-row justify-center mb-6">
            <Image
              source={{ uri: imageLinks?.thumbnail }}
              className="w-[120px] h-[210px] rounded-lg"
            />
          </View>
          <Text className="text-center font-bold text-[20px] mb-2">
            {title}
          </Text>
          <Text className="text-center">
            {authors?.join(", ") || "Unknown Author"}
          </Text>
        </View>

        <View className="flex-row justify-center items-center mt-16">
          <View className="w-[110] h-[90] border-gray-300 border-2 rounded-lg me-3">
            <View className="h-[50%] p-3">
              <Text className="text-gray-600 font-semibold text-[15px] text-center">
                Rating
              </Text>
            </View>
            <View className="bg-primary2 h-[50%] p-3 rounded-b-md">
              {averageRating ? (
                <Text className="font-bold text-[17px] text-center">
                  ⭐ {averageRating.toFixed(1)}
                  <Text>/5.0</Text>{" "}
                </Text>
              ) : (
                <Text className="font-bold text-[17px] text-center">
                  ⭐ 0.0 <Text className="font-normal text-gray-600">/5.0</Text>
                </Text>
              )}
            </View>
          </View>
          <View className="w-[110] h-[90] border-gray-300 border-2 rounded-lg me-3">
            <View className="h-[50%] p-3">
              <Text className="text-gray-600 font-semibold text-[15px] text-center">
                Pages
              </Text>
            </View>
            <View className="bg-primary2 h-[50%] p-3 rounded-b-md">
              <Text className="font-bold text-[17px] text-center">
                {pageCount || "Unknown"}
              </Text>
            </View>
          </View>
          <View className="w-[110] h-[90] border-gray-300 border-2 rounded-lg">
            <View className="h-[50%] p-3">
              <Text className="text-gray-600 font-semibold text-[15px] text-center">
                Language
              </Text>
            </View>
            <View className="bg-primary2 h-[50%] p-3 rounded-b-md">
              <Text className="font-bold text-[17px] text-center">
                {language?.toUpperCase() || "Unknown"}
              </Text>
            </View>
          </View>
        </View>
        <View className="mt-8 px-5">
          <Text className="font-bold text-[19px] mb-4">Description</Text>
          <Text className="text-[16px] text-justify text-base/8">
            {description || "No description available."}
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Button at the Bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-md">
        {/* Blur Effect at the Bottom */}
        <LinearGradient
          colors={["transparent", "#fff"]}
          style={{
            position: "absolute",
            top: -70,
            left: 0,
            right: 0,
            height: 70,
          }}
        />

        <CustomButton
          title="Start Reading"
          handlePress={handleReadBook}
          containerStyles="w-full"
          // isLoading={isSubmitting} // Disable button while submitting
        />
      </View>
    </View>
  );
};

export default InfoPage;
