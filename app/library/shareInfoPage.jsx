import React from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Alert 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";

export default function ShareInfoPage({ route, navigation }) {
  // safely grab `book` (may be undefined if nav call was wrong)
  const book = route.params?.book;

  if (!book) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <Text>No book data provided.</Text>
      </View>
    );
  }

  // now destructure from the guaranteed `book` object
  const {
    title,
    authors,
    description,
    imageLinks = {},
    averageRating,
    pageCount,
    language,
    previewLink,
  } = book;

  const handleReadBook = () => {
    if (previewLink) {
      navigation.navigate("ReadBook", { url: previewLink });
    } else {
      Alert.alert("No Preview", "This book has no preview available.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cover image with gradient fade */}
        <View style={{ height: 350, position: "relative" }}>
          <Image
            source={{ uri: imageLinks.thumbnail }}
            style={{ width: "100%", height: "100%" }}
          />
          <LinearGradient
            colors={["transparent", "#fff"]}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: 200,
            }}
          />
        </View>

        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: "absolute",
            top: 40,
            left: 20,
            backgroundColor: "rgba(0,0,0,0.3)",
            padding: 8,
            borderRadius: 8,
          }}
        >
          <Image
            source={icons.arrowBack}
            style={{ width: 24, height: 24, tintColor: "#fff" }}
          />
        </TouchableOpacity>

        {/* Main info */}
        <View style={{ alignItems: "center", marginTop: -100 }}>
          <Image
            source={{ uri: imageLinks.thumbnail }}
            style={{
              width: 120,
              height: 180,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "#fff",
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: "700", marginTop: 12 }}>
            {title}
          </Text>
          <Text style={{ color: "#666", marginTop: 4 }}>
            {authors?.join(", ") || "Unknown Author"}
          </Text>
        </View>

        {/* Stats row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 20,
          }}
        >
          {/* Rating */}
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#666" }}>Rating</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 4 }}>
              ⭐ {averageRating?.toFixed(1) || "0.0"}
            </Text>
          </View>
          {/* Pages */}
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#666" }}>Pages</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 4 }}>
              {pageCount || "N/A"}
            </Text>
          </View>
          {/* Language */}
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#666" }}>Language</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 4 }}>
              {language?.toUpperCase() || "—"}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Description
          </Text>
          <Text style={{ fontSize: 16, color: "#444", lineHeight: 22 }}>
            {description || "No description available."}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom “Start Reading” button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: 16,
          backgroundColor: "#fff",
        }}
      >
        <LinearGradient
          colors={["transparent", "#fff"]}
          style={{
            position: "absolute",
            top: -80,
            width: "100%",
            height: 80,
          }}
        />
        <CustomButton title="Start Reading" handlePress={handleReadBook} />
      </View>
    </View>
  );
}