import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  SectionList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import icons from "../../constants/icons";
import API_ENDPOINTS, { API_BASE_URL } from "../../api/apiConfig"; // or wherever you keep it
import { AuthContext } from "../../context/AuthContext";
import DefaultProfileIcon from "../../components/icons/DefaultProfileIcon";

// helper to group by first letter
function groupByLetter(items) {
  const map = {};
  items.forEach((u) => {
    const letter = (u.username[0] || "#").toUpperCase();
    map[letter] = map[letter] || [];
    map[letter].push(u);
  });
  return Object.keys(map)
    .sort()
    .map((letter) => ({
      title: letter,
      data: map[letter],
    }));
}

export default function AddPeopleScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const { accessToken } = useContext(AuthContext);
  const [sections, setSections] = useState([]);

  // fetch all users on mount
  // load users once
  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(API_ENDPOINTS.users, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setUsers(resp.data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken]);

  // group & filter whenever users or searchText change
  useEffect(() => {
    const filtered = users.filter((u) =>
      u.username.toLowerCase().includes(searchText.toLowerCase())
    );
    const map = {};
    filtered.forEach((u) => {
      const letter = u.username[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(u);
    });
    const secs = Object.keys(map)
      .sort()
      .map((letter) => ({
        title: letter,
        data: map[letter],
      }));
    setSections(secs);
  }, [users, searchText]);

  // filter + group whenever users or searchText changes
  // const sections = useMemo(() => {
  //   const lower = searchText.toLowerCase();
  //   const filtered = users.filter((u) =>
  //     u.username.toLowerCase().includes(lower)
  //   );
  //   return groupByLetter(filtered);
  // }, [users, searchText]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={async () => {
        try {
          // 1) create (or fetch) the 1:1 conversation
          const resp = await axios.post(
            API_ENDPOINTS.conversations,
            { participant_id: item.id },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const { id: conversationId } = resp.data;

          // 2) navigate into the chat
          navigation.navigate("ChatRoom", {
            conversationId,
            otherUser: {
              id: item.id,
              username: item.username,
              profile_photo: item.profile_photo,
            },
          });
        } catch (err) {
          console.error("Could not start conversation", err);
          Alert.alert("Error", "Unable to start chat. Please try again.");
        }
      }}
    >
      {item.profile_photo ? (
        <Image
          source={{
            uri: `${API_ENDPOINTS.profile_photo_base_url}/storage/${item.profile_photo}`,
          }}
          style={styles.profileImage}
        />
      ) : (
        <DefaultProfileIcon style={styles.profileImage} />
      )}
      <Text style={styles.nameText}>{item.username}</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.blackArrowBack}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.header}>Start New Chat</Text>
        </View>

        {/* search */}
        <SearchBar searchText={searchText} setSearchText={setSearchText} />

        {/* list */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  backIcon: { width: 24, height: 24 },
  header: { fontSize: 22, fontWeight: "bold", marginLeft: 12 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#333",
    opacity: 0.6,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
