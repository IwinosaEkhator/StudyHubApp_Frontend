import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import API_ENDPOINTS from "../../api/apiConfig";
import CustomButton from "../../components/CustomButton";

export default function TopicsScreen({ navigation }) {
  const { authLoaded, user, accessToken, setProfileComplete } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);

  if (!authLoaded || (user && !accessToken)) return null;

  const SUBJECTS_URL = `${API_ENDPOINTS.users.replace("/users", "")}/subjects`;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(SUBJECTS_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        console.error("Failed to load subjects:", err);
        Alert.alert("Error", "Could not load topics. Please try again.");
      }
    })();
  }, [accessToken]);

  const toggle = (id) => {
    const newSet = new Set(selected);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelected(newSet);
  };

  const submit = async () => {
    if (!selected.size) {
      return Alert.alert("Select at least three topic.");
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.users}/${user.id}/subjects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjects: Array.from(selected) }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      await setProfileComplete(true);
      navigation.navigate("Main", { screen: "Home" });
      console.log("Good");
      
    } catch (err) {
      console.error("Failed to save topics:", err);
      Alert.alert("Error", "Could not save your selections.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Which topics interest you?</Text>
      <Text style={styles.subtitle}>Please pick 3 or more</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {subjects.map((item) => {
          const isActive = selected.has(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggle(item.id)}
              style={[
                styles.tag,
                isActive && styles.tagActive,
              ]}
            >
              <Text style={[
                styles.tagText,
                isActive && styles.tagTextActive,
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <CustomButton
        title={loading ? "Saving…" : "Continue"}
        handlePress={submit}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 30 },
  title: { fontSize: 18, marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 20, color: 'gray' },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  tag: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: 'transparent',
  },
  tagActive: {
    backgroundColor: 'black',
  },
  tagText: {
    color: 'black',
    fontSize: 16,
  },
  tagTextActive: {
    color: 'white',
  },
});
