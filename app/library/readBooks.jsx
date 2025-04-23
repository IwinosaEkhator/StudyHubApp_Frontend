import { View, Text } from "react-native";
import React from "react";
import WebView from "react-native-webview";

const ReadBookScreen = ({ route }) => {
  return <WebView source={{ uri: route.params.url }} style={{ flex: 1 }} />;
};

export default ReadBookScreen;
