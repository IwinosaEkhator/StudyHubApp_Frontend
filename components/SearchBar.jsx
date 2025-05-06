import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import SearchIcon from "./icons/SearchIcon";
import { TextInput } from "react-native-gesture-handler";

const SearchBar = ({ searchText, setSearchText, containerStyles }) => {


  return (
    <View style={[styles.searchContainer, {containerStyles}]}>
      {/* <Ionicons name="search-outline" size={20} color="#999" /> */}
      <SearchIcon/>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    backgroundColor: "rgba(217, 217, 217, 0.35)",
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
    fontWeight: 500,
    color: "#000",
  },
});

export default SearchBar;
