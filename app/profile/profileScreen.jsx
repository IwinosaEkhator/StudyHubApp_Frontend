import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native";
import icons from "../../constants/icons";
import images from "../../constants/images";
import CustomButton from "../../components/CustomButton";
import CameraIcon from "../../components/icons/CameraIcon";
import RBSheet from "react-native-raw-bottom-sheet";
import ClearIcon from "../../components/icons/ClearIcon";
import ScanIcon from "../../components/icons/ScanIcon";
import PhotoIcon from "../../components/icons/PhotoIcon";
import TrashIcon from "../../components/icons/TrashIcon";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import API_ENDPOINTS from "../../api/apiConfig";
import * as ImagePicker from "expo-image-picker";
import DefaultProfileIcon from "../../components/icons/DefaultProfileIcon";

const SETTINGS = [
  {
    key: "mybooks",
    label: "My Books",
    icon: icons.booksIcon,
    link: "Bookmark",
  },
  {
    key: "bookmarks",
    label: "Bookmark",
    icon: icons.bookmark,
    link: "Bookmark",
  },
];

export default function ProfileScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.6}
      onPress={() => {
        navigation.navigate(item.link);
        console.log("Pressed", item.key);
      }}
    >
      <View style={styles.left}>
        <Image source={item.icon} style={styles.icon} />
        <Text style={styles.label}>{item.label}</Text>
      </View>
      <Image
        source={icons.blackArrowBack}
        style={[styles.chevron, { transform: [{ rotate: "180deg" }] }]}
      />
    </TouchableOpacity>
  );

  const photoSheetRef = useRef();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const { logout, accessToken } = useContext(AuthContext);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile data...");
        const response = await axios.get(API_ENDPOINTS.profile, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("Fetched profile:", response.data.user);
        setProfile(response.data.user);
      } catch (error) {
        console.error(
          "Error fetching profile:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken]);

  // Function to take a new photo using the device camera
  const handleTakePhoto = async () => {
    // Request camera permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      Alert.alert("Permission required", "Camera permission is required!");
      return;
    }

    // Launch camera
    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (
      pickerResult.cancelled ||
      !pickerResult.assets ||
      pickerResult.assets.length === 0
    ) {
      console.log("Camera cancelled or no asset returned");
      return;
    }

    const localUri = pickerResult.assets[0].uri;
    const filename = localUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("profile_photo", { uri: localUri, name: filename, type });

    try {
      console.log("Uploading new photo from camera...");
      const response = await axios.post(
        API_ENDPOINTS.profile + "/photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Camera photo update response:", response.data);
      if (response.data.message) {
        Alert.alert("Success", response.data.message);
        setProfile(response.data.user);
      } else {
        Alert.alert("Error", response.data.message || "Photo upload failed");
      }
    } catch (error) {
      console.log("Uploading… token =", accessToken);
      console.error(
        "Error uploading camera photo:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "An error occurred while uploading your photo.");
    }
    photoSheetRef.current.close();
  };

  // Function to choose an existing photo from the library (similar to your current implementation)
  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access media library is required!"
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (
      pickerResult.cancelled ||
      !pickerResult.assets ||
      pickerResult.assets.length === 0
    ) {
      console.log("Image picker cancelled or no asset returned");
      return;
    }

    const localUri = pickerResult.assets[0].uri;
    const filename = localUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("profile_photo", { uri: localUri, name: filename, type });

    try {
      console.log("Uploading chosen photo...");
      const response = await axios.post(
        API_ENDPOINTS.profile + "/photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Library photo update response:", response.data);
      if (response.data.message) {
        Alert.alert("Success", response.data.message);
        setProfile(response.data.user);
      } else {
        Alert.alert("Error", response.data.message || "Photo upload failed");
      }
    } catch (error) {
      console.error(
        "Error uploading library photo:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "An error occurred while uploading your photo.");
    }
    photoSheetRef.current.close();
  };

  // Function to delete the current profile photo
  const handleDeletePhoto = async () => {
    try {
      console.log("Deleting profile photo...");
      const response = await axios.delete(API_ENDPOINTS.profile + "/photo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log("Delete photo response:", response.data);
      if (response.data.message) {
        Alert.alert("Success", response.data.message);
        setProfile(response.data.user);
      } else {
        Alert.alert("Error", response.data.message || "Failed to delete photo");
      }
    } catch (error) {
      console.error(
        "Error deleting photo:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "An error occurred while deleting your photo.");
    }
    photoSheetRef.current.close();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loaderText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // if (!profile) {
  //   return (
  //     <SafeAreaView style={styles.safeArea}>
  //       <Text style={styles.errorText}>Error loading profile.</Text>
  //     </SafeAreaView>
  //   );
  // }

  // Log Out
  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result) {
        navigation.reset({ index: 0, routes: [{ name: "Onboarding" }] }); // ✅ Ensure proper reset to Onboarding
      }
    } catch (error) {
      console.error("Logout error in ProfileScreen:", error);
      Alert.alert(
        "Logout Error",
        error.response?.data?.error ||
          "An unexpected error occurred. Please try again."
      );
    }
  };
  
  return (
    <>
      <SafeAreaView style={styles.safeArea} classname="bg-white w-full h-full">
        <View style={{ padding: 20, paddingTop: 40 }}>
          {/* Navigation Back */}
          <View style={styles.headerRow}>
            <View></View>
            <Text style={styles.header}>My Profiles</Text>
            <View></View>
          </View>

          {/* Profile */}
          <View style={styles.profileRow}>
            <View>
              {/* Display profile photo if available, otherwise show default */}
              {profile.profile_photo ? (
                <Image
                  source={{
                    uri: `${API_ENDPOINTS.profile_photo_base_url}/storage/${profile.profile_photo}`,
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <DefaultProfileIcon style={styles.profileImage} />
              )}
              <TouchableOpacity
                onPress={() => photoSheetRef.current.open()}
                style={styles.cameraBox}
              >
                <CameraIcon styles={styles} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.nameText}>{profile.username}</Text>
              <Text style={{ marginBottom: 15 }}>{profile.email}</Text>
              <CustomButton
                title="Edit Profile"
                containerStyles="min-h-[45px]"
                textStyles="text-2xl"
                handlePress={() => navigation.navigate("EditProfile")}
              />
            </View>
          </View>

          {/* Shortcuts */}
          <FlatList
            data={SETTINGS}
            renderItem={renderItem}
            keyExtractor={(i) => i.key}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
          <View style={styles.separator} />
          {/* Log Out */}
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.6}
            onPress={handleLogout}
          >
            <View style={styles.left}>
              <Image source={icons.exitIcon} style={styles.icon2} />
              <Text style={styles.label}>Log out</Text>
            </View>
            <Image
              source={icons.blackArrowBack}
              style={[styles.chevron, { transform: [{ rotate: "180deg" }] }]}
            />
          </TouchableOpacity>

          <RBSheet
            ref={photoSheetRef}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
              container: {
                paddingVertical: 20,
                paddingHorizontal: 30,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                height: 300,
              },
              draggableIcon: { backgroundColor: "#000" },
            }}
          >
            <View style={styles.sheetHeader}>
              <Text></Text>
              <Text style={styles.sheetTitle}>Change Photo</Text>
              <TouchableOpacity onPress={() => photoSheetRef.current.close()}>
                <ClearIcon style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.photoActionButton, { backgroundColor: "#000" }]}
              onPress={handleTakePhoto}
            >
              <View
                style={[styles.photoActionIcon, { backgroundColor: "#fff" }]}
              >
                <ScanIcon />
              </View>
              <Text style={[styles.photoActionText, { color: "#fff" }]}>
                Take New Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoActionButton}
              onPress={handleChoosePhoto}
            >
              <View style={styles.photoActionIcon}>
                <PhotoIcon />
              </View>
              <Text style={styles.photoActionText}>Choose Existing Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoActionButton}
              onPress={handleDeletePhoto}
            >
              <View style={styles.photoActionIcon}>
                <TrashIcon />
              </View>
              <Text style={[styles.photoActionText]}>Delete Photo</Text>
            </TouchableOpacity>
          </RBSheet>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 25,
  },
  backIcon: { width: 26, height: 26 },
  header: { fontSize: 22, fontWeight: "bold", marginLeft: 12 },

  // Profile
  profileRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginRight: 30 },
  cameraBox: {
    padding: 7,
    backgroundColor: "#000",
    borderRadius: 20,
    position: "absolute",
    bottom: 6,
    right: 20,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  // ShortCuts
  row: {
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    tintColor: "#555", // match your grey
    marginRight: 16,
  },
  icon2: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    // tintColor: "#555", // match your grey
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  chevron: {
    width: 16,
    height: 16,
    tintColor: "#999",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 18, fontWeight: "500", marginLeft: 10 },
  sheetSubTitle: { fontSize: 16, fontWeight: "500", marginBottom: 10 },
  photoActionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
  },
  photoActionIcon: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.2)",
    marginRight: 10,
  },
  photoActionText: {
    fontSize: 16,
    fontWeight: 500,
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { marginTop: 12, fontSize: 16, color: "#666" },
  errorText: { textAlign: "center", color: "red", marginTop: 20 },
});
