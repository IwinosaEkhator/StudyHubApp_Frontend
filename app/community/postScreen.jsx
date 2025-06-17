import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DefaultProfileIcon from "../../components/icons/DefaultProfileIcon";
import AddCircleOutlineIcon from "../../components/icons/AddCircleOutlineIcon";
import HeartIcon from "../../components/icons/HeartIcon";
import ChatIcon from "../../components/icons/ChatIcon";
import SaveIcon from "../../components/icons/SaveIcon";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import API_ENDPOINTS from "../../api/apiConfig";
import RBSheet from "react-native-raw-bottom-sheet";

export default function PostScreen({ navigation }) {
  const { accessToken } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Comment sheet state ---
  const commentSheetRef = useRef();
  const [activePost, setActivePost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // modal + form state
  const [modalVisible, setModalVisible] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // now array
  const [submitting, setSubmitting] = useState(false);

  // fetch feed on mount
  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(API_ENDPOINTS.posts, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setPosts(resp.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // debounce Google Books search
  useEffect(() => {
    if (searchQuery.length < 3) return setSuggestions([]);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
            searchQuery
          )}&maxResults=5`
        );
        const json = await res.json();
        setSuggestions(json.items || []);
      } catch (e) {
        console.error("Books search error:", e);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // submit new post
  const handleCreate = async () => {
    if (!newContent.trim()) {
      return Alert.alert("Validation", "Content cannot be empty");
    }
    // if (!selectedBook) {
    //   return Alert.alert("Validation", "Please pick one book");
    // }

    setSubmitting(true);
    try {
      const payload = {
        content: newContent,
        // book_link: selectedBook.volumeInfo.infoLink,
      };
      const resp = await axios.post(API_ENDPOINTS.posts, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // prepend the new post into your feed
      setPosts([resp.data, ...posts]);
      setModalVisible(false);

      // reset form
      setNewContent("");
      setSearchQuery("");
      setSuggestions([]);
      setSelectedBook(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert("Error", "Could not create post");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(API_ENDPOINTS.posts, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const rawPosts = resp.data;

        // For each post with a book_link, pull down volumeInfo
        const enriched = await Promise.all(
          rawPosts.map(async (p) => {
            if (!p.book_link) return p;

            // extract the volume ID from the query param `id=…`
            const m = p.book_link.match(
              /books\.google\.com\/books\?id=([^&]+)/
            );
            if (!m) return p;

            const volumeId = m[1];
            try {
              const b = await fetch(
                `https://www.googleapis.com/books/v1/volumes/${volumeId}`
              ).then((r) => r.json());
              return { ...p, bookMeta: b.volumeInfo };
            } catch {
              return p;
            }
          })
        );

        setPosts(enriched);
      } catch (e) {
        console.error("Error loading posts:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleLike = async (post) => {
    try {
      const { data } = await axios.post(
        `${API_ENDPOINTS.posts}/${post.id}/like`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // update local post in state
      setPosts(
        posts.map((p) =>
          p.id === post.id
            ? { ...p, likes_count: data.likes_count, liked: data.liked }
            : p
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  // When comment icon tapped:
  const openComments = async (post) => {
    setActivePost(post);
    setLoadingComments(true);
    commentSheetRef.current.open();

    try {
      const resp = await axios.get(
        `${API_ENDPOINTS.posts}/${post.id}/comments`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setComments(resp.data);
    } catch (e) {
      console.error("Error loading comments:", e);
      Alert.alert("Error", "Could not load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  // Submit new comment:
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    try {
      const resp = await axios.post(
        `${API_ENDPOINTS.posts}/${activePost.id}/comments`,
        { body: newComment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // prepend to list:
      setComments([resp.data, ...comments]);
      // also bump post's comment count locally:
      setPosts(
        posts.map((p) =>
          p.id === activePost.id
            ? { ...p, comments_count: p.comments_count + 1 }
            : p
        )
      );
      setNewComment("");
    } catch (e) {
      console.error("Error posting comment:", e);
      Alert.alert("Error", "Could not post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ marginVertical: 20 }}>
      <View style={styles.headerRow}>
        {item.user.profile_photo ? (
          <Image
            source={{
              uri: `${API_ENDPOINTS.profile_photo_base_url}/storage/${item.user.profile_photo}`,
            }}
            style={styles.profileImage}
          />
        ) : (
          <DefaultProfileIcon style={styles.profileImage} />
        )}
        <View>
          <Text style={styles.username}>{item.user.username}</Text>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text style={styles.content}>{item.content}</Text>

      {/* show each linked book */}
      {item.bookMeta && (
        <TouchableOpacity
          style={styles.bookCard}
          onPress={() =>
            navigation.navigate("infoPage2", {
              // send the entire volumeInfo + id so InfoPage can render it
              book: item.bookMeta,
            })
          }
        >
          {item.bookMeta.imageLinks?.thumbnail ? (
            <Image
              source={{ uri: item.bookMeta.imageLinks.thumbnail }}
              style={styles.bookImage}
            />
          ) : (
            <View style={[styles.bookImage, styles.noImage]}>
              <Text style={{ fontSize: 12 }}>No Image</Text>
            </View>
          )}
          <View style={styles.bookInfo}>
            <Text
              style={styles.bookTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.bookMeta.title || "No Title"}
            </Text>
            <Text
              style={styles.bookAuthors}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.bookMeta.authors
                ? item.bookMeta.authors.join(", ")
                : "Unknown Author"}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <TouchableOpacity onPress={() => toggleLike(item)}>
            <HeartIcon fill={item.liked ? "red" : "none"} />
          </TouchableOpacity>
          <Text style={styles.statText}>{item.likes_count || 0}</Text>
        </View>
        {/* comment */}
        <View style={styles.stat}>
          <TouchableOpacity onPress={() => openComments(item)}>
            <ChatIcon fill="#000" />
          </TouchableOpacity>
          <Text style={styles.statText}>{item.comments_count || 0}</Text>
        </View>
        <SaveIcon />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Connect</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ flex: 1, marginTop: 50 }} size="large" />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(p) => p.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>

      {/* Create Post Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => !submitting && setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Post</Text>
            <TouchableOpacity
              onPress={() => !submitting && setModalVisible(false)}
            >
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.fieldLabel}>Content</Text>
            <TextInput
              style={styles.textarea}
              multiline
              placeholder="What’s on your mind?"
              value={newContent}
              onChangeText={setNewContent}
            />

            <Text style={styles.fieldLabel}>Link Books</Text>
            <TextInput
              style={styles.input}
              placeholder="Search for a book…"
              value={searchQuery}
              onChangeText={(t) => {
                setSearchQuery(t);
                setSelectedBook([]);
              }}
            />

            {/* only render when we actually have suggestions */}
            {/* suggestions */}
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                keyExtractor={(b) => b.id}
                style={{ maxHeight: 200 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionRow}
                    onPress={() => {
                      setSelectedBook(item);
                      setSuggestions([]);
                      setSearchQuery(item.volumeInfo.title);
                    }}
                  >
                    {item.volumeInfo.imageLinks?.thumbnail && (
                      <Image
                        source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
                        style={styles.suggestionThumb}
                      />
                    )}
                    <Text style={styles.suggestionText}>
                      {item.volumeInfo.title}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* show selected */}
            {selectedBook && (
              <View style={styles.selectedBook}>
                {selectedBook.volumeInfo.imageLinks?.thumbnail && (
                  <Image
                    source={{
                      uri: selectedBook.volumeInfo.imageLinks.thumbnail,
                    }}
                    style={styles.selectedThumb}
                  />
                )}
                <Text style={styles.selectedTitle}>
                  {selectedBook.volumeInfo.title}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.modalButton, submitting && { opacity: 0.6 }]}
            onPress={handleCreate}
            disabled={submitting}
          >
            <Text style={styles.modalButtonText}>
              {submitting ? "Posting…" : "Post"}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <AddCircleOutlineIcon fill="#fff" />
      </TouchableOpacity>

      {/* ----- Comments RBSheet ----- */}
      <RBSheet
        ref={commentSheetRef}
        height={450}
        openDuration={250}
        customStyles={{
          container: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
        }}
      >
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 15 }}>
            Comments
          </Text>

          {loadingComments ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(c) => c.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.commentRow}>
                  {item.user.profile_photo ? (
                    <Image
                      source={{
                        uri: `${API_ENDPOINTS.profile_photo_base_url}/storage/${item.user.profile_photo}`,
                      }}
                      style={styles.commentAvatar}
                    />
                  ) : (
                    <DefaultProfileIcon style={styles.commentAvatar} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.commentAuthor}>
                      {item.user.username}
                    </Text>
                    <Text>{item.body}</Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  No comments yet.
                </Text>
              }
            />
          )}

          {/* input + submit */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.commentInputRow}
          >
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment…"
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              onPress={handleSubmitComment}
              disabled={submittingComment}
              style={styles.commentSubmitBtn}
            >
              <Text style={{ color: "#fff" }}>
                {submittingComment ? "…" : "Send"}
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  container: { padding: 20, flex: 1 },
  titleRow: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 32, fontWeight: "bold" },

  headerRow: { flexDirection: "row", alignItems: "center" },
  profileImage: { width: 60, height: 60, borderRadius: 50, marginRight: 10 },
  username: { fontSize: 18, fontWeight: "600" },
  date: { fontSize: 14, color: "#666" },

  content: { marginTop: 8, fontSize: 16, color: "#333" },
  linkedBooksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  linkedBook: {
    width: 80,
    marginRight: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  bookThumb: { width: 60, height: 90, borderRadius: 4 },
  bookTitle: { fontSize: 12, marginTop: 4, textAlign: "center" },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  stat: { flexDirection: "row", alignItems: "center" },
  statText: { marginLeft: 4, fontSize: 14 },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },

  modalSafeArea: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: { fontSize: 24, fontWeight: "700" },
  modalClose: { fontSize: 24, color: "#666" },

  modalBody: { flex: 1, marginTop: 20 },
  fieldLabel: { fontSize: 16, marginBottom: 6 },

  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },

  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  suggestionThumb: { width: 32, height: 48, marginRight: 10 },
  suggestionText: { flex: 1 },

  selectedBooks: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  selectedBook: {
    width: 80,
    marginRight: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  selectedThumb: { width: 60, height: 90, borderRadius: 4 },
  selectedTitle: { fontSize: 12, marginTop: 4, textAlign: "center" },

  modalButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#000",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  bookCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 4,
    backgroundColor: "#eee",
  },
  noImage: { justifyContent: "center", alignItems: "center" },
  bookInfo: { flex: 1, marginLeft: 10 },
  bookTitle: { fontSize: 14, fontWeight: "bold", color: "#333" },
  bookAuthors: { fontSize: 12, color: "#555", marginTop: 4 },
  previewButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#007bff",
    borderRadius: 4,
  },
  previewButtonText: { color: "#fff", fontSize: 12 },

  commentRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  commentAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  commentAuthor: { fontWeight: "600" },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  commentSubmitBtn: {
    backgroundColor: "#000",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
