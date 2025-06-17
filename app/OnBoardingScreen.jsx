import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import images from "../constants/images";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen({ navigation }) {
  const slides = [
    {
      key: "slide1",
      headline: "Welcome to StudyHub",
      text:
        "Your all‑in‑one digital library designed around you. Access thousands of resources 24/7, connect with peers, and make every study session a collaborative journey.",
      // you can add an image here if you like
      image: images.welcomeImage,
    },
    {
      key: "slide2",
      headline: "Learn. Collaborate. Innovate.",
      text:
        "An interactive digital library that lets you access resources, collaborate in real time, and connect with a learning community anytime, anywhere.",
      image: images.collaborationImage,
    },
    {
      key: "slide3",
      headline: "Join the Knowledge Network",
      text:
        "Create your free account to start exploring, collaborating, and shaping the future of learning. Ready to transform how you discover and share knowledge?",
      image: images.joinImage,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        loop={false}
        autoplay
        autoplayTimeout={3}
        activeDotColor="#007bff"
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        {slides.map((slide, i) => (
          <View style={styles.slide} key={slide.key}>
            {slide.image && <Image source={slide.image} style={styles.image} />}
            <Text style={styles.headline}>{slide.headline}</Text>
            <Text style={styles.text}>{slide.text}</Text>
          </View>
        ))}
      </Swiper>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.primary]}
          onPress={() => navigation.navigate("Auth", { screen: "SignUp" })}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={() => navigation.navigate("Auth", { screen: "SignIn" })}
        >
          <Text style={[styles.buttonText, { color: "#000" }]}>Log In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  slide: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  image: {
    width: width * 0.8,
    height: height * 0.3,
    resizeMode: "contain",
    marginBottom: 30,
  },
  headline: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    lineHeight: 24,
  },
  buttons: {
    // position: "absolute",
    // bottom: 60,
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  primary: {
    backgroundColor: "#000",
  },
  secondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  dot: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#000",
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 3,
  },
});
