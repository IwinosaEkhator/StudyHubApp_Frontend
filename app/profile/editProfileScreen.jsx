// src/screens/EditProfileScreen.js
import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";
import API_ENDPOINTS from "../../api/apiConfig";
import RBSheet from "react-native-raw-bottom-sheet";
import CameraIcon from "../../components/icons/CameraIcon";
import ClearIcon from "../../components/icons/ClearIcon";
import ScanIcon from "../../components/icons/ScanIcon";
import PhotoIcon from "../../components/icons/PhotoIcon";
import TrashIcon from "../../components/icons/TrashIcon";
import axios from "axios";
import CustomButton from "../../components/CustomButton";

export default function EditProfileScreen({ navigation }) {
  const { user, accessToken, setUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  //   const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  const photoSheetRef = useRef();
  const [profile, setProfile] = useState(null);

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

  const handleSave = async () => {
    setLoading(true);
    const form = new FormData();
    form.append("name", name);
    form.append("email", email);

    try {
      const resp = await fetch(API_ENDPOINTS.profileUpdate, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // DO NOT set Content-Type; fetch will add the multipart boundary
        },
        body: form,
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || "Update failed");
      // update context
      setUser(data.user);
      Alert.alert("Success", "Profile updated");
      navigation.goBack();
    } catch (err) {
      console.error("Update error:", err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Edit Profile</Text>

        <View style={styles.photoContainer}>
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
        </View>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={profile.username}
          onChangeText={setName}
          style={styles.input}
          placeholder="Your name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={profile.email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="you@example.com"
          keyboardType="email-address"
        />
        <View style={{ position: "absolute", bottom: 10, left: 10, right: 10}}>
          <CustomButton
            title="Save Changes"
            containerStyles={styles.saveButton}
            textAlign={styles.saveButtonText}
            handlePress={handleSave}
            loading={loading}
          />
        </View>

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
            <View style={[styles.photoActionIcon, { backgroundColor: "#fff" }]}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
    height: "100%"
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    height: "100%"
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  photoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraBox: {
    padding: 7,
    backgroundColor: "#000",
    borderRadius: 20,
    position: "absolute",
    bottom: 6,
    right: 0,
  },
  photoPlaceholder: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  photoPlaceholderText: {
    color: "#888",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#007bff",
    borderRadius: 4,
    marginHorizontal: 8,
  },
  smallButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
});
