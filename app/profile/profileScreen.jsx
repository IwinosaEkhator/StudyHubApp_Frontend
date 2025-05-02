import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useContext, useRef } from "react";
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

const SETTINGS = [
  { key: "mybooks", label: "My Books", icon: icons.booksIcon },
  { key: "bookmarks", label: "Bookmark", icon: icons.bookmark },
];

export default function ProfileScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.6}
      onPress={() => {
        // e.g. navigation.navigate(item.key)
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

  const { logout, accessToken } = useContext(AuthContext);

  // Update profile via API (for text fields)
  // const handleUpdateProfile = async () => {
  //   if (!selectedValue) {
  //     Alert.alert("Error", "Value cannot be empty");
  //     return;
  //   }
  //   console.log("Updating field:", selectedField, "with value:", selectedValue);
  //   try {
  //     const response = await axios.patch(
  //       API_ENDPOINTS.profileUpdate,
  //       {
  //         [selectedField]: selectedValue,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       }
  //     );
  //     console.log("Update response:", response.data);
  //     if (response.data.message) {
  //       Alert.alert("Success", response.data.message);
  //       setProfile(response.data.user);
  //       bottomSheetRef.current.close();
  //     } else {
  //       Alert.alert("Error", response.data.message || "Update failed");
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error updating profile:",
  //       error.response?.data || error.message
  //     );
  //     let errorMessage = "An error occurred while updating your profile.";
  //     if (error.response?.data?.error) {
  //       if (typeof error.response.data.error === "string") {
  //         errorMessage = error.response.data.error;
  //       } else if (typeof error.response.data.error === "object") {
  //         errorMessage = Object.values(error.response.data.error)
  //           .flat()
  //           .join("\n");
  //       }
  //     }
  //     Alert.alert("Error", errorMessage);
  //   }
  // };

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
        <View style={{ padding: 20 }}>
          {/* Navigation Back */}
          <View style={styles.headerRow}>
            <View></View>
            <Text style={styles.header}>My Profiles</Text>
            <View></View>
          </View>

          {/* Profile */}
          <View style={styles.profileRow}>
            <View>
              <Image
                source={images.profileImage}
                style={styles.profileImage}
                resizeMethod="contain"
              />
              <TouchableOpacity
                onPress={() => photoSheetRef.current.open()}
                style={styles.cameraBox}
              >
                <CameraIcon styles={styles} />
              </TouchableOpacity>
            </View>

            <View>
              <Text style={styles.nameText}>Iwinosa</Text>
              <Text style={{ marginBottom: 10 }}>brasenekhator@gmail.com</Text>
              <CustomButton
                title="Edit Profile"
                containerStyles="min-h-[50px]"
                textStyles="text-2xl"
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
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    marginRight: 20,
  },
  cameraBox: {
    padding: 7,
    backgroundColor: "#000",
    borderRadius: 20,
    position: "absolute",
    bottom: 6,
    right: 15,
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
});
