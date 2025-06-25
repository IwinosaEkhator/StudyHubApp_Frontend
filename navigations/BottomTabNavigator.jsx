// App.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "../app/profile/profileScreen";
import HomeScreen from "../app/library/homeScreen";
import icons from "../constants/icons";
import HomeIcon from "../components/icons/HomeIcon";
import ProfileIcon from "../components/icons/ProfileIcon";
import UploadBookScreen from "../app/books/upload";
import AddCircleIcon from "../components/icons/AddCircleIcon";
import ChatListScreen from "../app/chat/chatListScreen";
import ChatIcon from "../components/icons/ChatIcon";
import ChatScreen from "../app/chat/chatScreen";
import PostScreen from "../app/community/postScreen";
import CommunityIcon from "../components/icons/CommunityIcon";

const Tab = createBottomTabNavigator();

// Custom tab bar component
function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, idx) => {
        const focused = state.index === idx;
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? route.name;
        const icon = options.tabBarIcon({ focused });
        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(route.name)}
            style={[styles.tabButton, focused && styles.tabButtonActive]}
          >
            {icon}
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              fill={focused ? "#FFF" : "rgba(0, 0, 0, 0.5)"}
              style={styles.icon}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ focused }) => (
            <ChatIcon
              fill={focused ? "#FFF" : "rgba(0, 0, 0, 0.5)"}
              style={styles.icon}
              stroke={focused ? "#FFF" : "rgba(0, 0, 0, 0.5)"}
            />
          ),
        }}
      />

      {/* <Tab.Screen
        name="Upload"
        component={UploadBookScreen}
        options={{
          tabBarLabel: "Upload",
          tabBarIcon: ({ focused }) => (
            <AddCircleIcon
              fill={focused ? "#FFF" : "rgba(0, 0, 0, 0.5)"}
              style={styles.icon}
            />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Community"
        component={PostScreen}
        options={{
          tabBarLabel: "Connect",
          tabBarIcon: ({ focused }) => (
            <CommunityIcon
              fill={focused ? "#FFF" : "rgba(0, 0, 0, 0.5)"}
              style={styles.icon}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <ProfileIcon
              fill={focused ? "#FFF" : "rgba(0, 0, 0, 0.5)"}
              style={styles.icon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center" },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: Platform.OS === "ios" ? 20 : 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  tabButton: {
    // flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: "#000",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: "rgba(0,0,0,0.5)",
  },
  tabLabelActive: {
    color: "#fff",
    fontWeight: "600",
  },
});
