import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  SectionList,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";

const contactsData = [
  {
    id: "1",
    name: "Andykan Akpan",
    image: require("../../assets/images/Ellipse 4.png"),
    letter: "A",
  },
  {
    id: "2",
    name: "Bale Waters",
    image: require("../../assets/images/Ellipse 4.png"),
    letter: "B",
  },
  {
    id: "3",
    name: "Ben Freeman",
    image: require("../../assets/images/Ellipse 4.png"),
    letter: "B",
  },
  {
    id: "4",
    name: "Captain Youth",
    image: require("../../assets/images/Ellipse 4.png"),
    letter: "C",
  },
  {
    id: "5",
    name: "Campbell Banner",
    image: require("../../assets/images/Ellipse 4.png"),
    letter: "C",
  },
  {
    id: "6",
    name: "Cassandra Bill",
    image: require("../../assets/images/Ellipse 4.png"),
    letter: "C",
  },
  {
    id: "7",
    name: "Danny Simmons",
    image: require("../../assets/images/Ellipse 4.png"),
    letter: "D",
  },
  {
    id: "8",
    name: "Edison Jamal",
    image: require("../../assets/images/Ellipse 4.png"),
    letter: "E",
  },
  {
    id: "9",
    name: "Gandhi Randi",
    image: require("../../assets/images/Ellipse 4.png"),
    letter: "G",
  },
  {
    id: "10",
    name: "Gordon Hayden",
    image: require("../../assets/images/Ellipse 4.png"),
    letter: "G",
  },
  // ... more contacts ...
];

function groupContactsByLetter(contacts) {
  const map = {};

  contacts.forEach((contact) => {
    const letter = contact.letter.toUpperCase();
    if (!map[letter]) {
      map[letter] = [];
    }
    map[letter].push(contact);
  });

  // Convert the map into an array of { title, data } for SectionList
  return Object.keys(map)
    .sort()
    .map((letter) => ({
      title: letter,
      data: map[letter],
    }));
}

const AddPeopleScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Filter & group the data each time searchText changes
  const sections = useMemo(() => {
    const lowerSearch = searchText.toLowerCase();
    // Filter the contacts by name
    const filtered = contactsData.filter((contact) =>
      contact.name.toLowerCase().includes(lowerSearch)
    );
    // Group them by letter
    return groupContactsByLetter(filtered);
  }, [searchText]);

  // Render each contact row
  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;

    if (isSelected) {
      navigation.navigate("");
    }

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => setSelectedId(item.id)}
      >
        <Image source={item.image} style={styles.profileImage} />
        <Text style={styles.nameText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  // Render the letter header (A, B, C, etc.)
  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={icons.blackArrowBack}
              style={styles.backIcon}
              resizeMethod="contain"
            />
          </TouchableOpacity>
          <Text style={styles.header}>Start New Chat</Text>
        </View>

        {/* Search Bar */}
        <SearchBar searchText={searchText} setSearchText={setSearchText} />

        {/* Alphabetically Grouped List */}
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          // stickySectionHeadersEnabled
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  headerRow: { flexDirection: "row", alignItems: "center", paddingBottom: 18 },
  backIcon: { width: 24, height: 24 },
  header: { fontSize: 22, fontWeight: "bold", marginLeft: 12 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 6,
    color: "#000",
    opacity: 0.5,
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
    backgroundColor: "#eee", // fallback if no image
    marginRight: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 600,
    flex: 1, // let name take up remaining space
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  inActiveNextButton: {
    backgroundColor: "#000",
    borderRadius: 15,
    paddingVertical: 18,
    alignItems: "center",
    opacity: 0.5,
  },
});

export default AddPeopleScreen;
